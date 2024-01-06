'use strict';

require('../../src/core/circles_server');

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const jwt = require('jsonwebtoken');
const { CONSTANTS } = require('../../src/core/circles_research');
const formidable = require("formidable");
const XMLHttpRequest = require('xhr2');
const uniqueFilename = require('unique-filename');

const User = require('../models/user');
const Guest = require('../models/guest');
const Model3D = require('../models/model3D');
const CircleGroups = require('../models/circleGroups');
const Circles = require('../models/circles');
const Uploads = require('../models/uploads');
const MagicLinks = require('../models/magicLinks');

// General -----------------------------------------------------------------------------------------------------------------------------------------

// Loading in config  
var env = dotenv.config({});

if (env.error) 
{
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

env = dotenvParseVariables(env.parsed);

// ------------------------------------------------------------------------------------------

// Getting user information to send to pages
const getUserInfo = function(req)
{
  var user = req.user;

  const userInfo = {
    username: user.username,
    usertype: user.usertype,
    email: user.email,
    displayName: user.displayName,
    headUrl: user.gltf_head_url,
    hairUrl: user.gltf_hair_url,
    bodyUrl: user.gltf_body_url,
    headColor: user.color_head,
    hairColor: user.color_hair,
    bodyColor: user.color_body,
    handLeftColor: user.color_hand_left,
    handRightColor: user.color_hand_right,
  }

  return userInfo;
}

// ------------------------------------------------------------------------------------------

// Creating jwt for magic link
const createJWT_MagicLink = function(expiryTimeMin, circles)
{
  const route = '/explore';

  var jwtOptions;

  if (expiryTimeMin)
  {
    jwtOptions = {
      issuer: 'circlesxr.com',
      audience: 'circlesxr.com',
      algorithm: 'HS256',
      expiresIn: expiryTimeMin + 'm',
    };
  }
  else
  {
    jwtOptions = {
      issuer: 'circlesxr.com',
      audience: 'circlesxr.com',
      algorithm: 'HS256',
    };
  }

  const payload = {
    worlds: circles,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, jwtOptions);

  const magicLink = '/magic-login?token=' + token + '&route=' + route;;

  return magicLink;
}

// Login Page --------------------------------------------------------------------------------------------------------------------------------------

// Rendering login page
const serveLogin = async (req, res, next) => 
{
  let errorMessage = null;

  if (req.session.errorMessage)
  {
    errorMessage = req.session.errorMessage;
    req.session.errorMessage = '';
  }

  res.render(path.resolve(__dirname + '/../public/web/views/NEW/login.pug'), {
    message: errorMessage
  });
}

// Register Page -----------------------------------------------------------------------------------------------------------------------------------

// Rendering the register user page with a specific message to the user about their registration (ex. error messages, success messages)
const renderRegister = (res, renderMessage) =>
{
    res.render(path.resolve(__dirname + '/../public/web/views/NEW/register'), {
      title: `Register for Circles`,
      message: renderMessage
    });
}

// ------------------------------------------------------------------------------------------

const serveRegister = async (req, res, next) => 
{
  var errorMessage = null;

  if (req.session.errorMessage)
  {
    errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
  }

  renderRegister(res, errorMessage);
}

// ------------------------------------------------------------------------------------------

// Creates a new user and puts them in the user database
const registerUser = (req, res, next) => 
{
  // Making sure all required fields are there (username, password, and password confirmation)
  if (req.body.username && req.body.password && req.body.passwordConf) 
  {
    // Making sure passwords match
    // If they don't, send an error message to the user
    if (req.body.password !== req.body.passwordConf) 
    {
      console.log('ERROR: Passwords do not match');
      renderRegister(res, 'Passwords do not match');
    }
    else
    {
      // Compiling all data for the new user
      const userData = {
        username: req.body.username,                                    // User entered username
        usertype: CIRCLES.USER_TYPE.PARTICIPANT,                        // Default usertype upon registration is "Participant"
        password: req.body.password,                                    // User entered password
        displayName: req.body.username,                                 // By default, display name is the same as the username
      };

      var user = null;
      var error = null;

      // Creating new user in database
      async function createNewUser(newUser) 
      {
        try {
          user = await User.create(newUser);
        } 
        catch(err) 
        {
          error = err;
        }
      }
      
      createNewUser(userData).then(function() 
      {
        // Checking if there was an error while creating the user and if there was, sending the error to the console
        // If user creation was successfull, outputting a success message to the user
        if (error) 
        {
          console.log("createUser error on [" + userData.username + "]: " + error.message);

          const errorMessage = error.message;

          // Usernames must be unique
          // If there was an error because the username already exists in the database, output an error message to the user
          if ((errorMessage.includes('dup key') === true) && (errorMessage.includes('username') === true))
          {
            req.session.errorMessage = 'Username is unavailable';
            return res.redirect('/register');
          }
          else
          {
            req.session.errorMessage = 'Something went wrong, please try again';
            return res.redirect('/register');
          }
        } 
        else 
        {
          console.log("Successfully added user: " + user.username);
          return next();
        }
      });
    }
  } 
  else 
  {
    req.session.errorMessage = 'Something went wrong, please try again';
    return res.redirect('/register');
  }
}

// Explore Page ------------------------------------------------------------------------------------------------------------------------------------

// Getting certain circles from the circle database
// Permission Types:
//    - public              Returns circles that have no viewing restrictions
//    - private             Returns circles that have viewing restrictions
//    - specialViewing      Returns circles that the user has viewing access to
//    - editing             Returns circles that the user has editing access to
//    - magic               Returns circles that the user has viewing access to from a magic link
const getCircles = async function(user, permissionType)
{
  var circles = []

  if (permissionType === "public")
  {
    circles = await Circles.find({viewingRestrictions: false});
  }
  else if (permissionType === "private")
  {
    circles = await Circles.find({viewingRestrictions: true});
  }
  else if (permissionType === "specialViewing")
  {
    circles = await Circles.find({viewingRestrictions: true, viewingPermissions: { $in: [user] }});
  }
  else if (permissionType === "editing")
  {
    circles = await Circles.find({editingPermissions: { $in: [user] }});
  }
  else if (permissionType === "magic")
  {
    for (const circle of user.magicLinkWorlds)
    {
      circles.push(await Circles.find(circle));
    }
  }

  return circles;
}

// ------------------------------------------------------------------------------------------

// Organizing circles into their groups and subgroups
// Return object structure:
//  {
//    groups: [                             --> Array of group objects
//      {
//        name: GROUP_NAME,                 --> Group name
//        subgroups: [                      --> Array of subgroup objects in the group
//          {
//            name: SUBGROUP_NAME,          --> Subgroup name
//            circles: [                    --> Circles in the subgroup
//              {
//                name: CIRCLE_NAME,
//                displayName: DISPLAY_NAME,
//              }
//            ],
//          }
//        ],
//        noGroup: [                        --> Circles that are not in a subgroup
//          {
//            name: CIRCLE_NAME,
//            displayName: DISPLAY_NAME,
//          }
//        ],                   
//      },
//    ],
//    noGroup: [                            --> Circles that are not in a group
//      {
//        name: CIRCLE_NAME,
//        displayName: DISPLAY_NAME,
//      }
//    ],
//  }
const organizeToGroups = function(circles, databaseGroups)
{
  var organizedCircles = {
    groups: [],
    noGroup: [],
  };

  // Going through each circle
  for (const circle of circles)
  {
    // Checking if circle is in a group
    // If it is, add it to group
    // If it is not, add it to no group array
    if (circle.group && databaseGroups.length > 0)
    {
      // Getting group from database
      var databaseGroup = databaseGroups.find((group) => JSON.stringify(circle.group) === JSON.stringify(group._id));

      // Checking if group already exists in group object array
      // If it does, get it
      // If it doesn't, create the group object
      var group = organizedCircles.groups.find((group) => databaseGroup.name === group.name);

      var index;

      if (group)
      {
        index = organizedCircles.groups.indexOf(group);
      }
      else
      {
        // Creating new group
        var newGroup = {
          name: databaseGroup.name,
          subgroups: [],
          noGroup: [],
        };

        // If the group has subgroups, adding the subgroups
        if (databaseGroup.subgroups)
        {
          for (const subgroup of databaseGroup.subgroups)
          {
            var newSubgroup = {
              name: subgroup.name,
              circles: [],
            };

            newGroup.subgroups.push(newSubgroup);
          }
        }

        organizedCircles.groups.push(newGroup);

        index = organizedCircles.groups.indexOf(newGroup);
      }

      // Checking if circle is in a subgroup
      // If it is, add it to subgroup
      // If it is not, add it to no group array
      if (circle.subgroup)
      {
        var databaseSubgroup = databaseGroup.subgroups.find((subgroup) => JSON.stringify(circle.subgroup) === JSON.stringify(subgroup._id));

        var subgroup = organizedCircles.groups[index].subgroups.find((subgroup) => databaseSubgroup.name === subgroup.name);

        var subIndex = organizedCircles.groups[index].subgroups.indexOf(subgroup);

        organizedCircles.groups[index].subgroups[subIndex].circles.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage});
      }
      else
      {
        organizedCircles.groups[index].noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage});
      }
    }
    else
    {
      organizedCircles.noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage});
    }
  }

  return organizedCircles;
}

// ------------------------------------------------------------------------------------------

// Rendering explore page
const serveExplore = async (req, res, next) => 
{
  // Getting all circles the user has access to and putting their names into an array
  // - All users are given access to circles with no restrictions (public circles)
  // - If user is an admin user, viewing and editing access is given to all circles
  // - If user is a manager user:
  //      - Viewing access is given to to specific circles (ones that they have been given viewing access to)
  //      - Editing access is given to specific circles (ones that they have been given editing access to)
  // - If user is a standard user:
  //      - Viewing access is given to specific circles (ones that they have been given viewing access to)
  //      - No editing access is given
  // - If user is a magic guest
  //      - Viewing access is given to circles in magicLinkCircles array
  //      - No editing access is given
  // - If user is a guest
  //      - No editing access is given

  var user = req.user;

  var magicCircles = [];
  var publicCircles = [];
  var userCircles = [];
  var editableCircles = [];

  // All users
  publicCircles.push(await getCircles(user, 'public'));

  // Admin users
  if (CIRCLES.USER_CATEGORIES.ADMIN_USERS.includes(user.usertype))
  { 
    userCircles.push(await getCircles(user, 'private'));

    editableCircles.push(await getCircles(user, 'public'));
    editableCircles.push(await getCircles(user, 'private'));
  }
  // Manager users
  else if (CIRCLES.USER_CATEGORIES.MANAGER_USERS.includes(user.usertype))
  {
    userCircles.push(await getCircles(user, 'specialViewing'));
    userCircles.push(await getCircles(user, 'editing'));
    editableCircles.push(await getCircles(user, 'editing'));
  }
  // Standard users
  else if (CIRCLES.USER_CATEGORIES.STANDARD_USERS.includes(user.usertype))
  {
    userCircles.push(await getCircles(user, 'specialViewing'));
  }
  // Magic link guest
  else if (user.usertype === CIRCLES.USER_TYPE.MAGIC_GUEST)
  {
    magicCircles.push(await getCircles(user, 'magic'));
  }

  // Flattening the arrays
  magicCircles = magicCircles.flat(2);
  publicCircles = publicCircles.flat(2);
  userCircles = userCircles.flat(2);
  editableCircles = editableCircles.flat(2);

  // Organizing circles in each array into their groups and subgroups
  var groups = await CircleGroups.find({});

  publicCircles = organizeToGroups(publicCircles, groups);
  userCircles = organizeToGroups(userCircles, groups);

  // Getting groups with no circles in them
  var groupedCircles = organizeToGroups(editableCircles, groups);
  var groupsWithCircles = [];
  
  for (const group of groupedCircles.groups)
  {
    groupsWithCircles.push(group.name);
  }

  for (const group of groups)
  {
    if (!groupsWithCircles.includes(group.name))
    {
      var noCircleGroup = {
        name: group.name,
        subgroups: [],
        noGroup: [],
      };

      for (const subgroup of group.subgroups)
      {
        var noCircleSubgroup = {
          name: subgroup.name,
          circles: [],
        };

        noCircleGroup.subgroups.push(noCircleSubgroup);
      }

      groupedCircles.groups.push(noCircleGroup);
    }
  }

  // Organizing editable circles into private and public groups
  // Keeping same object layout as publicCircles and userCircles to make it easier to display
  var groupedEditableCircles = {
    groups: [
      {
        name: 'Private',
        subgroups: [],
        noGroup: [],
      }, 
      {
        name: 'Public',
        subgroups: [],
        noGroup: [],
      }
    ],
    noGroup: [],
  }

  for (const circle of editableCircles)
  {
    if (circle.viewingRestrictions)
    {
      groupedEditableCircles.groups[0].noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage});
    }
    else
    {
      groupedEditableCircles.groups[1].noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage});
    }
  }

  // Organizing editable circles into private and public groups
  // Keeping same object layout as publicCircles and userCircles to make it easier to display
  var groupedMagicCircles = {
    groups: [],
    noGroup: [],
  }

  for (const circle of magicCircles)
  {
    groupedMagicCircles.noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage});
  }

  // Rendering page
  res.render(path.resolve(__dirname + '/../public/web/views/NEW/explore'), 
  {
    title: 'Explore',
    userInfo: getUserInfo(req),
    sessionName: req.session.sessionName,
    magicCircles: groupedMagicCircles,
    publicCircles: publicCircles,
    userCircles: userCircles,
    editableCircles: groupedEditableCircles,
    groupedCircles: groupedCircles,
  });
}

// ------------------------------------------------------------------------------------------

// Updating session name (XMLHttpRequest sent)
const updateSessionName = async (req, res, next) => 
{
  // Ensuring that there is text in the display name (if there is, returning success message)
  // If not, returning error message
  if (req.body.sessionName.length > 0 && req.body.sessionName[0] != ' ')
  {
    req.session.sessionName = req.body.sessionName;

    res.json('updated');
    return;
  }
  else
  {
    res.json('invalid');
    return;
  }
}

// ------------------------------------------------------------------------------------------

// Creating magic link to user requested circles
const createMagicLink = async (req, res, next) =>
{
  if (req.body.forwardingName && req.body.linkExpiry && req.body.magicCircle)
  {
    // Checking that forwarding name is unique
    var forwardingExists;

    try
    {
      forwardingExists = await MagicLinks.findOne({forwardLink: req.body.forwardingName});
    }
    catch(e)
    {
      console.log(e);

      res.json('error');
      return;
    }

    if (!forwardingExists)
    {
      // Getting expiry time of magic link
      var expiryTimeMin;
      var expiryDate;

      if (req.body.linkExpiry === 'never')
      {
        expiryTimeMin = null;
      }
      else if (req.body.linkExpiry === 'custom')
      {
        var date = req.body.customLinkExpiry.split('-');

        var today = new Date();
        expiryDate = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]), 23, 59, 59, 59);

        expiryTimeMin = expiryDate - today;
        expiryTimeMin = Math.round((expiryTimeMin / 1000) / 60);
      }
      else
      {
        var today = new Date();

        expiryDate = new Date();
        var expiry = expiryDate.getDate() + parseInt(req.body.linkExpiry);
        expiryDate.setDate(expiry);
        expiryDate.setHours(23);
        expiryDate.setMinutes(59);
        expiryDate.setSeconds(59);
        expiryDate.setMilliseconds(59);

        expiryTimeMin = expiryDate - today;
        expiryTimeMin = Math.round((expiryTimeMin / 1000) / 60);
      }
      
      // Getting circles to create magic link to
      const circles = [];
      const circleNames = [];

      if (Array.isArray(req.body.magicCircle))
      {
        for (const magicCircle of req.body.magicCircle)
        {
          try 
          {
            var circle = await Circles.findOne({name: magicCircle});

            circles.push(circle);
            circleNames.push(circle.displayName)
          }
          catch (err)
          {
            console.log(err);

            res.json('error');
            return;
          }
        }
      }
      else
      {
        try 
        {
          var circle = await Circles.findOne({name: req.body.magicCircle});

          circles.push(circle);
          circleNames.push(circle.displayName)
        }
        catch (err)
        {
          console.log(err);

          res.json('error');
          return;
        }
      }

      // Creating magic link
      const magicLink = createJWT_MagicLink(expiryTimeMin, circles);

      var baseURL;

      if (env.DOMAIN)
      {
        baseURL = env.DOMAIN;
      }
      else
      {
        baseURL = req.get('host');
      }

      const forwardingLink = baseURL + '/' + req.body.forwardingName;

      // Saving magic link in database
      var linkInfo;

      // Saving magic link in database
      if (expiryTimeMin)
      {
        linkInfo = {
          creator: await User.findById(req.user._id).exec(),
          forwardLink: req.body.forwardingName,
          magicLink: magicLink,
          expires: true,
          expiryDate: expiryDate,
          worlds: circleNames,
        }
      }
      else
      {
        linkInfo = {
          creator: await User.findById(req.user._id).exec(),
          forwardLink: req.body.forwardingName,
          magicLink: magicLink,
          expires: false,
          worlds: circleNames,
        }
      }

      try
      {
        await MagicLinks.create(linkInfo);
      }
      catch(e)
      {
        res.json('error');
        return;
      }
      
      var response = {
        forwardingLink: forwardingLink,
        circles: circleNames,
      }

      res.json(response);
      return;
    }
    else
    {
      res.json('forwarding name exists');
      return;
    }
  }
  else
  {
    res.json('error');
    return;
  }
}

// Manage Groups Page ------------------------------------------------------------------------------------------------------------------------------

// Creating group on user request
const createGroup = async (req, res, next) =>
{
  if (req.body.group) 
  {
    // Checking if the group already exists
    // If it does, send an error message
    // If it doesn't, create the group
    if (await CircleGroups.findOne({name: req.body.group}))
    {
      res.json('group exists');
      return;
    }
    else
    {
      var group = {
        name: req.body.group,
        subgroups: [],
      }

      // Validating subgroup value 
      // Subgroup can't have a repeat value
      function validateSubgroup(name, subgroupsAdded)
      {
        for (const subgroup of subgroupsAdded)
        {
          if (name === subgroup.name)
          {
            return false;
          }
        }

        return true;
      }

      // Adding subgroups
      // req.body.subgroups will either be:
      //    - ''                                    --> Nothing (won't trigger if statment)
      //    - 'subgroup'                            --> Not array (only 1 subgroup and will add that)
      //    - ['subgroup1', 'subgroup2', ...]       --> Array (will loop through and add each subgroup)
      if (req.body.subgroups && req.body.subgroups.length > 0)
      {
        if (Array.isArray(req.body.subgroups))
        {
          for(const subgroup of req.body.subgroups)
          {
            if (subgroup.length > 0 && validateSubgroup(subgroup, group.subgroups))
            {
              group.subgroups.push({name: subgroup});
            }
          }
        }
        else
        {
          if (validateSubgroup(req.body.subgroups, group.subgroups))
          {
            group.subgroups.push({name: req.body.subgroups});
          }
        }
      }

      // Adding group to database
      try
      {
        await CircleGroups.create(group);

        res.json('success');
        return;
      }
      catch(e)
      {
        console.log(e);

        res.json('error');
        return;
      }
    }
  }
  else
  {
    res.json('error');
    return;
  }
}

// ------------------------------------------------------------------------------------------

// Creating subgroup on user request
const createSubgroup = async (req, res, next) =>
{
  if (req.body.group && req.body.subgroup) 
  {
    // Getting group from database
    var group;

    try
    {
      group = await CircleGroups.findOne({name: req.body.group});
    }
    catch(e)
    {
      console.log(e)

      res.json('error');
      return;
    }

    if (group)
    {
      // Checking that a subgroup of that name doesn't already exist
      for (const subgroup of group.subgroups)
      {
        if (subgroup.name === req.body.subgroup)
        {
          res.json('subgroup exists');
          return;
        }
      }

      // Adding subgroup to group
      try
      {
        group.subgroups.push({name: req.body.subgroup})
        await group.save();

        res.json('success');
        return;
      }
      catch(e)
      {
        console.log(e);

        res.json('error');
        return;
      }
    }
  }
}

// ------------------------------------------------------------------------------------------

// Deleting group on user request
const deleteGroup = async (req, res, next) =>
{
  // Getting group from database
  var group = await CircleGroups.findOne({name: req.body.group});

  if (group)
  {
    // Finding all circles that are in the group
    var circles = await Circles.find({group: group._id});

    // Removing the circles from the group
    for (const circle of circles)
    {
      circle.group = null;
      circle.subgroup = null;

      await circle.save();
    }

    // Deleting group
    try
    {
      await CircleGroups.deleteOne({_id: group._id});
    }
    catch(e)
    {
      console.log(e);
    }
  }
}

// ------------------------------------------------------------------------------------------

// Deleting group on user request
const deleteSubgroup = async (req, res, next) =>
{
  // Getting group from database
  var group = await CircleGroups.findOne({name: req.body.group});
  
  if (group)
  {
    // Finding subgroup and deleting it
    var deletedSubgroup;

    for (const subgroup of group.subgroups)
    {
      if (subgroup.name === req.body.subgroup)
      {
        deletedSubgroup = subgroup;

        try
        {
          var index = group.subgroups.indexOf(subgroup);
          group.subgroups.splice(index, 1);

          await group.save();
        }
        catch(e)
        {
          console.log(e);
        }

        break;
      }
    }

    // Finding all circles that are in the group
    var circles = await Circles.find({group: group._id});

    // Removing the circles from the subgroup
    for (const circle of circles)
    {
      if (JSON.stringify(circle.subgroup) === JSON.stringify(deletedSubgroup._id))
      {
        circle.subgroup = null;
      }

      await circle.save();
    }
  }
}

// Manage Circle Page ------------------------------------------------------------------------------------------------------------------------------

// Rendering manage circle page
const serveManageCircle = async (req, res, next) =>
{
  // url: /manage-circle/circle_id
  // split result array: {"", "manage-circle", "circle_id"}
  const circleID = req.url.split('/')[2];
  
  // Getting circle to send to manage-circle page
  const circle = await Circles.findOne({name: circleID});

  // Getting information of all existing groups
  const allGroups = await CircleGroups.find({});

  if (circle)
  {
    var group = null;
    var groupName = null;
    var subgroupName = null;

    if (circle.group)
    {
      group = await CircleGroups.findById(circle.group);

      groupName = group.name;

      if (group.subgroups)
      {
        for (const subgroup of group.subgroups)
        {
          if (JSON.stringify(subgroup._id) === JSON.stringify(circle.subgroup))
          {
            subgroupName = subgroup.name;
          }
        }
      }
    }

    // Getting all users from database
    const users = await User.find({});

    var userPermissions = [];

    // For each user, checking user permissions for the circle
    for (const user of users)
    {
      // Checking if it is not the current user
      if (JSON.stringify(user._id) !== JSON.stringify(req.user._id) && user.usertype !== CIRCLES.USER_TYPE.SUPERUSER)
      {
        var userPermission = {
          username: user.username,
          usertype: user.usertype,
          viewing: false,
          editing: false,
        }
  
        if (circle.viewingPermissions.includes(user._id))
        {
          userPermission.viewing = true;
        }
  
        if (circle.editingPermissions.includes(user._id))
        {
          userPermission.editing = true;
        }
  
        userPermissions.push(userPermission);
      }
    }

    const userInfo = getUserInfo(req);
  
    // Rendering the manage circle page
    res.render(path.resolve(__dirname + '/../public/web/views/NEW/manage-circle'), {
      title: 'Manage ' + circle.name,
      userInfo: userInfo,
      circle: circle,
      circleGroup: groupName,
      circleSubgroup: subgroupName,
      userPermissions: userPermissions,
      allGroups: allGroups,
    });
  }
}

// ------------------------------------------------------------------------------------------

// Updating circle to have public or private access on user request
const updateAccessRestriction = async (req, res, next) => 
{
  // Finding circle in database with that name
  const circle = await Circles.findOne({name: req.body.circle});

  if (circle)
  {
    if (req.body.restriction === 'true')
    {
      try
      {
        // Changing circle access restrictions to true
        circle.viewingRestrictions = true;
        await circle.save();
      }
      catch (e)
      {
        console.log(e);
      }
    }
    else
    {
      try
      {
        // Changing circle access restrictions to false
        circle.viewingRestrictions = false;
        await circle.save();
      }
      catch (e)
      {
        console.log(e);
      }
    }
  }

  res.json('success');
}

// ------------------------------------------------------------------------------------------

// Updating user viewing access for circle on user request
const updateUserViewing = async (req, res, next) => 
{
  // Finding the user in database with that username
  const user = await User.findOne({username: req.body.user});

  // Finding circle in database with that name
  const circle = await Circles.findOne({name: req.body.circle});

  if (user && circle)
  {
    if (req.body.viewing === 'true')
    {
      try
      {
        // Adding the user from the list of permitted users
        circle.viewingPermissions.push(user);
        await circle.save();

      }
      catch(e)
      {
        console.log(e);
      }
    }
    else
    {
      try
      {
        // Removing the user from the list of permitted users
        circle.viewingPermissions.pull(user);
        await circle.save();

      }
      catch(e)
      {
        console.log(e);
      }
    }
  }
}

// ------------------------------------------------------------------------------------------

// Updating user editing access for circle on user request
const updateUserEditing = async (req, res, next) => 
{
  // Finding the user in database with that username
  const user = await User.findOne({username: req.body.user});

  // Finding circle in database with that name
  const circle = await Circles.findOne({name: req.body.circle});

  if (user && circle)
  {
    if (req.body.editing === 'true')
    {
      try
      {
        // Adding the user from the list of permitted users
        circle.editingPermissions.push(user);
        await circle.save();

      }
      catch(e)
      {
        console.log(e);
      }
    }
    else
    {
      try
      {
        // Removing the user from the list of permitted users
        circle.editingPermissions.pull(user);
        await circle.save();

      }
      catch(e)
      {
        console.log(e);
      }
    }
  }
}

// Update Circle Group Page ------------------------------------------------------------------------------------------------------------------------

// Updating circle group and subgroup on user request
const updateCircleGroup = async (req, res, next) =>
{
  if (req.body.circle && req.body.group && req.body.subgroup)
  {
    // Getting circle from database
    var circle = null;

    try
    {
      circle = await Circles.findOne({name: req.body.circle});
    }
    catch(e)
    {
      console.log(e);
    }

    if (circle)
    {
      // If 'No Group' was selected, removing circle from any group
      // Otherwise, adding circle to selected group
      if (req.body.group.replaceAll('-', ' ') === 'No Group')
      {
        circle.group = null;
        circle.subgroup = null;
      }
      else
      {
        // Getting group from database
        var group = null;

        try
        {
          group = await CircleGroups.findOne({name: req.body.group.replaceAll('-', ' ')});
        }
        catch(e)
        {
          console.log(e);
        }

        if (group)
        {
          circle.group = group._id;

          // If 'No Subgroup' was selected, removing circle from any subgroup
          // Otherwise, adding circle to selected subgroup
          if (req.body.subgroup.replaceAll('-', ' ') === 'No Subgroup')
          {
            circle.subgroup = null;
          }
          else
          {
            for (const subgroup of group.subgroups)
            {
              if (subgroup.name === req.body.subgroup.replaceAll('-', ' '))
              {
                circle.subgroup = subgroup._id;
              }
            }
          }
        }
      }

      await circle.save();
    }
  }

  return res.redirect('/manage-circle/' + req.body.circle);
}

// Profile Page ------------------------------------------------------------------------------------------------------------------------------------

// Rendering profile page
const serveProfile = async (req, res, next) =>
{
  var user = req.user;

  res.render(path.resolve(__dirname + '/../public/web/views/NEW/profile'), {
    title: 'Welcome ' + user.username,
    userInfo: user,
  });
}

// ------------------------------------------------------------------------------------------

// Updating user profile
const updateUserProfile = async (req, res, next) => 
{
  var accountUpdated = false;
  var user; 

  // Getting user from database
  if (req.user.usertype === CIRCLES.USER_TYPE.GUEST)
  {
    user = await Guest.findOne({_id: req.user._id}).exec();
  }
  else
  {
    user = await User.findOne({_id: req.user._id}).exec();
  }

  if (user)
  {
    const userData = {};

    // Checking if display name was updated
    if (req.body.displayName !== user.displayName)
    {
      // Ensuring that there is text in the display name
      // If not, assigning the display name to be the username
      if (req.body.displayName.length > 0 && req.body.displayName[0] != ' ')
      {
        userData.displayName = req.body.displayName;
      }
      else
      {
        userData.displayName = user.username;
      }

      req.session.sessionName = userData.displayName;

      accountUpdated = true;
    }

    // Checking if email was updated
    if (req.body.email)
    {
      if (req.body.email !== user.email)
      {
        userData.email = req.body.email;
        accountUpdated = true;
      }
    }

    // Checking if the user wants to delete their email from their account
    // If the checkbox was checked
    if (req.body.deleteEmail)
    {
      userData.email = '';
      accountUpdated = true;
    }

    // Checking if password was updated
    if (req.body.passwordOld) 
    {
      // Checking if old password field matches the database
      // If they do not, output an error message to the user
      if (user.comparePasswords(req.body.passwordOld))
      {
        // Checking if the new password and the password confirmation field matches
        // If they do, update the user password to the new password
        // If they don't, output an error message
        if ( req.body.passwordNew === req.body.passwordConf )
        {
          userData.password = req.body.passwordNew;
          accountUpdated = true;
        }
        else
        {
          res.json('passwords do not match');
        }
      }
      else
      {
        res.json('old password incorrect');
      }
    }

    // Updating database
    if (accountUpdated)
    {
      try 
      {
        if (user.usertype === CIRCLES.USER_TYPE.GUEST)
        {
          await Guest.findOneAndUpdate({_id:req.user._id}, userData, {new:true});
        }
        else
        {
          await User.findOneAndUpdate({_id:req.user._id}, userData, {new:true});
        }

        res.json('success');
        return;
      } 
      catch(e) 
      {
        console.log(e);

        res.json('error');
        return;
      }
    }
  }
  else
  {
    res.json('error');
    return;
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
  // Login Page
  serveLogin,
  // Register Page
  serveRegister,
  registerUser,
  // Explore Page
  serveExplore,
  updateSessionName,
  createMagicLink,
  // Manage Groups Page
  createGroup,
  createSubgroup,
  deleteGroup,
  deleteSubgroup,
  // Manage Circle Page
  serveManageCircle,
  updateAccessRestriction,
  updateUserViewing,
  updateUserEditing,
  // Update Circle Group Page
  updateCircleGroup,
  // Profile Page 
  serveProfile,
  updateUserProfile,
}