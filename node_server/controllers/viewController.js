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
const { createMailTransporter } = require('../../src/core/circles_mailTransporter');
const crypto = require('crypto');

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

// Checking that user name is valid
const validUsername = function(username)
{
  if (username.includes(' '))
  {
    return false;
  }
  else if (username.includes("'"))
  {
    return false;
  }
  else if (username.includes('"'))
  {
    return false;
  }

  return true;
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

  const magicLink = '/magic-login?token=' + token + '&route=' + route;

  return magicLink;
}

// Login Page --------------------------------------------------------------------------------------------------------------------------------------

// Rendering login page
const serveLogin = async (req, res, next) => 
{
  var errorMessage = null;
  var successMessage = null;

  if (req.session.errorMessage)
  {
    errorMessage = req.session.errorMessage;
    req.session.errorMessage = '';
  }

  if (req.session.successMessage)
  {
    successMessage = req.session.successMessage;
    req.session.successMessage = '';
  }

  res.render(path.resolve(__dirname + '/../public/web/views/login'), {
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
}

// ------------------------------------------------------------------------------------------

const invalidAddress = function(req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/login'), {
    message: 'Invalid address entered'
  });
}

// ------------------------------------------------------------------------------------------

// If a magic link forward address was entered, direct to the magic link
// Otherwise, direct them to error page
const forwardMagicLink = async (req, res, next) => 
{
  // url: /forwarding_name
  // split result array: {"", "forwarding_name"}
  const forwardName = req.url.split('/')[1];

  // Checking if the forwarding link is in the database
  // If it is, redirect the user
  // If it isn't direct them to an error page

  var magicLink;

  try
  {
    magicLink = await MagicLinks.findOne({forwardLink: forwardName}).exec();
  }
  catch(e)
  {
    console.log(e);

    invalidAddress(req, res, next);
  }

  if (magicLink)
  {
    return res.redirect(magicLink.magicLink);
  }
  else
  {
    invalidAddress(req, res, next);
  }
}

// Register Page -----------------------------------------------------------------------------------------------------------------------------------

// Rendering the register user page with a specific message to the user about their registration (ex. error messages, success messages)
const renderRegister = (res, renderMessage) =>
{
    res.render(path.resolve(__dirname + '/../public/web/views/register'), {
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

// Registering new user
// https://www.youtube.com/watch?v=HI_KKUvcwtk
const registerUser = (req, res, next) =>
{
  var errorResponse = {
    status: 'error',
    error: 'Something went wrong, please try again',
  }

  // Making sure all required fields are there (username, email, and password)
  if (req.body.username && req.body.email && req.body.password) 
  {
    // Checking that username does not contain any invalid characters
    if (!validUsername(req.body.username))
    {
      errorResponse.error = 'Username contains invalid character (space, \', ")';
      
      res.json(errorResponse);
      return;
    }

    // Compiling all data for the new user
    const userData = {
      username: req.body.username,                                    // User entered username
      usertype: CIRCLES.USER_TYPE.PARTICIPANT,                        // Default usertype upon registration is "Participant"
      email: req.body.email,                                          // User entered email
      emailToken: crypto.randomBytes(64).toString('hex'),             // Token to verify email
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
      // If user creation was successful, sending verification email
      if (error) 
      {
        console.log("createUser error on [" + userData.username + "]: " + error.message);

        const errorMessage = error.message;

        // Usernames must be unique
        // If there was an error because the username already exists in the database, output an error message to the user
        if ((errorMessage.includes('dup key') === true) && (errorMessage.includes('username') === true))
        {
          errorResponse.error = 'Username is unavailable';
      
          res.json(errorResponse);
          return;
        }
        else
        {
          res.json(errorResponse);
          return;
        }
      } 
      else 
      {
        // Sending email verification email with unique token
        const transporter = createMailTransporter();

        var emailContent = '<h3 style="margin-top:0; margin-bottom:20px">Welcome to uni-VR-sity!</h3><p style="margin-bottom:8px;">Hello ';
        emailContent += userData.username;
        emailContent += ', </p><p style="margin-top:0">You are almost ready to begin exploring, just click on the button below to verify your email! The link will expire in 24 hours.</p><a href="http://localhost:1111/verify-email/'
        emailContent += userData.emailToken;
        emailContent += '" style="display:inline-block; padding:0 15px; margin-top:7.5px; line-height:40px; text-decoration:none; border-radius:6px; background-color:#0f68bb; color:white">Verify Email</a>'

        const mailOptions = {
          from: '"uni-VR-sity" <' + env.EMAIL + '>',
          to: userData.email,
          subject: "uni-VR-sity Email Verification",
          html: emailContent,
        };

        // Sending email
        // If email is sent, returning success message
        // Otherwise deleting user entry in database and returning an error message
        transporter.sendMail(mailOptions, async (error, info) => 
        {
          if (error)
          {
            try
            {
              await User.deleteOne({username: userData.username});
            }
            catch(e) { }

            res.json(errorResponse);
            return;
          }
          else
          {
            var response = {
              status: 'success',
            };
          
            res.json(response);
            return;
          }
        });
      }
    });
  }
  else
  {
    res.json(errorResponse);
    return;
  }
}

// ------------------------------------------------------------------------------------------

// Verifying user email through unique token
const verifyUserEmail = async (req, res, next) => 
{
  // url: /verify-email/token
  // split result array: {"", "verify-email", "token"}
  const token = req.url.split('/')[2];

  // Getting user with email token from database
  var user = null;

  try
  {
    user = await User.findOne({emailToken: token});
  }
  catch(e)
  {
    console.log(e);

    req.session.errorMessage = 'Something went wrong, please try again';
    return res.redirect('/login');
  }

  // If user is found, updating them to be verified
  // Otherwise returning that email verification link has expired
  if (user)
  {
    var updatedUserData = {
      verified: true,
      emailToken: user._id,       // Can't be null because key must be unique
      expireAt: null
    }

    try
    {
      await User.findOneAndUpdate({emailToken: token}, updatedUserData);

      console.log(user.username + "'s email verified");

      req.session.successMessage = 'Email successfully verified';
      return res.redirect('/login');
    }
    catch(e)
    {
      console.log(e);

      req.session.errorMessage = 'Something went wrong, please try again';
      return res.redirect('/login');
    }
  }
  else
  {
    req.session.errorMessage = 'Email verification link expired, please create a new account';
    return res.redirect('/login');
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

        organizedCircles.groups[index].subgroups[subIndex].circles.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage, credit: circle.credit, description: circle.description, extraInfo: circle.extraInfo, contact: circle.contact});
      }
      else
      {
        organizedCircles.groups[index].noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage, credit: circle.credit, description: circle.description, extraInfo: circle.extraInfo, contact: circle.contact});
      }
    }
    else
    {
      organizedCircles.noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage, credit: circle.credit, description: circle.description, extraInfo: circle.extraInfo, contact: circle.contact});
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
      groupedEditableCircles.groups[0].noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage, credit: circle.credit, description: circle.description, extraInfo: circle.extraInfo, contact: circle.contact});
    }
    else
    {
      groupedEditableCircles.groups[1].noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage, credit: circle.credit, description: circle.description, extraInfo: circle.extraInfo, contact: circle.contact});
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
    groupedMagicCircles.noGroup.push({name: circle.name, displayName: circle.displayName, hasProfileImage: circle.hasProfileImage, credit: circle.credit, description: circle.description, extraInfo: circle.extraInfo, contact: circle.contact});
  }

  // Rendering page
  res.render(path.resolve(__dirname + '/../public/web/views/explore'), 
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
      if (JSON.stringify(user._id) !== JSON.stringify(req.user._id) && !CIRCLES.USER_CATEGORIES.ADMIN_USERS.includes(user.usertype))
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
    res.render(path.resolve(__dirname + '/../public/web/views/manage-circle'), {
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

  res.render(path.resolve(__dirname + '/../public/web/views/profile'), {
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
  if (req.user.usertype === CIRCLES.USER_TYPE.GUEST || req.user.usertype === CIRCLES.USER_TYPE.MAGIC_GUEST)
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
        if (req.user.usertype === CIRCLES.USER_TYPE.GUEST || req.user.usertype === CIRCLES.USER_TYPE.MAGIC_GUEST)
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
    console.log('Could not find user (' + req.user._id + ') to update profile');
    res.json('error');
    return;
  }
}

// Manage Users Page -------------------------------------------------------------------------------------------------------------------------------

// Rendering manage users page
const serveManageUsers = async (req, res, next) =>
{
  // Getting current user info
  const userInfo = getUserInfo(req);

  // Getting messages to output to user
  var singleCreateError = null;           // Success message for user creation
  var singleCreateSuccess = null;         // Error message for user creation
  var bulkCreateError = [];               // Success message for user creation
  var bulkCreateSuccess = [];             // Error message for user creation
  var updateUsertypeError = [];           // Error message for usertype update
  var updateUsertypeSuccess = [];         // Success message for usertype update

  if (req.session.singleCreateError)
  {
    singleCreateError = req.session.singleCreateError;
    req.session.singleCreateError = null;
  }

  if (req.session.singleCreateSuccess)
  {
    singleCreateSuccess = req.session.singleCreateSuccess;
    req.session.singleCreateSuccess = null;
  }

  if (req.session.bulkCreateError && req.session.bulkCreateError.length > 0)
  {
    bulkCreateError = req.session.bulkCreateError;
    req.session.bulkCreateError = null;
  }

  if (req.session.bulkCreateSuccess && req.session.bulkCreateSuccess.length > 0)
  {
    bulkCreateSuccess = req.session.bulkCreateSuccess;
    req.session.bulkCreateSuccess = null;
  }

  if (req.session.updateUsertypeError && req.session.updateUsertypeError.length > 0)
  {
    updateUsertypeError = req.session.updateUsertypeError;
    req.session.updateUsertypeError = null;
  }

  if (req.session.updateUsertypeSuccess && req.session.updateUsertypeSuccess.length > 0)
  {
    updateUsertypeSuccess = req.session.updateUsertypeSuccess;
    req.session.updateUsertypeSuccess = null;
  }

  // 1. Ignoring the current user
  // 2. Getting all admin users
  var adminUsers = await User.aggregate([
    {
      $match:
        // 1
        {
          _id: { $nin: [req.user._id] },
        },
    },
    {
      $match:
        // 2
        {
          usertype: CIRCLES.USER_TYPE.ADMIN,
        },
    },
  ]);

  // 1. Ignoring the current user
  // 2. Getting all teacher users
  var teacherUsers = await User.aggregate([
    {
      $match:
        // 1
        {
          _id: { $nin: [req.user._id] },
        },
    },
    {
      $match:
        // 2
        {
          usertype: CIRCLES.USER_TYPE.TEACHER,
        },
    },
  ]);

  // 1. Ignoring the current user
  // 2. Getting all researcher users
  var researcherUsers = await User.aggregate([
    {
      $match:
        // 1
        {
          _id: { $nin: [req.user._id] },
        },
    },
    {
      $match:
        // 2
        {
          usertype: CIRCLES.USER_TYPE.RESEARCHER,
        },
    },
  ]);

  // 1. Ignoring the current user
  // 2. Getting all student users
  var studentUsers = await User.aggregate([
    {
      $match:
        // 1
        {
          _id: { $nin: [req.user._id] },
        },
    },
    {
      $match:
        // 2
        {
          usertype: CIRCLES.USER_TYPE.STUDENT,
        },
    },
  ]);

  // 1. Ignoring the current user
  // 2. Getting all tester users
  var testerUsers = await User.aggregate([
    {
      $match:
        // 1
        {
          _id: { $nin: [req.user._id] },
        },
    },
    {
      $match:
        // 2
        {
          usertype: CIRCLES.USER_TYPE.TESTER,
        },
    },
  ]);

  // 1. Ignoring the current user
  // 2. Getting all participant users
  var participantUsers = await User.aggregate([
    {
      $match:
        // 1
        {
          _id: { $nin: [req.user._id] },
        },
    },
    {
      $match:
        // 2
        {
          usertype: CIRCLES.USER_TYPE.PARTICIPANT,
        },
    },
  ]);

  res.render(path.resolve(__dirname + '/../public/web/views/manage-users'), {
    title: 'Manage Users',
    singleCreateError: singleCreateError,
    singleCreateSuccess: singleCreateSuccess,
    bulkCreateError: bulkCreateError,
    bulkCreateSuccess: bulkCreateSuccess,
    updateUsertypeError: updateUsertypeError,
    updateUsertypeSuccess: updateUsertypeSuccess,
    userInfo: userInfo,
    adminUsers,
    teacherUsers,
    researcherUsers,
    studentUsers,
    testerUsers,
    participantUsers,
  });
}

// ------------------------------------------------------------------------------------------

// Creating new user on user request
const createUser = async (req, res, next) => 
{
  if (req.body.username && req.body.usertype)
  {
    // Checking that username does not contain any invalid characters
    if (!validUsername(req.body.username))
    {
      req.session.singleCreateError = 'Username contains invalid character (space, \', ")';
      return res.redirect('/manage-users');
    }

    // Compiling all data for the new user
    const userData = {
      username: req.body.username,                    // User entered username
      usertype: req.body.usertype,                    // User entered usertype
      password: env.DEFAULT_PASSWORD,                 // Default password
      displayName: req.body.username,                 // By default, display name is the same as the username
    };

    // Creating new user in database
    try 
    {
      await User.create(userData);

      req.session.singleCreateSuccess = userData.username + ' created successfully';
      return res.redirect('/manage-users');
    } 
    catch(error) 
    {
      // Usernames must be unique
      // If there was an error because the username already exists in the database, output an error message to the user
      if ((error.message.includes('dup key') === true) && (error.message.includes('username') === true))
      {
        req.session.singleCreateError = 'Username is unavailable';
        return res.redirect('/manage-users');
      }

      req.session.singleCreateError = 'Something went wrong, please try again';
      return res.redirect('/manage-users');
    }
  }
  else
  {
    req.session.singleCreateError = 'Something went wrong, please try again';
    return res.redirect('/manage-users');
  }
}

// ------------------------------------------------------------------------------------------

// Creating new users through uploaded file
const bulkCreateUsers = async (req, res, next) => 
{
  // Setting up user message as arrays to allow for multiple messages
  req.session.bulkCreateSuccess = [];
  req.session.bulkCreateError = [];

  // Variable to count how many users were created
  var numCreated = 0;

  // Getting file
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => 
  {
    if (err)
    {
      req.session.bulkCreateError.push('File could not be read, please try again');
      return res.redirect('/manage-users');
    }

    const file = files.userFile;

    // file: fileContentType/fileType
    // split result array: {"fileContentType", "fileType"}
    const fileType = file.mimetype.split('/')[1];

    // Checking if file is of the correct type
    // If it is, read the file
    // If it isn't, output error message to user
    if (fileType === 'csv')
    {
      fs.readFile(file.filepath, 'utf8', async function(err, data) 
      {
        if (err)
        {
          req.session.bulkCreateError.push('File could not be read, please try again');
          return res.redirect('/manage-users');
        }

        // Splitting up the file enteries (each entry is on a seperate line)
        const entries = data.split(/\r?\n/);

        // Reading each entry (each entry being a user) and getting the username and usertype
        // Entries are organized as username,usertype
        for (const entry of entries)
        {
          const entryInfo = entry.split(',');

          // Ensuring entry has the correct amount of data
          // Otherwise outputting an error message for the entry
          if (entryInfo.length === 2)
          {
            // Getting user info
            const userInfo = {
              username: entryInfo[0],                         // User entered username
              usertype: entryInfo[1],                         // User entered usertype
              password: env.DEFAULT_PASSWORD,                 // Default password
              displayName: entryInfo[0],                      // By default, display name is the same as the username
            }

            // Checking that username does not contain any invalid characters
            if (validUsername(userInfo.username))
            {
              // Ensuring usertype is valid
              var validUsertypes = [];

              for (const key in CIRCLES.USER_TYPE)
              {
                if (CIRCLES.USER_TYPE[key] !== CIRCLES.USER_TYPE.SUPERUSER && CIRCLES.USER_TYPE[key] !== CIRCLES.USER_TYPE.GUEST && CIRCLES.USER_TYPE[key] !== CIRCLES.USER_TYPE.MAGIC_GUEST)
                {
                  validUsertypes.push(CIRCLES.USER_TYPE[key]);
                }
              }

              if (validUsertypes.includes(userInfo.usertype))
              {
                try 
                {
                  var user = null;

                  user = await User.create(userInfo);

                  if (user)
                  {
                    numCreated += 1;
                  }
                } 
                catch(err) 
                {
                  const errorMessage = err.message;

                  // Usernames must be unique
                  // If there was an error because the username already exists in the database, output an error message to the user
                  if ((errorMessage.includes('dup key') === true) && (errorMessage.includes('username') === true))
                  {
                    req.session.bulkCreateError.push('The following entry contains an unavailable username: ' + entry);
                  }
                  else
                  {
                    req.session.bulkCreateError.push('An unexpected error occured when creating the following user: ' + entry);
                  }
                }
                
              }
              else
              {
                req.session.bulkCreateError.push('The following entry has an invalid usertype: ' + entry);
              }
            }
            else
            {
              req.session.bulkCreateError.push('The following entry contains an username with an invalid character (space, \', ") : ' + entry);
            }
          }
          else
          {
            if (entryInfo.length === 1 && entryInfo[0].length === 0)
            {
              // Do nothing as it was just a blank entry
            }
            else
            {
              req.session.bulkCreateError.push('The following entry is invalid: ' + entry);
            }
          }
        }

        req.session.bulkCreateSuccess.push(numCreated + ' user(s) were successfully created');
        return res.redirect('/manage-users');
      });
    }
    // This file type means no file was uploaded
    else if (fileType === 'octet-stream')
    {
      req.session.bulkCreateError.push('No file uploaded' );
      return res.redirect('/manage-users');
    }
    else
    {
      req.session.bulkCreateError.push('Incorrect file type uploaded: ' + fileType.toUpperCase() + ' files are not allowed' );
      return res.redirect('/manage-users');
    }
  });
}

// ------------------------------------------------------------------------------------------

// Creating new users through uploaded file
const updateUsertype = async (req, res, next) => 
{
  // Setting up user message as arrays to allow for multiple messages
  req.session.updateUsertypeError = [];
  req.session.updateUsertypeSuccess = [];

  for (const username in req.body)
  {
    // Getting user from database
    const user = await User.findOne({username: username});
    
    // If the user was found in the database
    // Checking if the usertype the user has entered is different then what it currently is
    if (user)
    {
      // If it is, changing the user's usertype in the database
      if (user.usertype !== req.body[username])
      {
        const updatedUser = await User.findOneAndUpdate({username: username}, {usertype: req.body[username]}, {new:true});

        if (updatedUser)
        {
          const message = user.username + "'s usertype successfully updated to " + req.body[username];

          req.session.updateUsertypeSuccess.push(message);
        }
        else
        {
          const message = user.username + "'s usertype failed to updated, please try again";

          req.session.updateUsertypeError.push(message);
        }
      }
    }
  }

  return res.redirect('/manage-users');
}

// ------------------------------------------------------------------------------------------

// Deleting specified user
const deleteUser = async (req, res, next) =>
{
  var errorResponse = {
    status: 'error',
    error: 'Something went wrong, please try again',
  }

  if (req.body.username) 
  {
    // Checking if currect user is an admin user
    if (CIRCLES.USER_CATEGORIES.ADMIN_USERS.includes(req.user.usertype))
    {
      // Deleting user from database
      try
      {
        await User.deleteOne({username: req.body.username});
      }
      catch(e)
      {
        console.log(e);
    
        errorResponse.error = req.body.username + 'could not be deleted, please try again';

        res.json(errorResponse);
        return;
      }

      var response = {
        status: 'success',
      }

      res.json(response);
      return;
    }
    else
    {
      errorResponse.error = 'Unauthorized access';
    
      res.json(errorResponse);
      return;
    }
  }
  else
  {
    res.json(errorResponse);
    return;
  }
}

// Your Magic Links Page ---------------------------------------------------------------------------------------------------------------------------

// Rendering your magic links page
const serveYourMagicLinks = async (req, res, next) =>
{
  const userInfo = getUserInfo(req);

  // Getting user's magic links
  var magicLinks = [];

  var currentUser = req.user;

  magicLinks = await MagicLinks.find({creator: currentUser});

  // Getting current domain
  var baseURL;

  if (env.DOMAIN)
  {
    baseURL = env.DOMAIN;
  }
  else
  {
    baseURL = req.get('host');
  }

  res.render(path.resolve(__dirname + '/../public/web/views/your-magic-links'), {
    title: "Your Magic Links",
    userInfo: userInfo,
    magicLinks: magicLinks,
    baseURL: baseURL,
  });
}

// ------------------------------------------------------------------------------------------

// Renewing magic link
const renewMagicLink = async (req, res, next) =>
{
  if (req.body.linkExpiry)
  {
    // Getting expiry time of magic link (if there is one)
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

    var link = null;

    // Getting link from database
    try
    {
      link = await MagicLinks.findOne({forwardLink: req.body.magicLink}).exec();
    }
    catch(e)
    {
      console.log(e);
    }

    if (link)
    {
      var circles = [];

      // Getting circles for magic link
      for (const circle of link.worlds)
      {
        try 
        {
          circles.push(await Circles.findOne({displayName: circle}));
        }
        catch (e)
        {
          console.log(e);

          return res.redirect('/your-magic-links');
        }
      }

      console.log(circles);

      // Creating magic link
      const magicLink = createJWT_MagicLink(expiryTimeMin, circles);

      // Saving new magic link in database
      link.magicLink = magicLink;

      if (expiryTimeMin)
      {
        link.expires = true;
        link.expiryDate = expiryDate;

        link.markModified('expiryDate');
      }
      else
      {
        link.expires = false;
      }

      try
      {
        await link.save();
      }
      catch(e)
      {
        console.log(e);
      }
    }
  }

  return res.redirect('/your-magic-links');
}

// ------------------------------------------------------------------------------------------

// Deleting magic link
const deleteMagicLink = async (req, res, next) => 
{
  // Getting link from database
  const link = await MagicLinks.findOne({forwardLink: req.body.magicLink}).exec();
  const linkCreator = await User.findOne(link.creator).exec();

  // Checking if the link belongs to the current user
  const currentUser = await User.findById(req.user._id).exec();

  // If it does, delete the link
  if (JSON.stringify(linkCreator) == JSON.stringify(currentUser))
  {
    // Deleting from database
    try
    {
      await MagicLinks.deleteOne({forwardLink: req.body.magicLink});
    }
    catch(e)
    {
      console.log(e);
    }
  }

  res.json('complete');
}

// Uploaded Content Page ---------------------------------------------------------------------------------------------------------------------------

// Rendering upload content page
const serveUploadedContent = async (req, res, next) =>
{
  // Getting success and error messages
  var successMessage = null;
  var errorMessage = null;

  if (req.session.successMessage)
  {
    successMessage = req.session.successMessage;
    req.session.successMessage = null;
  }

  if (req.session.errorMessage)
  {
    errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
  }

  // Getting valid file types
  var validText = [];
  var validImages = [];
  var validVideos = [];
  var valid3D = [];

  for (const key in CIRCLES.VALID_TEXT_TYPES)
  {
    validText.push('.' + CIRCLES.VALID_TEXT_TYPES[key]);
  }

  for (const key in CIRCLES.VALID_IMAGE_TYPES)
  {
    validImages.push('.' + CIRCLES.VALID_IMAGE_TYPES[key]);
  }

  for (const key in CIRCLES.VALID_VIDEO_TYPES)
  {
    validVideos.push('.' + CIRCLES.VALID_VIDEO_TYPES[key]);
  }

  for (const key in CIRCLES.VALID_3D_TYPES)
  {
    valid3D.push('.' + CIRCLES.VALID_3D_TYPES[key]);
  }

  // Getting user content
  var content = [];

  var currentUser = req.user;

  content = await Uploads.find({user: currentUser});

  // Rendering the uploadedContent page
  const userInfo = getUserInfo(req);

  res.render(path.resolve(__dirname + '/../public/web/views/uploaded-content'), {
    title: 'Uploaded Content',
    userInfo: userInfo,
    validText: validText,
    validImages: validImages,
    validVideos: validVideos,
    valid3D: valid3D,
    content: content,
    successMessage: successMessage,
    errorMessage: errorMessage,
  });
}

// ------------------------------------------------------------------------------------------

// Storing content uploaded by user
const uploadContent = async (req, res, next) =>
{
  // Getting file
  const form = new formidable.IncomingForm();

  // Setting file size restriction
  form.options.maxFileSize = CIRCLES.CONSTANTS.MAX_FILE_UPLOAD_SIZE * 1024 * 1024;

  // Setting location to upload file to
  form.uploadDir = path.join(__dirname, '/../uploads');

  form.parse(req, async (err, fields, files) => 
  {
    if (err)
    {
      if (err.code === formidable.errors.biggerThanMaxFileSize)
      {
        req.session.errorMessage = 'File is too large, please ensure your file is under ' + CIRCLES.CONSTANTS.MAX_FILE_UPLOAD_SIZE + 'MB';
      }
      else
      {
        req.session.errorMessage = 'File could not be uploaded, please try again';
      }

      return res.redirect('/uploaded-content');
    }

    const file = files.contentFile;

    // Getting valid file types
    var validFiles = [];

    for (const key in CIRCLES.VALID_TEXT_TYPES)
    {
      validFiles.push(CIRCLES.VALID_TEXT_TYPES[key]);
    }

    for (const key in CIRCLES.VALID_IMAGE_TYPES)
    {
      validFiles.push(CIRCLES.VALID_IMAGE_TYPES[key]);
    }

    for (const key in CIRCLES.VALID_VIDEO_TYPES)
    {
      validFiles.push(CIRCLES.VALID_VIDEO_TYPES[key]);
    }

    for (const key in CIRCLES.VALID_3D_TYPES)
    {
      validFiles.push(CIRCLES.VALID_3D_TYPES[key]);
    }

    // Checking that the file is of the correct type
    // Otherwise, sending an error message

    // file: fileContentType/fileType
    // split result array: {"fileContentType", "fileType"}
    const fileCategory = file.mimetype.split('/')[0];
    const fileType = file.mimetype.split('/')[1];

    if (validFiles.includes(fileType))
    {
      const fileURL = path.join(__dirname, '/../uploads', file.newFilename + '.' + fileType);

      // Renaming file to be valid
      try
      {
        fs.renameSync(file.filepath, fileURL);
      }
      catch(e)
      {
        console.log(e);

        // Deleting file from folder
        fs.rmSync(file.filepath, {recursive: true});

        req.session.errorMessage = 'File could not be uploaded, please try again';
        return res.redirect('/uploaded-content');
      }

      // Storing the file in the database
      const fileInfo = {
        user: await User.findById(req.user._id).exec(),
        displayName: file.originalFilename,
        name: file.newFilename + '.' + fileType,
        url: fileURL,
        type: fileType,
        category: fileCategory,
      }

      try
      {
        await Uploads.create(fileInfo);
        req.session.successMessage = file.originalFilename + ' uploaded successfully';
      }
      catch(e)
      {
        console.log(e);

        // Deleting file from folder
        fs.rmSync(fileURL, {recursive: true});

        req.session.errorMessage = 'File could not be uploaded, please try again';
        return res.redirect('/uploaded-content');
      }

      return res.redirect('/uploaded-content');
    }

    // This file type means no file was uploaded
    else if (fileType === 'octet-stream')
    {
      // Deleting file from folder
      fs.rmSync(file.filepath, {recursive: true});

      req.session.errorMessage = 'No file uploaded';
      return res.redirect('/uploaded-content');
    }
    else
    {
      // Deleting file from folder
      fs.rmSync(file.filepath, {recursive: true});

      req.session.errorMessage = 'Incorrect file type uploaded: ' + fileType.toUpperCase() + ' files are not allowed';
      return res.redirect('/uploaded-content');
    }
  });
}

// ------------------------------------------------------------------------------------------

// Sending user uploaded file
const serveUploadedFile = async (req, res, next) => 
{
  // url: /uploads/file_name
  // split result array: {"", "uploads", "file_name"}
  const fileName = req.url.split('/')[2];

  // Getting file info from database
  var file = null;
  var fileOwner = null;
  try
  {
    file = await Uploads.findOne({name: fileName}).sort().exec();
    fileOwner = await User.findOne(file.user);
  }
  catch(e)
  {
    console.log(e);
  }

  if (file && fileOwner)
  {
    // Checking if the file belongs to the current user
    const currentUser = await User.findById(req.user._id).sort().exec();

    // If it does, send file
    // If it doesn't, send file containing error message
    if (JSON.stringify(fileOwner) == JSON.stringify(currentUser))
    {
      res.sendFile(path.resolve(__dirname + '/../uploads/' + fileName));
    }
    else
    {
      res.sendFile(path.resolve(__dirname + '/../public/web/views/error.txt'));
    }
  }
  else
  {
    res.sendFile(path.resolve(__dirname + '/../public/web/views/error.txt'));
  }
}

// ------------------------------------------------------------------------------------------

// Setting file dimensions in database
const setFileDimensions = async (req, res, next) =>
{
  var file = null;

  try
  {
    // Getting file from database
    file = await Uploads.findOne({name: req.body.file});
  }
  catch(e)
  {
    console.log(e);
  }

  if (file)
  {
    // Updating file dimensions
    file.height = req.body.height;
    file.width = req.body.width;
    await file.save();
  }
}

// ------------------------------------------------------------------------------------------

// Deleteing user uploaded file
const deleteContent = async (req, res, next) => 
{
  // Getting file info from database
  const file = await Uploads.findOne({name: req.body.file}).sort().exec();
  const fileOwner = await User.findOne(file.user);

  // Checking if the file belongs to the current user
  const currentUser = await User.findById(req.user._id).sort().exec();

  // If it does, delete the file
  if (JSON.stringify(fileOwner) == JSON.stringify(currentUser))
  { 
    // Deleting from database
    await Uploads.deleteOne({name: req.body.file});

    // Deleting from uploads folder
    fs.rmSync(__dirname + '/../uploads/' + req.body.file, {recursive: true});
  }

  res.json('complete');
}

// More Circles Page -------------------------------------------------------------------------------------------------------------------------------

// Rendering more circles page
const serveMoreCircles = async (req, res, next) =>
{
  const userInfo = getUserInfo(req);

  var request = new XMLHttpRequest();
  request.open('GET', env.CENTRAL_SERVER + '/get-servers');

  const renderError = function (message)
  {
    res.render(path.resolve(__dirname + '/../public/web/views/more-circles'), {
      title: 'More Circles',
      userInfo: userInfo,
      circleServers: {},
      serverErrorMessage: message,
      secondaryMessage: 'Please try again. If error persists, contact the central Circles server',
    });
  }

  request.onerror = function() 
  {
    renderError('An error occured while connecting to central server');
  }

  request.onload = function() 
  {
    var serverData = JSON.parse(request.response);
    
    // Checking that the server data was able the be collected, if not, outputting an error message
    if (serverData === 'ERROR')
    {
      renderError('An error occured while getting data from central server');
    }
    else
    {
      res.render(path.resolve(__dirname + '/../public/web/views/more-circles'), {
        title: "More Circles",
        userInfo: userInfo,
        circleServers: JSON.parse(request.response),
      });
    }
  };

  request.send();
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
  // Login Page
  serveLogin,
  forwardMagicLink,
  // Register Page
  serveRegister,
  registerUser,
  verifyUserEmail,
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
  // Manage Users Page
  serveManageUsers,
  createUser,
  bulkCreateUsers,
  updateUsertype,
  deleteUser,
  // Your Magic Links Page
  serveYourMagicLinks,
  renewMagicLink,
  deleteMagicLink,
  // Uploaded Content Page
  serveUploadedContent,
  uploadContent,
  serveUploadedFile,
  setFileDimensions,
  deleteContent,
  // More Circles Page
  serveMoreCircles,
}