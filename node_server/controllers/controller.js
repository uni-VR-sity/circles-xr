'use strict';

require('../../src/core/circles_server');
const mongoose = require('mongoose');
const User     = require('../models/user');
const Model3D  = require('../models/model3D');
const Worlds   = require('../models/worlds');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const dotenv   = require('dotenv');
const url      = require('url');
const dotenvParseVariables = require('dotenv-parse-variables');
const jwt      = require('jsonwebtoken');
const { CONSTANTS } = require('../../src/core/circles_research');

//load in config
let env = dotenv.config({})
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

// Rendering the register user page with a specific message to the user about their registration (ex. error messages, success messages)
const renderRegister = function(res, renderMessage)
{
    res.render(path.resolve(__dirname + '/../public/web/views/register'), {
      title: `Register for Circles`,
      message: renderMessage
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const updateUserInfo = (req, res, next) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  else {
    console.log('updating user info.');

    if (req.body.password !== req.body.passwordConf) {
      var error = new Error('Passwords do not match.');
      error.status = 400;
      res.send("passwords dont match");
      return next(error);
    }

    //Mongoose promises http://mongoosejs.com/docs/promises.html
    const promises = [
      Model3D.findOne({name: req.body.headModel}).exec(),
      Model3D.findOne({name: req.body.hairModel}).exec(),
      Model3D.findOne({name: req.body.bodyModel}).exec(),
      Model3D.findOne({name: req.body.handLeftModel}).exec(),
      Model3D.findOne({name: req.body.handRightModel}).exec(),
      User.findOne({_id:req.user._id}).exec()
    ];

    Promise.all(promises).then( (results) => {
      //add properties dynamically after, depending on what was updated ...
      const userData = {};

      //console.log(results);

      //check to make sure passwords match better some day far away ....
      if ( results[0].url !== results[5].gltf_head_url ) {
        userData.gltf_head_url = results[0].url;
      }

      //paths to models
      if ( results[1].url !== results[5].gltf_hair_url ) {
        userData.gltf_hair_url = results[1].url;
      }

      if ( results[2].url !== results[5].gltf_body_url ) {
        userData.gltf_body_url = results[2].url;
      }

      // if ( results[3].url !== results[5].gltf_hand_left_url ) {
      //   userData.gltf_hand_left_url = results[3].url;
      // }

      // if ( results[4].url !== results[5].gltf_hand_right_url ) {
      //   userData.gltf_hand_right_url = results[4].url;
      // }

      //colors
      if ( req.body.color_head !== results[5].color_head ) {
        userData.color_head = req.body.color_head;
      }

      if ( req.body.color_hair !== results[5].color_hair ) {
        userData.color_hair = req.body.color_hair;
      }

      if ( req.body.color_body !== results[5].color_body ) {
        userData.color_body = req.body.color_body;
      }

      if ( req.body.color_hand_left !== results[5].color_hand_left ) {
        userData.color_hand_left = req.body.color_hand_left;
      }

      if ( req.body.color_hand_right !== results[5].color_hand_right ) {
        userData.color_hand_right = req.body.color_hand_right;
      }

      let doc   = null;
      let error = null;
      async function updateItems() {
        try {
          doc = await User.findOneAndUpdate({_id:req.user._id}, userData, {new:true});
        } catch(err) {
          error = err;
        }
      }

      updateItems().then(function() {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/profile');
        }
      });
    }).catch(function(err){
      console.log(err);
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
      let specialStatus = '';

      const u_name = ((searchParamsObj.has('name')) ? searchParamsObj.get('name') : user.username);
      const u_height = ((searchParamsObj.has('height')) ? searchParamsObj.get('height') : CIRCLES.CONSTANTS.DEFAULT_USER_HEIGHT);

      //need to get types if available in params
      //if not valid in params set to "nothing". Could be fun to be a floating head l ;)
      let head_type = ''
      if (searchParamsObj.has('head')) {
        head_type = CIRCLES.MODEL_HEAD_TYPE['head_' + searchParamsObj.get('head')];
        if (!head_type) {
          head_type = '';
        }
      }
      else {
        head_type = user.gltf_head_url;
      }

      let hair_type = ''
      if (searchParamsObj.has('hair')) {
        hair_type = CIRCLES.MODEL_HAIR_TYPE['hair_' + searchParamsObj.get('hair')];
        if (!hair_type) {
          hair_type = '';
        }
      }
      else {
        hair_type = user.gltf_hair_url;
      }

      let body_type = ''
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

      let result = data.replace(/__WORLDNAME__/g, world_id);
      result = result.replace(/__USERTYPE__/g, user.usertype);
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

const serveProfile = (req, res, next) => {
  // Route now authenticates and ensures a user is logged in by this point
  let user = req.user;

  //Mongoose promises http://mongoosejs.com/docs/promises.html
  const promises = [
    Model3D.find({type: CIRCLES.MODEL_TYPE.HEAD}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAIR}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.BODY}).exec(),
    //Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_LEFT}).exec(),
    //Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_RIGHT}).exec()
  ];

  const queryChecks = [
    user.gltf_head_url,
    user.gltf_hair_url,
    user.gltf_body_url,
    //user.gltf_hand_left_url,
    //user.gltf_hand_right_url,
  ];

  Promise.all(promises).then((results) => {
    let optionStrs = [];   //save all option str to replace after ...

    for ( let r = 0; r < results.length; r++ ) {
      let optionsStr  = '';
      let models = results[r];
      for ( let i = 0; i < models.length; i++ ) {
        if (models[i].url === queryChecks[r]) {
          optionsStr += '<option selected>' + models[i].name + '</option>';
        }
        else {
          optionsStr += '<option>' + models[i].name + '</option>';
        }
      }
      optionStrs.push(optionsStr);
    }

    const userInfo = {
      userName: user.username,
      userType: user.usertype,
      headUrl: user.gltf_head_url,
      hairUrl: user.gltf_hair_url,
      bodyUrl: user.gltf_body_url,
      //handLeftUrl: user.gltf_hand_left_url,
      //handRightUrl: user.gltf_hand_right_url,
      headColor: user.color_head,
      hairColor: user.color_hair,
      bodyColor: user.color_body,
      handLeftColor: user.color_hand_left,
      handRightColor: user.color_hand_right,
    }

    const userOptions = {
      headOptions: optionStrs[0],
      hairOptions: optionStrs[1],
      bodyOptions: optionStrs[2],
      //handLeftOptions: optionStrs[3],
      //handRightOptions: optionStrs[4],
    }

    res.render(path.resolve(__dirname + '/../public/web/views/profile'), {
      title: `Welcome ${user.username}`,
      userInfo: userInfo,
      userOptions: userOptions
    });
  }).catch(function(err){
    console.log(err);
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creates a new user and puts them in the user database
const registerUser = (req, res, next) => {
  // Making sure all required fields are there (username, password, and password confirmation)
  if (req.body.username && req.body.password & req.body.passwordConf) 
  {
    // Making sure passwords match
    // If they don't, send an error message to the user
    if (req.body.password !== req.body.passwordConf) 
    {
      console.log('ERROR: Passwords do not match');
      renderRegister(res, 'ERROR: Passwords do not match');
    }
    else
    {
      // Compiling all data for the new user
      const userData = {
        username: req.body.username,                                    // User entered username
        usertype: CIRCLES.USER_TYPE.PARTICIPANT,                        // Default usertype upon registration is "Participant"
        password: req.body.password,                                    // User entered password
      };

      let user = null;
      let error = null;

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
            renderRegister(res, 'ERROR: Username is unavailable');
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
    renderRegister(res, 'ERROR: Something went wrong, please try again');
  }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const serveRegister = (req, res, next) => {
  renderRegister(res, '');
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting certain worlds from the world database
// Permission Types:
//    - all                 Returns all worlds in world database
//    - freeViewing         Returns all worlds that have no viewing restrictions
//    - specialViewing      Returns all worlds that the user has viewing access to
//    - editing             Returns all worlds that the user has editing access to
const getWorlds = async function(user, permissionType)
{
  let worlds = []

  if (permissionType === "all")
  {
    worlds = await Worlds.find({});
  }
  else if (permissionType === "freeViewing")
  {
    worlds = await Worlds.find({viewingRestrictions: false});
  }
  else if (permissionType === "specialViewing")
  {
    worlds = await Worlds.find({viewingPermissions: { $in: [user] }});
  }
  else if (permissionType === "editing")
  {
    worlds = await Worlds.find({editingPermissions: { $in: [user] }});
  }

  return worlds;
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Rendering the explore page after the user has logged in according to what they have access
const serveExplore = async (req, res, next) => {
  // Route now authenticates and ensures a user is logged in by this point
  let user = req.user;

  // Gathering information on the user to send to explore page
  const userInfo = {
    userName: user.username,
    userType: user.usertype,
    headUrl: user.gltf_head_url,
    hairUrl: user.gltf_hair_url,
    bodyUrl: user.gltf_body_url,
    handLeftUrl: user.gltf_hand_left_url,
    handRightUrl: user.gltf_hand_right_url,
    headColor: user.color_head,
    hairColor: user.color_hair,
    bodyColor: user.color_body,
    handLeftColor: user.color_hand_left,
    handRightColor: user.color_hand_right,
  }

  // Getting all worlds the user has access to and putting their names into an array
  // - If user is a superuser or admin, viewing and editing access is given to all worlds
  // - If user is a teacher or researcher:
  //      - Viewing access is given to to specific worlds (ones with no restrictions and ones that they have been given viewing access to)
  //      - Editing access is given to specific worlds (ones that they have been given editing access to)
  // - If user is a student, participant, or tester:
  //      - Viewing access is given to specific worlds (ones with no restrictions and ones that they have been given viewing access to)
  //      - No editing access is given
  // - If user is a guest
  //      - Viewing access is given to worlds with no restictions
  //      - No editing access is given

  let viewingWorlds = [];
  let editingWorlds = [];

  if (user.usertype === CIRCLES.USER_TYPE.SUPERUSER || user.usertype === CIRCLES.USER_TYPE.ADMIN)
  { 
    editingWorlds.push(await getWorlds(user, "all"));
  }
  else if (user.usertype === CIRCLES.USER_TYPE.TEACHER || user.usertype === CIRCLES.USER_TYPE.RESEARCHER)
  {
    viewingWorlds.push(await getWorlds(user, "freeViewing"));
    viewingWorlds.push(await getWorlds(user, "specialViewing"));
    editingWorlds.push(await getWorlds(user, "editing"));
  }
  else if (user.usertype === CIRCLES.USER_TYPE.STUDENT || user.usertype === CIRCLES.USER_TYPE.PARTICIPANT || user.usertype === CIRCLES.USER_TYPE.TESTER)
  {
    viewingWorlds.push(await getWorlds(user, "freeViewing"));
    viewingWorlds.push(await getWorlds(user, "specialViewing"));
  }
  else // Guest
  {
    viewingWorlds.push(await getWorlds(user, "freeViewing"));
  }

  // Flattening the arrays
  editingWorlds = editingWorlds.flat(2);
  viewingWorlds = viewingWorlds.flat(2);

  // Getting all world names the user can view
  let viewingArray = [];

  for (const world of viewingWorlds)
  {
    viewingArray.push(world.name);
  }

  // Getting all world names the user can edit
  let editingArray = [];

  for (const world of editingWorlds)
  {
    editingArray.push(world.name);
  }

  // Making sure there are no duplicates between the viewing and editing arrays
  // If there are, the world is kept in editing and removed from viewing
  for (const world of editingArray)
  {
    if (viewingArray.includes(world))
    {
      const index = viewingArray.indexOf(world);
      viewingArray.splice(index, 1);
    }
  }

  // Rendering the explore page
  res.render(path.resolve(__dirname + '/../public/web/views/explore'), {
    title: "Explore Worlds",
    userInfo: userInfo,
    worldViewingList: viewingArray,
    worldEditingList: editingArray
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const serveAccessEdit = async (req, res, next) => { 
  // url: /editAccess/worldName
  // split result array: {"", "editAccess", "worldName"}
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
  
    // Rendering the worldAccess page
    res.render(path.resolve(__dirname + '/../public/web/views/worldAccess'), {
      title: world.name + ' Access',
      world: worldInfo
    });
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Gives a user viewing rights to specified world
const permitWorldViewing = async (req, res, next) => { 
  // url: /permitViewing/worldName/username
  // split result array: {"", "permitViewing", "worldName", "username"}
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

  res.redirect('/editAccess/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removes a user's viewing rights from specified world
const removeWorldViewing = async (req, res, next) => { 
  // url: /removeViewing/worldName/username
  // split result array: {"", "removeViewing", "worldName", "username"}
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

  res.redirect('/editAccess/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Gives a user editing rights from specified world
const permitWorldEditing = async (req, res, next) => { 
  // url: /permitEditing/worldName/username
  // split result array: {"", "permitEditing", "worldName", "username"}
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

  res.redirect('/editAccess/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removes a user's editing rights from specified world
const removeWorldEditing = async (req, res, next) => { 
  // url: /removeEditing/worldName/username
  // split result array: {"", "removeEditing", "worldName", "username"}
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

  res.redirect('/editAccess/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Removes viewing restrictions from a world
const removeWorldRestrictions = async (req, res, next) => {
  // url: /removeRestrictions/worldName
  // split result array: {"", "removeRestrictions", "worldName"}
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

  res.redirect('/editAccess/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Puts viewing restrictions from a world
const putWorldRestrictions = async (req, res, next) => {
  // url: /putRestrictions/worldName
  // split result array: {"", "putRestrictions", "worldName"}
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

  res.redirect('/editAccess/' + worldName);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const generateAuthLink = (username, baseURL, route, expiryTimeMin) => {
  const jwtOptions = {
    issuer: 'circlesxr.com',
    audience: 'circlesxr.com',
    algorithm: 'HS256',
    expiresIn: expiryTimeMin + 'm',
  };

  const token = jwt.sign({data:username}, env.JWT_SECRET, jwtOptions); //expects seconds as expiration

  return baseURL + '/magic-login?token=' + token + '&route=' + route;
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const getMagicLinks = (req, res, next) => {
  const route = req.query.route;
  const usernameAsking  = req.query.usernameAsking;
  const userTypeAsking  = req.query.userTypeAsking;
  const expiryTimeMin   = req.query.expiryTimeMin;
  let allAccounts = [];

  //ignore req.protocol as it will try and re-direct to https anyhow.
  const baseURL = req.get('host');

  let users = null;
  let error = null;
  async function getItems() {
    try {
      users = await User.find({usertype: {$in: [CIRCLES.USER_TYPE.STUDENT, CIRCLES.USER_TYPE.PARTICIPANT, CIRCLES.USER_TYPE.TESTER]}}).exec();
    } catch(err) {
      error = err;
    }
  }

  getItems().then(function() {
    if (error) {
      res.send(error);
    }

    //add "self" first
    allAccounts.push({username:usernameAsking, magicLink:generateAuthLink(usernameAsking, baseURL, route, expiryTimeMin)});

    for (let i = 0; i < users.length; i++) {
      allAccounts.push({username:users[i].username, magicLink:generateAuthLink(users[i].username, baseURL, route, expiryTimeMin)});

      if (i === users.length - 1 ) {
        res.json(allAccounts);
      }
    }
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const loopAndGetFolderNames =  async (folderPath) => {
  let allSubFolderNames = [];
  // Get the files as an array
  let files = null;
  try{
    files = await fs.promises.readdir(folderPath);
  }
  catch(e) {
    console.log(e.message);
    return allSubFolderNames;
  }

  // Loop them all with the new for...of
  let worldName = "";
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

module.exports = {
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
  generateAuthLink,
  getMagicLinks,
  getWorldsList,
};