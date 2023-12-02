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
const WorldGroups = require('../models/worldGroups');
const Worlds = require('../models/worlds');
const Uploads = require('../models/uploads');
const MagicLinks = require('../models/magicLinks');

// General --------------------------------------------------------------------------------------------------------------------------------------------

// Loading in config  
var env = dotenv.config({});

if (env.error) 
{
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

env = dotenvParseVariables(env.parsed);

// ------------------------------------------------------------

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

// ------------------------------------------------------------

// Creating jwt for magic link
const createJWT_MagicLink = function(expiryTimeMin, worlds)
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
    worlds: worlds,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, jwtOptions);

  const magicLink = '/magic-login?token=' + token + '&route=' + route;;

  return magicLink;
}

// Explore Page ---------------------------------------------------------------------------------------------------------------------------------------

// Getting certain worlds from the world database
// Permission Types:
//    - public              Returns worlds that have no viewing restrictions
//    - private             Returns worlds that have viewing restrictions
//    - specialViewing      Returns worlds that the user has viewing access to
//    - editing             Returns worlds that the user has editing access to
//    - magic               Returns worlds that the user has viewing access to from a magic link
const getWorlds = async function(user, permissionType)
{
  var worlds = []

  if (permissionType === "public")
  {
    worlds = await Worlds.find({viewingRestrictions: false});
  }
  else if (permissionType === "private")
  {
    worlds = await Worlds.find({viewingRestrictions: true});
  }
  else if (permissionType === "specialViewing")
  {
    worlds = await Worlds.find({viewingRestrictions: true, viewingPermissions: { $in: [user] }});
  }
  else if (permissionType === "editing")
  {
    worlds = await Worlds.find({editingPermissions: { $in: [user] }});
  }
  else if (permissionType === "magic")
  {
    for (const world of user.magicLinkWorlds)
    {
      worlds.push(await Worlds.find(world));
    }
  }

  return worlds;
}

// ------------------------------------------------------------

// Organizing worlds into their groups and subgroups
// Return object structure:
//  {
//    groups: [                             --> Array of group objects
//      {
//        name: GROUP_NAME,                 --> Group name
//        subgroups: [                      --> Array of subgroup objects in the group
//          {
//            name: SUBGROUP_NAME,          --> Subgroup name
//            worlds: [                     --> Worlds in the subgroup
//              {
//                name: WORLD_NAME,
//                displayName: DISPLAY_NAME,
//              }
//            ],
//          }
//        ],
//        noGroup: [                        --> Worlds that are not in a subgroup
//          {
//            name: WORLD_NAME,
//            displayName: DISPLAY_NAME,
//          }
//        ],                   
//      },
//    ],
//    noGroup: [                            --> Worlds that are not in a group
//      {
//        name: WORLD_NAME,
//        displayName: DISPLAY_NAME,
//      }
//    ],
//  }
const organizeToGroups = function(worlds, databaseGroups)
{
  var organizedWorlds = {
    groups: [],
    noGroup: [],
  };

  // Going through each world
  for (const world of worlds)
  {
    // Checking if world is in a group
    // If it is, add it to group
    // If it is not, add it to no group array
    if (world.group && databaseGroups.length > 0)
    {
      // Getting group from database
      var databaseGroup = databaseGroups.find((group) => JSON.stringify(world.group) === JSON.stringify(group._id));

      // Checking if group already exists in group object array
      // If it does, get it
      // If it doesn't, create the group object
      var group = organizedWorlds.groups.find((group) => databaseGroup.name === group.name);

      var index;

      if (group)
      {
        index = organizedWorlds.groups.indexOf(group);
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
              worlds: [],
            };

            newGroup.subgroups.push(newSubgroup);
          }
        }

        organizedWorlds.groups.push(newGroup);

        index = organizedWorlds.groups.indexOf(newGroup);
      }

      // Checking if world is in a subgroup
      // If it is, add it to subgroup
      // If it is not, add it to no group array
      if (world.subgroup)
      {
        var databaseSubgroup = databaseGroup.subgroups.find((subgroup) => JSON.stringify(world.subgroup) === JSON.stringify(subgroup._id));

        var subgroup = organizedWorlds.groups[index].subgroups.find((subgroup) => databaseSubgroup.name === subgroup.name);

        var subIndex = organizedWorlds.groups[index].subgroups.indexOf(subgroup);

        organizedWorlds.groups[index].subgroups[subIndex].worlds.push({name: world.name, displayName: world.displayName, hasProfileImage: world.hasProfileImage});
      }
      else
      {
        organizedWorlds.groups[index].noGroup.push({name: world.name, displayName: world.displayName, hasProfileImage: world.hasProfileImage});
      }
    }
    else
    {
      organizedWorlds.noGroup.push({name: world.name, displayName: world.displayName, hasProfileImage: world.hasProfileImage});
    }
  }

  return organizedWorlds;
}

// ------------------------------------------------------------

// Rendering explore page
const serveExplore = async (req, res, next) => 
{
  // Getting all worlds the user has access to and putting their names into an array
  // - All users are given access to worlds with no restrictions (public worlds)
  // - If user is an admin user, viewing and editing access is given to all worlds
  // - If user is a manager user:
  //      - Viewing access is given to to specific worlds (ones that they have been given viewing access to)
  //      - Editing access is given to specific worlds (ones that they have been given editing access to)
  // - If user is a standard user:
  //      - Viewing access is given to specific worlds (ones that they have been given viewing access to)
  //      - No editing access is given
  // - If user is a magic guest
  //      - Viewing access is given to worlds in magicLinkWorlds array
  //      - No editing access is given
  // - If user is a guest
  //      - No editing access is given

  var user = req.user;

  var magicWorlds = [];
  var publicWorlds = [];
  var userWorlds = [];
  var editableWorlds = [];

  // All users
  publicWorlds.push(await getWorlds(user, 'public'));

  // Admin users
  if (CIRCLES.USER_CATEGORIES.ADMIN_USERS.includes(user.usertype))
  { 
    userWorlds.push(await getWorlds(user, 'private'));

    editableWorlds.push(await getWorlds(user, 'public'));
    editableWorlds.push(await getWorlds(user, 'private'));
  }
  // Manager users
  else if (CIRCLES.USER_CATEGORIES.MANAGER_USERS.includes(user.usertype))
  {
    userWorlds.push(await getWorlds(user, 'specialViewing'));
    userWorlds.push(await getWorlds(user, 'editing'));
    editableWorlds.push(await getWorlds(user, 'editing'));
  }
  // Standard users
  else if (CIRCLES.USER_CATEGORIES.STANDARD_USERS.includes(user.usertype))
  {
    userWorlds.push(await getWorlds(user, 'specialViewing'));
  }
  // Magic link guest
  else if (user.usertype === CIRCLES.USER_TYPE.MAGIC_GUEST)
  {
    magicWorlds.push(await getWorlds(user, 'magic'));
  }

  // Flattening the arrays
  magicWorlds = magicWorlds.flat(2);
  publicWorlds = publicWorlds.flat(2);
  userWorlds = userWorlds.flat(2);
  editableWorlds = editableWorlds.flat(2);

  // Organizing worlds in each array into their groups and subgroups
  var groups = await WorldGroups.find({});

  publicWorlds = organizeToGroups(publicWorlds, groups);
  userWorlds = organizeToGroups(userWorlds, groups);

  // Getting groups with no worlds in them
  var groupedWorlds = organizeToGroups(editableWorlds, groups);
  var groupsWithWorlds = [];
  
  for (const group of groupedWorlds.groups)
  {
    groupsWithWorlds.push(group.name);
  }

  for (const group of groups)
  {
    if (!groupsWithWorlds.includes(group.name))
    {
      var noWorldGroup = {
        name: group.name,
        subgroups: [],
        noGroup: [],
      };

      for (const subgroup of group.subgroups)
      {
        var noWorldSubgroup = {
          name: subgroup.name,
          worlds: [],
        };

        noWorldGroup.subgroups.push(noWorldSubgroup);
      }

      groupedWorlds.groups.push(noWorldGroup);
    }
  }

  // Organizing editable worlds into private and public groups
  // Keeping same object layout as publicWorlds and userWorlds to make it easier to display
  var groupedEditableWorlds = {
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

  for (const world of editableWorlds)
  {
    if (world.viewingRestrictions)
    {
      groupedEditableWorlds.groups[0].noGroup.push({name: world.name, displayName: world.displayName, hasProfileImage: world.hasProfileImage});
    }
    else
    {
      groupedEditableWorlds.groups[1].noGroup.push({name: world.name, displayName: world.displayName, hasProfileImage: world.hasProfileImage});
    }
  }

  // Organizing editable worlds into private and public groups
  // Keeping same object layout as publicWorlds and userWorlds to make it easier to display
  var groupedMagicWorlds = {
    groups: [],
    noGroup: [],
  }

  for (const world of magicWorlds)
  {
    groupedMagicWorlds.noGroup.push({name: world.name, displayName: world.displayName, hasProfileImage: world.hasProfileImage});
  }

  // Rendering page
  res.render(path.resolve(__dirname + '/../public/web/views/NEW/new-explore'), 
  {
    title: 'Explore',
    userInfo: getUserInfo(req),
    sessionName: req.session.sessionName,
    magicWorlds: groupedMagicWorlds,
    publicWorlds: publicWorlds,
    userWorlds: userWorlds,
    editableWorlds: groupedEditableWorlds,
    groupedWorlds: groupedWorlds,
  });
}

// ------------------------------------------------------------

// Updating session name (XMLHttpRequest sent)
const updateSessionName = async (req, res, next) => 
{
  // Ensuring that there is text in the display name (if there is, returning success message)
  // If not, returning error message
  if (req.body.sessionName.length > 0 && req.body.sessionName[0] != ' ')
  {
    req.session.sessionName = req.body.sessionName;

    res.json('updated');
  }
  else
  {
    res.json('invalid');
  }
}

// ------------------------------------------------------------

// Creating magic link to user requested worlds
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
      
      // Getting worlds to create magic link to
      const worlds = [];
      const worldNames = [];

      if (Array.isArray(req.body.magicCircle))
      {
        for (const circle of req.body.magicCircle)
        {
          try 
          {
            var world = await Worlds.findOne({name: circle});

            worlds.push(world);
            worldNames.push(world.displayName)
          }
          catch (err)
          {
            console.log(err);

            res.json('error');
          }
        }
      }
      else
      {
        try 
        {
          var world = await Worlds.findOne({name: req.body.magicCircle});

          worlds.push(world);
          worldNames.push(world.displayName)
        }
        catch (err)
        {
          console.log(err);

          res.json('error');
        }
      }

      // Creating magic link
      const magicLink = createJWT_MagicLink(expiryTimeMin, worlds);

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
          worlds: worldNames,
        }
      }
      else
      {
        linkInfo = {
          creator: await User.findById(req.user._id).exec(),
          forwardLink: req.body.forwardingName,
          magicLink: magicLink,
          expires: false,
          worlds: worldNames,
        }
      }

      try
      {
        await MagicLinks.create(linkInfo);
      }
      catch(e)
      {
        res.json('error');
      }
      
      var response = {
        forwardingLink: forwardingLink,
        worlds: worldNames,
      }

      res.json(response);
    }
    else
    {
      res.json('forwarding name exists');
    }
  }
  else
  {
    res.json('error');
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
  // Explore Page
  serveExplore,
  updateSessionName,
  createMagicLink,
}