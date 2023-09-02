'use strict';

require('../../src/core/circles_server');
const mongoose = require('mongoose');
const express  = require('express');
const session  = require('express-session');
const app      = express();
const User     = require('../models/user');
const Guest    = require('../models/guest');
const Model3D  = require('../models/model3D');
const WorldGroups = require('../models/worldGroups');
const Worlds   = require('../models/worlds');
const Uploads  = require('../models/uploads');
const MagicLinks  = require('../models/magicLinks');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const dotenv   = require('dotenv');
const url      = require('url');
const dotenvParseVariables = require('dotenv-parse-variables');
const jwt      = require('jsonwebtoken');
const { CONSTANTS } = require('../../src/core/circles_research');
const formidable = require("formidable");
const XMLHttpRequest = require('xhr2');
const uniqueFilename = require('unique-filename');

//load in config  
var env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

// const getAllUsers = function(req, res, next) {
//   User.find({}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json(data);
//   });
// };

// const getUser = (req, res, next) => {
//   User.findOne({username: req.params.username}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json(data);
//   });
// };

// //!!TODO: look this over
// const updateUser = (req, res, next) => {
//   User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json(data);
//   });
// };

// const deleteUser = (req, res, next) => {
//   User.remove({username: req.params.username}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json({ message: 'User successfully deleted' });
//   });
// };

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const getUserInfo = function(req)
{
  var user = req.user;

  const userInfo = {
    userName: user.username,
    userType: user.usertype,
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const invalidAddress = function(req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/index'), {
    title: 'Welcome to CIRCLES',
    message: 'Invalid address entered'
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering the register user page with a specific message to the user about their registration (ex. error messages, success messages)
const renderRegister = (req, res, next) =>
{
    res.render(path.resolve(__dirname + '/../public/web/views/register'), {
      title: `Register for Circles`,
      message: renderMessage
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering the user profile page with a specific message to the user about their registration (ex. error messages, success messages)
const renderProfile = function(req, res, renderMessageSuccess, renderMessageError)
{
  // Route now authenticates and ensures a user is logged in by this point
  var user = req.user;

  //Mongoose promises http://mongoosejs.com/docs/promises.html
  const promises = [
    Model3D.find({type: CIRCLES.MODEL_TYPE.HEAD}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAIR}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.BODY}).exec(),
  ];

  const queryChecks = [
    user.gltf_head_url,
    user.gltf_hair_url,
    user.gltf_body_url,
  ];

  Promise.all(promises).then((results) => {
    var optionStrs = [];   //save all option str to replace after ...

    for ( var r = 0; r < results.length; r++ ) {
      var optionsStr  = '';
      var models = results[r];
      for ( var i = 0; i < models.length; i++ ) {
        if (models[i].url === queryChecks[r]) {
          optionsStr += '<option selected>' + models[i].name + '</option>';
        }
        else {
          optionsStr += '<option>' + models[i].name + '</option>';
        }
      }
      optionStrs.push(optionsStr);
    }

    const userInfo = getUserInfo(req);

    const userOptions = {
      headOptions: optionStrs[0],
      hairOptions: optionStrs[1],
      bodyOptions: optionStrs[2],
    }

    res.render(path.resolve(__dirname + '/../public/web/views/profile'), {
      title: `Welcome ${user.username}`,
      userInfo: userInfo,
      userOptions: userOptions,
      successMessage: renderMessageSuccess, 
      errorMessage: renderMessageError
    });

  }).catch(function(err){
    console.log(err);
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const updateUserInfo = (req, res, next) => {
  if (!req.body) 
  {
    return res.sendStatus(400);
  }
  else 
  {
    console.log('Updating user info');

    var errorMessage = '';
    var accountUpdated = false;
    var avatarUpdated = false;

    //Mongoose promises http://mongoosejs.com/docs/promises.html
    const promises = [
      Model3D.findOne({name: req.body.headModel}).exec(),
      Model3D.findOne({name: req.body.hairModel}).exec(),
      Model3D.findOne({name: req.body.bodyModel}).exec(),
    ];

    if (req.user.usertype === CIRCLES.USER_TYPE.GUEST)
    {
      promises.push(Guest.findOne({_id: req.user._id}).exec());
    }
    else
    {
      promises.push(User.findOne({_id: req.user._id}).exec());
    }

    Promise.all(promises).then(async (results) => {

      const user = results[3];
      
      // Adding properties dynamically after, depending on what was updated
      const userData = {};

      // Checking if head model was updated
      if (results[0].url !== user.gltf_head_url) 
      {
        userData.gltf_head_url = results[0].url;
        avatarUpdated = true;
        console.log('Head model updated');
      }

      // Checking if hair model was updated
      if (results[1].url !== user.gltf_hair_url) 
      {
        userData.gltf_hair_url = results[1].url;
        avatarUpdated = true;
        console.log('Hair model updated');
      }

      // Checking if body model was updated
      if (results[2].url !== user.gltf_body_url) 
      {
        userData.gltf_body_url = results[2].url;
        avatarUpdated = true;
        console.log('Body model updated');
      }

      // Checking if head color was updated
      if (req.body.color_head !== user.color_head) 
      {
        userData.color_head = req.body.color_head;
        avatarUpdated = true;
        console.log('Head color updated');
      }

      // Checking if hair color was updated
      if (req.body.color_hair !== user.color_hair) 
      {
        userData.color_hair = req.body.color_hair;
        avatarUpdated = true;
        console.log('Hair color updated');
      }

      // Checking if body color was updated
      if (req.body.color_body !== user.color_body) 
      {
        userData.color_body = req.body.color_body;
        avatarUpdated = true;
        console.log('Body color updated');
      }

      // Checking if left hand color was updated
      if (req.body.color_hand_left !== user.color_hand_left) 
      {
        userData.color_hand_left = req.body.color_hand_left;
        avatarUpdated = true;
        console.log('Left hand color updated');
      }

      // Checking if right hand color was updated
      if (req.body.color_hand_right !== user.color_hand_right) 
      {
        userData.color_hand_right = req.body.color_hand_right;
        avatarUpdated = true;
        console.log('Right hand color updated');
      }

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
        console.log('Display name updated');
      }

      // Checking if email was updated
      if (req.body.email !== user.email)
      {
        userData.email = req.body.email;
        accountUpdated = true;
        console.log('Email updated');
      }

      // Checking if the user wants to delete their email from their account
      // If the checkbox was checked
      if (req.body.deleteEmail)
      {
        userData.email = '';
        accountUpdated = true;
        console.log('Email deleted');
      }

      // Checking if password was updated
      if (req.body.passwordNew) 
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
            console.log('Password updated');
          }
          else
          {
            errorMessage = 'Passwords do not match';
          }
        }
        else
        {
          errorMessage = 'Old password is incorrect';
        }
      }

      var doc   = null;
      var error = null;

      async function updateItems() 
      {
        try 
        {
          if (user.usertype === CIRCLES.USER_TYPE.GUEST)
          {
            doc = await Guest.findOneAndUpdate({_id:req.user._id}, userData, {new:true});
          }
          else
          {
            doc = await User.findOneAndUpdate({_id:req.user._id}, userData, {new:true});
          }
        } 
        catch(err) 
        {
          error = err;
        }
      }

      updateItems().then(function() 
      {
        if (error) 
        {
          console.log(error);

          req.session.errorMessage = 'Something went wrong, please try again';
          return res.redirect('/profile');
        } 
        else 
        {
          var successMessage = '';

          if (avatarUpdated && accountUpdated)
          {
            successMessage = 'User account and avatar updated successfully';
          }
          else if (avatarUpdated)
          {
            successMessage = 'Avatar updated successfully';
          }
          else if (accountUpdated)
          {
            successMessage = 'User account updated successfully';
          }

          req.session.errorMessage = errorMessage;
          req.session.successMessage = successMessage; 

          return res.redirect('/profile');
        }
      });
    }).catch(function(err)
    {
      console.log(err);
      req.session.errorMessage = 'Something went wrong, please try again';
      return res.redirect('/profile');
    });
  }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const modifyServeWorld = (world_id, searchParamsObj, user, pathStr, req, res) => {
  // Ensure the world file exists
  fs.readFile(pathStr, {encoding: 'utf-8'}, (error, data) => {
    if (error) {
      return res.redirect('/profile');
    }
    else {
      var specialStatus = '';

      const u_name = ((searchParamsObj.has('name')) ? searchParamsObj.get('name') : req.session.sessionName);
      const u_height = ((searchParamsObj.has('height')) ? searchParamsObj.get('height') : CIRCLES.CONSTANTS.DEFAULT_USER_HEIGHT);

      //need to get types if available in params
      //if not valid in params set to "nothing". Could be fun to be a floating head l ;)
      var head_type = ''
      if (searchParamsObj.has('head')) {
        head_type = CIRCLES.MODEL_HEAD_TYPE['head_' + searchParamsObj.get('head')];
        if (!head_type) {
          head_type = '';
        }
      }
      else {
        head_type = user.gltf_head_url;
      }

      var hair_type = ''
      if (searchParamsObj.has('hair')) {
        hair_type = CIRCLES.MODEL_HAIR_TYPE['hair_' + searchParamsObj.get('hair')];
        if (!hair_type) {
          hair_type = '';
        }
      }
      else {
        hair_type = user.gltf_hair_url;
      }

      var body_type = ''
      if (searchParamsObj.has('body')) {
        body_type = CIRCLES.MODEL_BODY_TYPE['body_' + searchParamsObj.get('body')];
        if (!body_type) {
          body_type = '';
        }
      }
      else {
        body_type = user.gltf_body_url;
      }

      const head_col = ((searchParamsObj.has('head_col')) ? searchParamsObj.get('head_col') : user.color_head);
      const hair_col = ((searchParamsObj.has('hair_col')) ? searchParamsObj.get('hair_col') : user.color_hair);
      const body_col = ((searchParamsObj.has('body_col')) ? searchParamsObj.get('body_col') : user.color_body);

      //to be added later
      // head_tex=0
      // body_tex=0
      
      if (user.usertype === CIRCLES.USER_TYPE.TEACHER) {
        specialStatus = ' (T)';
      }
      else if (user.usertype === CIRCLES.USER_TYPE.RESEARCHER) {
        specialStatus = ' (R)';
      }

      var result = data.replace(/__WORLDNAME__/g, world_id);
      result = result.replace(/__USERTYPE__/g, user.usertype);
      result = result.replace(/__USERNAME__/g, user.username);
      result = result.replace(/__VISIBLENAME__/g, u_name + specialStatus);
      result = result.replace(/__FACE_MAP__/g, CIRCLES.CONSTANTS.DEFAULT_FACE_HAPPY_MAP);

      result = result.replace(/__USER_HEIGHT__/g, u_height);
      result = result.replace(/__MODEL_HEAD__/g, head_type);
      result = result.replace(/__MODEL_HAIR__/g, hair_type);
      result = result.replace(/__MODEL_BODY__/g, body_type);
      result = result.replace(/__COLOR_HEAD__/g, head_col);
      result = result.replace(/__COLOR_HAIR__/g, hair_col);
      result = result.replace(/__COLOR_BODY__/g, body_col);

      // Replace room ID with generic explore name too keep the HTML output
      // clean
      result = result.replace(/__ROOM_NAME__/g, searchParamsObj.get('group'));

      res.set('Content-Type', 'text/html');
      res.end(result); //not sure exactly why res.send doesn't work here ...
    }
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const serveWorld = (req, res, next) => {
  //need to make sure we have the trailing slash to signify a folder so that relative links works correctly
  //https://stackoverflow.com/questions/30373218/handling-relative-urls-in-a-node-js-http-server 
  const splitURL = req.url.split('?');
  const baseURL = (splitURL.length > 0)?splitURL[0]:'';
  const urlParamsStr = (splitURL.length > 1)?splitURL[1]:'';

  if (splitURL.length > 0) {
    if (baseURL.charAt(baseURL.length - 1) !== '/') {
      const fixedURL = baseURL + "/"  + ((urlParamsStr === '')?'':'?' + urlParamsStr);
      res.writeHead(302, { "Location": fixedURL });
      res.end();
      return;
    }
  }

  //make sure there are the correct url seatch params available
  const urlObj = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  const searchParamsObj = urlObj.searchParams;
  //if no group indicated then assume the group 'explore'
  if (!searchParamsObj.has('group')) {
    const fixedURL = baseURL + "?" + 'group=explore' + ((urlParamsStr === '')?'':'&' + urlParamsStr);
    res.writeHead(302, { "Location": fixedURL });
    res.end();
    return;
  }

  const world_id = req.params.world_id;
  const user = req.user;
  const pathStr = path.resolve(__dirname + '/../public/worlds/' + world_id + '/index.html');

  modifyServeWorld(world_id, searchParamsObj, user, pathStr, req, res);
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const serveRelativeWorldContent = (req, res, next) => {
  //making it easier for devs as absolute paths are a pain to type in ...
  const worldID = req.params.world_id;
  const relURL = req.params[0];
  const newURL = '/worlds/' + worldID + '/' + relURL;
  return res.redirect(newURL);
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting success and error messages and then rendering the profile page
const serveProfile = (req, res, next) => 
{
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

  renderProfile(req, res, successMessage, errorMessage);
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creates a new user and puts them in the user database
const registerUser = (req, res, next) => {
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
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting success and error messages and then rendering the register page
const serveRegister = (req, res, next) => 
{
  var errorMessage = null;

  if (req.session.errorMessage)
  {
    errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
  }

  renderRegister(res, errorMessage);
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting certain worlds from the world database
// Permission Types:
//    - public              Returns all worlds that have no viewing restrictions
//    - private             Returns all worlds that have viewing restrictions
//    - specialViewing      Returns all worlds that the user has viewing access to
//    - editing             Returns all worlds that the user has editing access to
//    - magic               Returns all worlds that the user has viewing access to from a magic link
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
    worlds = await Worlds.find({viewingPermissions: { $in: [user] }});
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Organizing worlds into their groups and subgroups
// Return object structure:
//  {
//    groups: [                             --> Array of group objects
//      {
//        name: GROUP_NAME,                 --> Group name
//        subgroups: [                      --> Array of subgroup objects in the group
//          {
//            name: SUBGROUP_NAME,          --> Subgroup name
//            worlds: [...],                --> Worlds in the subgroup
//          }
//        ],
//        noGroup: [...],                   --> Worlds that are not in a subgroup
//      },
//    ],
//    noGroup: [...],                       --> Worlds that are not in a group
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
    if (world.group)
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

        organizedWorlds.groups[index].subgroups[subIndex].worlds.push(world.name);
      }
      else
      {
        organizedWorlds.groups[index].noGroup.push(world.name);
      }
    }
    else
    {
      organizedWorlds.noGroup.push(world.name);
    }
  }

  return organizedWorlds;
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering the explore page after the user has logged in according to what they have access
const serveExplore = async (req, res, next) => 
{
  // Getting success and error messages
  var successMessage = null;
  var errorMessage = null;
  var magicLinkError = null;

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

  if (req.session.magicLinkError)
  {
    magicLinkError = req.session.magicLinkError;
    req.session.magicLinkError = null;
  }

  // Route now authenticates and ensures a user is logged in by this point
  var user = req.user;

  // Gathering information on the user to send to explore page
  const userInfo = getUserInfo(req);

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

  var magicWorlds = [];
  var publicWorlds = [];
  var userWorlds = [];
  var editableWorlds = [];

  publicWorlds.push(await getWorlds(user, 'public'));

  if (CIRCLES.USER_CATEGORIES.ADMIN_USERS.includes(user.usertype))
  { 
    userWorlds.push(await getWorlds(user, 'private'));

    editableWorlds.push(await getWorlds(user, 'public'));
    editableWorlds.push(await getWorlds(user, 'private'));
  }
  else if (CIRCLES.USER_CATEGORIES.MANAGER_USERS.includes(user.usertype))
  {
    userWorlds.push(await getWorlds(user, 'specialViewing'));
    editableWorlds.push(await getWorlds(user, 'editing'));
  }
  else if (CIRCLES.USER_CATEGORIES.STANDARD_USERS.includes(user.usertype))
  {
    userWorlds.push(await getWorlds(user, 'specialViewing'));
  }
  else if (user.usertype === CIRCLES.USER_TYPE.MAGIC_GUEST)
  {
    magicWorlds.push(await getWorlds(user, "magic"));
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

  // Getting only the world names
  function getNames(worldArray)
  {
    var nameArray = [];

    for (const world of worldArray)
    {
      nameArray.push(world.name);
    }

    return nameArray;
  }

  var magicArray = getNames(magicWorlds);
  var publicArray = getNames(publicWorlds);
  var userArray = getNames(userWorlds);
  var editableArray = getNames(editableWorlds);

  // Rendering the explore page
  res.render(path.resolve(__dirname + '/../public/web/views/explore'), {
    title: "Explore Worlds",
    userInfo: userInfo,
    magicWorlds: magicArray,
    //publicWorlds: publicArray,
    //userWorlds: userArray,
    //editableWorlds: editableArray,
    sessionName: req.session.sessionName,
    successMessage: successMessage,
    errorMessage: errorMessage,
    magicLinkSuccess: req.session.magicLinkSuccess,
    magicLinkError: magicLinkError,
    magicLink: req.session.magicLink,
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const serveAccessEdit = async (req, res, next) => { 
  // url: /edit-access/worldName
  // split result array: {"", "edit-access", "worldName"}
  const worldName = req.url.split('/')[2];
  
  // Getting world to send to worldAccess page
  const world = await Worlds.findOne({name: worldName});

  if (world)
  {
    const worldInfo = {
      name: world.name,
      viewingRestrictions: world.viewingRestrictions,
      viewingPermission: [],
      viewingDenied: [],
      editingPermission: [],
      editingDenied: [],
    }
  
    // Getting usernames and usertypes of all users that have permission to view world
    for (const user of world.viewingPermissions)
    {
      // 1. Ignoring the current user
      // 2. Ignoring users who have editing permissions on the world
      // 3. Finding the user in the database
      const currentUser = await User.aggregate([
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
              _id: {$nin: world.editingPermissions},
            },
        },
        {
          $match:
            // 3
            {
              _id: user,
            },
        },
      ]);
  
      if (currentUser.length > 0)
      {
        const userInfo = {
          username: currentUser[0].username, 
          usertype: currentUser[0].usertype
        }
  
        worldInfo.viewingPermission.push(userInfo);
      }
    }
  
    // Getting usernames of all users that do not have permission to view world
  
    // 1. Ignoring the current user and users of type superuser and admin (as they have access to all worlds by default) and users of type Guest (as they only have access to the worlds with no restrictions)
    // 2. Ignoring users who have editing permissions on the world
    // 3. Finding the users who are not in the viewingPermissions array
    const usersViewingDenied = await User.aggregate([
      {
        $match:
          // 1
          {
            _id: {$nin: [req.user._id]},
            usertype: {$nin: [CIRCLES.USER_TYPE.SUPERUSER, CIRCLES.USER_TYPE.ADMIN, CIRCLES.USER_TYPE.GUEST]},
          },
      },
      {
        $match:
          // 2
          {
            _id: {$nin: world.editingPermissions},
          },
      },
      {
        $match:
          // 3
          {
            _id: {$nin: world.viewingPermissions},
          },
      },
    ]);

    // Getting usernames and usertypes of all users that do not have permission to view world
    for (const user of usersViewingDenied)
    {
      const userInfo = {
        username: user.username, 
        usertype: user.usertype
      }
  
      worldInfo.viewingDenied.push(userInfo);
    }

    // Getting usernames and usertypes of all users that have permission to edit world
    for (const user of world.editingPermissions)
    {
      // 1. Ignoring the current user
      // 2. Finding the user in the database
      const currentUser = await User.aggregate([
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
              _id: user,
            },
        },
      ]);

      // If a user was found
      if (currentUser.length > 0)
      {
        const userInfo = {
          username: currentUser[0].username, 
          usertype: currentUser[0].usertype
        }
  
        worldInfo.editingPermission.push(userInfo);
      }
    } 

    // Getting usernames of all users that do not have permission to edit world
  
    // 1. Ignoring the current user and only looking for users of type teacher and researcher
    // 2. Finding the users who are not in the editingPermissions array
    const usersEditingDenied = await User.aggregate([
      {
        $match:
          // 1
          {
            _id: {$nin: [req.user._id]},
            usertype: {$in: [CIRCLES.USER_TYPE.TEACHER, CIRCLES.USER_TYPE.RESEARCHER]},
          },
      },
      {
        $match:
          // 2
          {
            _id: {$nin: world.editingPermissions},
          },
      },
    ]);

    // Getting usernames and usertypes of all users that do not have permission to edit world
    for (const user of usersEditingDenied)
    {
      const userInfo = {
        username: user.username, 
        usertype: user.usertype
      }
  
      worldInfo.editingDenied.push(userInfo);
    }

    const userInfo = getUserInfo(req);
  
    // Rendering the worldAccess page
    res.render(path.resolve(__dirname + '/../public/web/views/worldAccess'), {
      title: world.name + ' Access',
      userInfo: userInfo,
      world: worldInfo
    });
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Gives a user viewing rights to specified world
const permitWorldViewing = async (req, res, next) => { 
  // url: /permit-viewing/worldName/username
  // split result array: {"", "permit-viewing", "worldName", "username"}
  const urlSplit = req.url.split('/');
  const worldName = urlSplit[2];
  const username = urlSplit[3];

  // Finding the user in database with that username
  const user = await User.findOne({username: username});

  // Finding world in database with that name
  const world = await Worlds.findOne({name: worldName});

  if (user && world)
  {
    try
    {
      // Adding the user to the list of premitted users
      world.viewingPermissions.push(user);
      await world.save();

      console.log(username + ' given viewing to ' + worldName);
    }
    catch (e)
    {
      console.log('ERROR: Could not give ' + username + ' viewing to ' + worldName);
    }
  }
  else
  {
    console.log('ERROR: Could not give ' + username + ' viewing to ' + worldName);
  }

  res.redirect('/edit-access/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removes a user's viewing rights from specified world
const removeWorldViewing = async (req, res, next) => { 
  // url: /remove-viewing/worldName/username
  // split result array: {"", "remove-viewing", "worldName", "username"}
  const urlSplit = req.url.split('/');
  const worldName = urlSplit[2];
  const username = urlSplit[3];

  // Finding the user in database with that username
  const user = await User.findOne({username: username});

  // Finding world in database with that name
  const world = await Worlds.findOne({name: worldName});

  if (user && world)
  {
    try
    {
      // Removing the user from the list of premitted users
      world.viewingPermissions.pull(user);
      await world.save();

      console.log(username + ' restricted from viewing ' + worldName);
    }
    catch (e)
    {
      console.log('ERROR: Could not restrict ' + username + ' from viewing ' + worldName);
    }
  }
  else
  {
    console.log('ERROR: Could not restrict ' + username + ' from viewing ' + worldName);
  }

  res.redirect('/edit-access/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Gives a user editing rights from specified world
const permitWorldEditing = async (req, res, next) => { 
  // url: /permit-editing/worldName/username
  // split result array: {"", "permit-editing", "worldName", "username"}
  const urlSplit = req.url.split('/');
  const worldName = urlSplit[2];
  const username = urlSplit[3];

  // Finding the user in database with that username
  const user = await User.findOne({username: username});

  // Finding world in database with that name
  const world = await Worlds.findOne({name: worldName});

  if (user && world)
  {
    try
    {
      // Adding the user to the list of premitted users
      world.editingPermissions.push(user);
      await world.save();

      console.log(username + ' given editing to ' + worldName);
    }
    catch (e)
    {
      console.log('ERROR: Could not give ' + username + ' editing to ' + worldName);
    }
  }
  else
  {
    console.log('ERROR: Could not give ' + username + ' editing to ' + worldName);
  }

  res.redirect('/edit-access/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removes a user's editing rights from specified world
const removeWorldEditing = async (req, res, next) => { 
  // url: /remove-editing/worldName/username
  // split result array: {"", "remove-editing", "worldName", "username"}
  const urlSplit = req.url.split('/');
  const worldName = urlSplit[2];
  const username = urlSplit[3];

  // Finding the user in database with that username
  const user = await User.findOne({username: username});

  // Finding world in database with that name
  const world = await Worlds.findOne({name: worldName});

  if (user && world)
  {
    try
    {
      // Removing the user from the list of premitted users
      world.editingPermissions.pull(user);
      await world.save();

      console.log(username + ' restricted from editing ' + worldName);
    }
    catch (e)
    {
      console.log('ERROR: Could not restrict ' + username + ' from editing ' + worldName);
    }
  }
  else
  {
    console.log('ERROR: Could not restrict ' + username + ' from editing ' + worldName);
  }

  res.redirect('/edit-access/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removes viewing restrictions from a world
const removeWorldRestrictions = async (req, res, next) => {
  // url: /remove-restrictions/worldName
  // split result array: {"", "remove-restrictions", "worldName"}
  const worldName = req.url.split('/')[2];

  // Finding world in database with that name
  const world = await Worlds.findOne({name: worldName});

  if (world)
  {
    try
    {
      // Changing world access restrictions to false
      world.viewingRestrictions = false;
      await world.save();

      console.log(worldName + ' viewing restrictions removed');
    }
    catch (e)
    {
      console.log('ERROR: ' + worldName + ' viewing restrictions could not be removed');
    }
  }

  res.redirect('/edit-access/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Puts viewing restrictions from a world
const putWorldRestrictions = async (req, res, next) => {
  // url: /put-restrictions/worldName
  // split result array: {"", "put-restrictions", "worldName"}
  const worldName = req.url.split('/')[2];

  // Finding world in database with that name
  const world = await Worlds.findOne({name: worldName});

  if (world)
  {
    try
    {
      // Changing world access restrictions to true
      world.viewingRestrictions = true;
      await world.save();

      console.log(worldName + ' viewing restrictions put');
    }
    catch (e)
    {
      console.log('ERROR: ' + worldName + ' viewing restrictions could not be put');
    }
  }

  res.redirect('/edit-access/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating magic link to user requested worlds
const createMagicLink = async (req, res, next) => 
{
  if (req.body.forwardingName && req.body.linkExpiry)
  {
    // Checking that the entered forwarding name is unique
    var forwardingExists;

    try
    {
      forwardingExists = await MagicLinks.findOne({forwardLink: req.body.forwardingName});
    }
    catch(e)
    {
      console.log(e);

      req.session.magicLinkError = 'An error occurred while creating your magic link, please try again';
      res.redirect('/explore');
    }

    if (!forwardingExists)
    {
      // Setting up success message for link creation
      var successMessage;

      // Getting expiry time of magic link (if there is one)
      var expiryTimeMin;

      if (req.body.linkExpiry === 'never')
      {
        successMessage = 'Constant magic link successfully created for the following world(s): ';
        expiryTimeMin = null;
      }
      else
      {
        successMessage = req.body.linkExpiry + ' day magic link successfully created for the following world(s): ';
        expiryTimeMin = req.body.linkExpiry * 24 * 60; // Convert days to mins
      }

      // Getting worlds to create magic link to
      const worlds = [];
      const worldNames = [];

      for (const worldName in req.body)
      {
        if (worldName !== 'linkExpiry' && worldName !== 'forwardingName')
        {
          worldNames.push(worldName);

          try 
          {
            worlds.push(await Worlds.findOne({name: worldName}));

            successMessage = successMessage + worldName + ', ';
          }
          catch (err)
          {
            console.log(err);

            req.session.magicLinkError = 'Could not create a magic link for ' + worldName + ', please try again';
            res.redirect('/explore');
          }
        }
      }

      // Removing the last 2 characters (the ' ' and ',')
      successMessage = successMessage.slice(0, -2);

      // Making sure there were worlds selected before creating the link, if not, outputting an error message
      if (worlds.length > 0)
      {
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

        const forwardingLink = baseURL + '/' + req.body.forwardingName

        // Saving magic link in database
        var linkInfo;

        // Saving magic link in database
        if (expiryTimeMin)
        {
          var expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + parseInt(req.body.linkExpiry));

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
          console.log(e);

          req.session.magicLinkError = 'An error occurred while creating your magic link, please try again';
          res.redirect('/explore');
        }

        req.session.magicLink = forwardingLink;
        req.session.magicLinkSuccess = successMessage;
      }
      else
      {
        req.session.magicLinkError = 'No worlds selected';
        req.session.magicLink = null;
        req.session.magicLinkSuccess = null;
      }

      res.redirect('/explore');
    }
    else
    {
      req.session.magicLinkError = req.body.forwardingName + ' link name is already being used, please enter a new name';
      res.redirect('/explore');
    }
  }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering the magic links page
const serveMagicLinks = async (req, res, next) => 
{
  const userInfo = getUserInfo(req);

  // Getting messages to output to user
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

  res.render(path.resolve(__dirname + '/../public/web/views/magicLinks'), {
    title: "Your Magic Links",
    userInfo: userInfo,
    successMessage: successMessage,
    errorMessage: errorMessage,
    magicLinks: magicLinks,
    baseURL: baseURL,
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Deleting magic link on user request
const deleteMagicLink = async (req, res, next) =>
{
  // url: /delete-magic-link/:magic_link
  // split result array: {"", "delete-magic-link", ":magic_link"}
  const linkName = req.url.split('/')[2];

  // Getting link from database
  const link = await MagicLinks.findOne({forwardLink: linkName}).exec();
  const linkCreator = await User.findOne(link.creator).exec();

  // Checking if the link belongs to the current user
  const currentUser = await User.findById(req.user._id).exec();

  // If it does, delete the link
  if (JSON.stringify(linkCreator) == JSON.stringify(currentUser))
  {
    // Deleting from database
    try
    {
      await MagicLinks.deleteOne({forwardLink: linkName});
      req.session.successMessage = linkName + ' successfully deleted';
    }
    catch(e)
    {
      console.log(e);

      req.session.errorMessage = linkName + ' could not be deleted, please try again';
      return res.redirect('/your-magic-links');
    }
  }

  return res.redirect('/your-magic-links');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Renewing magic link on user request
const renewMagicLink = async (req, res, next) =>
{
  // url: /renew-magic-link/:magic_link
  // split result array: {"", "renew-magic-link", ":magic_link"}
  const linkName = req.url.split('/')[2];

  if (req.body.linkExpiry)
  {
    // Getting expiry time of magic link (if there is one)
    var expiryTimeMin;

    if (req.body.linkExpiry === 'never')
    {
      expiryTimeMin = null;
    }
    else
    {
      expiryTimeMin = req.body.linkExpiry * 24 * 60; // Convert days to mins
    }

    var link = null;

    // Getting link from database
    try
    {
      link = await MagicLinks.findOne({forwardLink: linkName}).exec();
    }
    catch(e)
    {
      console.log(e);
    }

    if (link)
    {
      var worlds = [];

      // Getting worlds for magic link
      for (const worldName of link.worlds)
      {
        try 
        {
          worlds.push(await Worlds.findOne({name: worldName}));
        }
        catch (err)
        {
          console.log(err);

          req.session.errorMessage = linkName + ' could not be renewed, please try again';
          return res.redirect('/your-magic-links');
        }
      }

      const magicLink = createJWT_MagicLink(expiryTimeMin, worlds);

      // Saving new magic link in database
      link.magicLink = magicLink;

      if (expiryTimeMin)
      {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(req.body.linkExpiry));

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
        if (expiryTimeMin)
        {
          req.session.successMessage = linkName + ' successfully renewed for ' + req.body.linkExpiry + ' days';
        }
        else
        {
          req.session.successMessage = linkName + ' successfully renewed to never expire';
        }
      }
      catch(e)
      {
        console.log(e);

        req.session.errorMessage = linkName + ' could not be renewed, please try again';
      }
    }
    else
    {
      req.session.errorMessage = linkName + ' could not be renewed, please try again';
      return res.redirect('/your-magic-links');
    }
  }
  else
  {
    req.session.errorMessage = linkName + ' could not be renewed, please try again';
    return res.redirect('/your-magic-links');
  }

  return res.redirect('/your-magic-links');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const loopAndGetFolderNames =  async (folderPath) => {
  var allSubFolderNames = [];
  // Get the files as an array
  var files = null;
  try{
    files = await fs.promises.readdir(folderPath);
  }
  catch(e) {
    console.log(e.message);
    return allSubFolderNames;
  }

  // Loop them all with the new for...of
  var worldName = "";
  for( const file of files ) {
      // Get the full paths
      const fullPath = path.join( folderPath, file );

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat( fullPath );

      if( stat.isDirectory() ) {
          //console.log( fullPath + " is a directory.");
          worldName = file;
          worldName.replace(folderPath, "");
          allSubFolderNames.push(file);
      }
  }
  allSubFolderNames.sort();

  return allSubFolderNames;
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const getWorldsList = async (req, res, next) => {
  const folderPath = __dirname + '/../../src/worlds';
  loopAndGetFolderNames(folderPath).then(function(data) {
    res.json(data);
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering the user manager page
const serveUserManager = async (req, res, next) => 
{
  // Getting current user info
  const userInfo = getUserInfo(req);

  // Getting messages to output to user
  var successMessage = null;            // Success message for user creation
  var errorMessage = null;              // Error message for user creation
  var Bulk_SuccessMessage = [];         // Success message for user creation
  var Bulk_ErrorMessage = [];           // Error message for user creation
  var A_SuccessMessage = [];            // Success message for admin usertype change
  var A_ErrorMessage = [];              // Error message for admin usertype change
  var T_R_SuccessMessage = [];          // Success message for teacher and researcher usertype change
  var T_R_ErrorMessage = [];            // Error message for teacher and researcher usertype change
  var S_P_T_SuccessMessage = [];        // Success message for student, participant, and tester usertype change
  var S_P_T_ErrorMessage = [];          // Error message for student, participant, and tester usertype change

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

  if (req.session.Bulk_SuccessMessage && req.session.Bulk_SuccessMessage.length > 0)
  {
    Bulk_SuccessMessage = req.session.Bulk_SuccessMessage;
    req.session.Bulk_SuccessMessage = null;
  }

  if (req.session.Bulk_ErrorMessage && req.session.Bulk_ErrorMessage.length > 0)
  {
    Bulk_ErrorMessage = req.session.Bulk_ErrorMessage;
    req.session.Bulk_ErrorMessage = null;
  }

  if (req.session.A_SuccessMessage && req.session.A_SuccessMessage.length > 0)
  {
    A_SuccessMessage = req.session.A_SuccessMessage;
    req.session.A_SuccessMessage = null;
  }

  if (req.session.A_ErrorMessage && req.session.A_ErrorMessage.length > 0)
  {
    A_ErrorMessage = req.session.A_ErrorMessage;
    req.session.A_ErrorMessage = null;
  }

  if (req.session.T_R_SuccessMessage && req.session.T_R_SuccessMessage.length > 0)
  {
    T_R_SuccessMessage = req.session.T_R_SuccessMessage;
    req.session.T_R_SuccessMessage = null;
  }

  if (req.session.T_R_ErrorMessage && req.session.T_R_ErrorMessage.length > 0)
  {
    T_R_ErrorMessage = req.session.T_R_ErrorMessage;
    req.session.T_R_ErrorMessage = null;
  }

  if (req.session.S_P_T_SuccessMessage && req.session.S_P_T_SuccessMessage.length > 0)
  {
    S_P_T_SuccessMessage = req.session.S_P_T_SuccessMessage;
    req.session.S_P_T_SuccessMessage = null;
  }

  if (req.session.S_P_T_ErrorMessage && req.session.S_P_T_ErrorMessage.length > 0)
  {
    S_P_T_ErrorMessage = req.session.S_P_T_ErrorMessage;
    req.session.S_P_T_ErrorMessage = null;
  }

  // Getting a list of user types for forms, with a certain user type selected (depending on lookingFor)
  function getUserTypes(lookingFor)
  {
    var usertypesList = '';

    for (const key in CIRCLES.USER_TYPE)
    {
      if (CIRCLES.USER_TYPE[key] === CIRCLES.USER_TYPE.MAGIC_GUEST || CIRCLES.USER_TYPE[key] === CIRCLES.USER_TYPE.GUEST || CIRCLES.USER_TYPE[key] === CIRCLES.USER_TYPE.SUPERUSER)
      {
        // Skipping magic guest, guest and superuser types as creating these users is not an option
      }
      else if (CIRCLES.USER_TYPE[key] === lookingFor)
      {
        usertypesList += '<option selected>' + CIRCLES.USER_TYPE[key] + '</option>';
      }
      else 
      {
        usertypesList += '<option>' + CIRCLES.USER_TYPE[key] + '</option>';
      }
    }

    return usertypesList;
  }

  // 1. Ignoring the current user
  // 2. Getting all admin users
  var A_Users = await User.aggregate([
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

  // Customizing the list of user types so that the users current type is selected in the form
  for (const user of A_Users)
  {
    user.usertypesList = getUserTypes(user.usertype);
  }

  // 1. Ignoring the current user
  // 2. Getting all instructor and researcher users
  var T_R_Users = await User.aggregate([
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
          usertype: { $in: [CIRCLES.USER_TYPE.TEACHER, CIRCLES.USER_TYPE.RESEARCHER] },
        },
    },
  ]);

  // Customizing the list of user types so that the users current type is selected in the form
  for (const user of T_R_Users)
  {
    user.usertypesList = getUserTypes(user.usertype);
  }

  // 1. Ignoring the current user
  // 2. Getting all student, participant, and tester users
  var S_P_T_Users = await User.aggregate([
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
          usertype: { $in: [CIRCLES.USER_TYPE.STUDENT, CIRCLES.USER_TYPE.PARTICIPANT, CIRCLES.USER_TYPE.TESTER] },
        },
    },
  ]);

  // Customizing the list of user types so that the users current type is selected in the form
  for (const user of S_P_T_Users)
  {
    user.usertypesList = getUserTypes(user.usertype);
  }

  // Rendering the user manager page
  
  var usertypes = getUserTypes(null);

  res.render(path.resolve(__dirname + '/../public/web/views/manageUsers'), {
    title: 'Manage Users',
    errorMessage: errorMessage,
    successMessage: successMessage,
    Bulk_SuccessMessage: Bulk_SuccessMessage,
    Bulk_ErrorMessage: Bulk_ErrorMessage,
    A_SuccessMessage: A_SuccessMessage,
    A_ErrorMessage: A_ErrorMessage,
    T_R_SuccessMessage: T_R_SuccessMessage,
    T_R_ErrorMessage: T_R_ErrorMessage,
    S_P_T_SuccessMessage: S_P_T_SuccessMessage,
    S_P_T_ErrorMessage: S_P_T_ErrorMessage,
    userInfo: userInfo,
    usertypes: usertypes,
    A_Users: A_Users,
    T_R_Users: T_R_Users,
    S_P_T_Users: S_P_T_Users,
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating a new user by superuser or admin request
const createUser = async (req, res, next) => 
{
  if (req.body.username && req.body.usertype)
  {
    // Compiling all data for the new user
    const userData = {
      username: req.body.username,                                    // User entered username
      usertype: req.body.usertype,                                    // User entered usertype
      password: env.DEFAULT_PASSWORD,                                 // Default password
      displayName: req.body.username,                                 // By default, display name is the same as the username
    };

    var user = null;
    var error = null;

    // Creating new user in database
    async function createNewUser(newUser) 
    {
      try 
      {
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
          return res.redirect('/manage-users');
        }

        req.session.errorMessage = 'Something went wrong, please try again';
        return res.redirect('/manage-users');
      } 
      else 
      {
        req.session.successMessage = userData.username + ' created successfully';
        return res.redirect('/manage-users');
      }
    });
  }
  else
  {
    req.session.errorMessage = 'Something went wrong, please try again';
    return res.redirect('/manage-users');
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating new users through uploaded file
const createUsersByFile = async (req, res, next) => 
{
  // Setting up user message as arrays to allow for multiple messages
  req.session.Bulk_SuccessMessage = [];
  req.session.Bulk_ErrorMessage = [];

  // Variable to count how many users were created
  var numCreated = 0;

  // Getting file
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => 
  {
    if (err)
    {
      req.session.Bulk_ErrorMessage.push('File could not be read, please try again');
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
          req.session.Bulk_ErrorMessage.push('File could not be read, please try again');
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
              username: entryInfo[0],                                    // User entered username
              usertype: entryInfo[1],                                    // User entered usertype
              password: env.DEFAULT_PASSWORD,                            // Default password
              displayName: entryInfo[0],                                 // By default, display name is the same as the username
            }
            
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
                  req.session.Bulk_ErrorMessage.push('The following entry contains an unavailable username: ' + entry);
                }
                else
                {
                  req.session.Bulk_ErrorMessage.push('An unexpected error occured when creating the following user: ' + entry);
                }
              }
              
            }
            else
            {
              req.session.Bulk_ErrorMessage.push('The following entry has an invalid usertype: ' + entry);
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
              req.session.Bulk_ErrorMessage.push('The following entry is invalid: ' + entry);
            }
          }
        }

        req.session.Bulk_SuccessMessage.push(numCreated + ' users were successfully created');
        return res.redirect('/manage-users');
      });
    }
    // This file type means no file was uploaded
    else if (fileType === 'octet-stream')
    {
      req.session.Bulk_ErrorMessage.push('No file uploaded' );
      return res.redirect('/manage-users');
    }
    else
    {
      req.session.Bulk_ErrorMessage.push('Incorrect file type uploaded: ' + fileType.toUpperCase() + ' files are not allowed' );
      return res.redirect('/manage-users');
    }

  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Updating the user type by superuser or admin request
const updateUsertype = async (req, res, next) => 
{ 
  // Setting up user message as arrays to allow for multiple messages
  req.session.A_SuccessMessage = [];
  req.session.A_ErrorMessage = [];
  req.session.T_R_SuccessMessage = [];
  req.session.T_R_ErrorMessage = [];
  req.session.S_P_T_SuccessMessage = [];
  req.session.S_P_T_ErrorMessage = [];

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

          switch (user.usertype)
          {
            case CIRCLES.USER_TYPE.ADMIN:
              req.session.A_SuccessMessage.push(message);
              break;

            case CIRCLES.USER_TYPE.TEACHER:
            case CIRCLES.USER_TYPE.RESEARCHER:
              req.session.T_R_SuccessMessage.push(message);
              break;

            case CIRCLES.USER_TYPE.STUDENT:
            case CIRCLES.USER_TYPE.PARTICIPANT:
            case CIRCLES.USER_TYPE.TESTER:
              req.session.S_P_T_SuccessMessage.push(message);
              break;
          }
        }
        else
        {
          const message = user.username + "'s usertype failed to updated, please try again";

          switch (req.body[username])
          {
            case CIRCLES.USER_TYPE.ADMIN:
              req.session.A_ErrorMessage.push(message);
              break;

            case CIRCLES.USER_TYPE.TEACHER:
            case CIRCLES.USER_TYPE.RESEARCHER:
              req.session.T_R_ErrorMessage.push(message);
              break;

            case CIRCLES.USER_TYPE.STUDENT:
            case CIRCLES.USER_TYPE.PARTICIPANT:
            case CIRCLES.USER_TYPE.TESTER:
              req.session.S_P_T_ErrorMessage.push(message);
              break;
          }
        }
      }
    }
  }

  return res.redirect('/manage-users');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Updating the user display name for the session
const updateSessionName = function(req, res, next)
{
  // Ensuring that there is text in the display name
  // If not, not changing the display name and outputting an error message
  if (req.body.sessionName.length > 0 && req.body.sessionName[0] != ' ')
  {
    req.session.sessionName = req.body.sessionName;

    req.session.successMessage = 'Display name successfully changed for the session';
  }
  else
  {
    req.session.errorMessage = "Display name must contain text and can not start with a space (' ')";
  }

  return res.redirect('/explore');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering Circles servers page
const serveMoreCircles = (req, res, next) => 
{
  const userInfo = getUserInfo(req);

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

  var request = new XMLHttpRequest();
  request.open('GET', env.CENTRAL_SERVER + '/get-servers');

  const renderError = function (message)
  {
    res.render(path.resolve(__dirname + '/../public/web/views/moreCircles'), {
      title: 'More Circles',
      userInfo: userInfo,
      successMessage: successMessage,
      errorMessage: errorMessage,
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
      res.render(path.resolve(__dirname + '/../public/web/views/moreCircles'), {
        title: "More Circles",
        userInfo: userInfo,
        successMessage: successMessage,
        errorMessage: errorMessage,
        circleServers: JSON.parse(request.response),
      });
    }
  };

  request.send();
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering Uploaded Content page
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
  var validImages = [];
  var validVideos = [];
  var valid3D = [];

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

  res.render(path.resolve(__dirname + '/../public/web/views/uploadedContent'), {
    title: 'Uploaded Content',
    userInfo: userInfo,
    validImages: validImages,
    validVideos: validVideos,
    valid3D: valid3D,
    content: content,
    successMessage: successMessage,
    errorMessage: errorMessage,
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Storing content uploaded by user
const newContent = (req, res, next) => 
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Sending user uploaded file
const serveUploadedFile = async (req, res, next) => 
{
  // url: /uploads/file_name
  // split result array: {"", "uploads", "file_name"}
  const fileName = req.url.split('/')[2];

  // Getting file info from database
  const file = await Uploads.findOne({name: fileName}).sort().exec();
  const fileOwner = await User.findOne(file.user);

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

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Deleting user uploaded file
const deleteUploadedFile = async (req, res, next) => 
{
  // url: /delete-uploaded-content/file_name
  // split result array: {"", "delete-uploaded-content", "file_name"}
  const fileName = req.url.split('/')[2];

  // Getting file info from database
  const file = await Uploads.findOne({name: fileName}).sort().exec();
  const fileOwner = await User.findOne(file.user);

  // Checking if the file belongs to the current user
  const currentUser = await User.findById(req.user._id).sort().exec();

  // If it does, delete the file
  if (JSON.stringify(fileOwner) == JSON.stringify(currentUser))
  { 
    // Deleting from database
    await Uploads.deleteOne({name: fileName});

    // Deleting from uploads folder
    fs.rmSync(__dirname + '/../uploads/' + fileName, {recursive: true});
  }

  return res.redirect('/uploaded-content');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Returning a list of the content the current user has uploaded
const getUserFiles = async (req, res, next) => 
{
  var content = [];

  var currentUser = req.user;

  content = await Uploads.find({user: currentUser});

  res.json(content);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Sending requested whiteboard file
const serveWhiteboardFile = async (req, res, next) => 
{
  // url: /uploads/file_name
  // split result array: {"", "uploads", "file_name"}
  const fileName = req.url.split('/')[2];

  res.sendFile(path.resolve(__dirname + '/../whiteboardFiles/' + fileName));
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding sent file to world database entry (sent file was inserted by user to specified whiteboard)
const insertWhiteboardFile = async (req, res, next) => 
{
  var insertedFile = null;
  var world = null;

  try
  {
    // Finding file in database
    insertedFile = await Uploads.findOne({name: req.body.file}).exec();

    // Getting world from database
    world = await Worlds.findOne({name: req.body.world});
  }
  catch(e)
  {
    console.log(e);

    res.json(null);
    return;
  }

  // Saving file information to the world entry
  if (insertedFile && world)
  {
    // Getting the amount of files in that whiteboard to calculate current file z position
    var maxZ = 0;

    for(const file of world.whiteboardFiles)
    {
      if (file.whiteboardID === req.body.whiteboardID)
      {
        if (file.position[2] >= maxZ)
        {
          maxZ = file.position[2] + 0.001;
        }
      }
    }

    // Saving file in whiteboardFiles folder
    const uploadsPath = path.join(__dirname, '/../uploads');
    const whiteboardFilesPath = path.join(__dirname, '/../whiteboardFiles');

    // Creating unique name
    var uniqueFilePath = uniqueFilename(whiteboardFilesPath);

    // name: name.type
    // split result array: {"name", "type"}
    var type = insertedFile.name.split('.')[1];

    const uploadedFile = path.join(uploadsPath, insertedFile.name);
    const whiteboardFile = uniqueFilePath + '.' + type;

    try
    {
      fs.copyFileSync(uploadedFile, whiteboardFile, fs.constants.COPYFILE_EXCL);
    }
    catch(e)
    {
      console.log(e);

      res.json(null);
      return;
    }

    var brokenPath = whiteboardFile.split('\\');
    var name = brokenPath[brokenPath.length - 1];

    var fileInfo = {
      name: name,
      category: insertedFile.category,
      height: insertedFile.height,
      width: insertedFile.width,
      whiteboardID: req.body.whiteboardID,
      position: [0, 0, maxZ],
    };

    try
    {
      world.whiteboardFiles.push(fileInfo);
      await world.save();
    }
    catch(e)
    {
      console.log(e);

      res.json(null);
      return;
    }

    // Sending back information on the file that was inserted
    var file = JSON.parse(JSON.stringify(fileInfo));

    res.json(file);
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removing sent file to world database entry (sent file was deleted by user from a specified whiteboard)
const removeWhiteboardFile = async (req, res, next) => 
{
  var world = null;

  try
  {
    // Getting world from database
    world = await Worlds.findOne({name: req.body.world});
  }
  catch(e)
  {
    console.log(e);
  }

  // Deleting file from world entry
  if (world)
  {
    // Finding deleted file in world entry
    function findFile(file)
    {
      return file.name === req.body.file;
    }

    var toDelete = world.whiteboardFiles.find(findFile);

    // Deleting
    try
    { 
      // Deleting from database
      var index = world.whiteboardFiles.indexOf(toDelete);

      world.whiteboardFiles.splice(index, 1);

      await world.save();

      // Deleting from folder
      fs.rmSync(__dirname + '/../whiteboardFiles/' + req.body.file, {recursive: true});
    }
    catch(e)
    {
      console.log(e);
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Returning the files the whiteboard in the world has
const getWhiteboardFiles = async (req, res, next) => 
{
  var world = null;
  var files = null;

  try
  {
    // Getting world from database
    world = await Worlds.findOne({name: req.body.world});
  }
  catch(e)
  {
    console.log(e);

    res.json(null);
    return;
  }

  // Find files that are in that world, on that whiteboard
  if (world)
  {
    // Finding id of each file that is on that whiteboard
    function matchID(file)
    {
      return file.whiteboardID === req.body.whiteboardID;
    }

    files = world.whiteboardFiles.filter(matchID);
  }

  res.json(JSON.parse(JSON.stringify(files)));
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Setting file dimensions in Uploads database
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
// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Updating file position in its world database entry
const updateFilePosition = async (req, res, next) =>
{

  if (req.body.world && req.body.file && req.body.newX && req.body.newY)
  {
    var world = null;

    try
    {
      // Getting world from database
      world = await Worlds.findOne({name: req.body.world});
    }
    catch(e)
    {
      console.log(e);
    }

    // Find file entry
    if (world)
    {
      for(const file of world.whiteboardFiles)
      {
        if (file.name === req.body.file)
        {
          // Update file position
          try
          {
            file.position[0] = req.body.newX;
            file.position[1] = req.body.newY;

            await world.save();

            break;
          }
          catch(e)
          {
            console.log(e);
          }
        }
      }
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Returns current user's username and type
const getUser = async (req, res, next) =>
{
  const user = {
    username: req.user.username,
    usertype: req.user.usertype,
  }

  res.json(JSON.parse(JSON.stringify(user)));
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
  invalidAddress,
  // getAllUsers,
  // getUser,
  // updateUser,
  // deleteUser,
  updateUserInfo,
  modifyServeWorld,
  serveWorld,
  serveRelativeWorldContent,
  serveProfile,
  registerUser,
  serveRegister,
  serveExplore,
  serveAccessEdit,
  permitWorldViewing,
  removeWorldViewing,
  permitWorldEditing,
  removeWorldEditing,
  removeWorldRestrictions,
  putWorldRestrictions,
  createMagicLink,
  forwardMagicLink,
  serveMagicLinks,
  deleteMagicLink,
  renewMagicLink,
  getWorldsList,
  serveUserManager,
  createUser,
  createUsersByFile,
  updateUsertype,
  updateSessionName,
  serveMoreCircles,
  serveUploadedContent,
  newContent,
  serveUploadedFile,
  deleteUploadedFile,
  getUserFiles,
  serveWhiteboardFile,
  insertWhiteboardFile,
  removeWhiteboardFile,
  getWhiteboardFiles,
  setFileDimensions,
  updateFilePosition,
  getUser,
};