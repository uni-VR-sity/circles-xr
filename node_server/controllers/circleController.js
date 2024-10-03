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

// Rendering Circles -------------------------------------------------------------------------------------------------------------------------------

const serveWorld = (req, res, next) => {
    // Need to make sure we have the trailing slash to signify a folder so that relative links works correctly
    // https://stackoverflow.com/questions/30373218/handling-relative-urls-in-a-node-js-http-server 
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

    // Make sure there are the correct url seatch params available
    const urlObj = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const searchParamsObj = urlObj.searchParams;
    // If no group indicated then assume the group 'explore'
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
}

// ------------------------------------------------------------------------------------------

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
}

// ------------------------------------------------------------------------------------------

const serveRelativeWorldContent = (req, res, next) => {
  //making it easier for devs as absolute paths are a pain to type in ...
  const worldID = req.params.world_id;
  const relURL = req.params[0];
  const newURL = '/worlds/' + worldID + '/' + relURL;
  return res.redirect(newURL);
}

// Whiteboard --------------------------------------------------------------------------------------------------------------------------------------

// Sending requested whiteboard file
const serveWhiteboardFile = async (req, res, next) => 
{
  // url: /uploads/file_name
  // split result array: {"", "uploads", "file_name"}
  const fileName = req.url.split('/')[2];

  res.sendFile(path.resolve(__dirname + '/../whiteboardFiles/' + fileName));
}

// ------------------------------------------------------------------------------------------

// Returning a list of the content the current user has uploaded
const getUserFiles = async (req, res, next) => 
{
  var content = [];

  var currentUser = req.user;

  content = await Uploads.find({user: currentUser});

  res.json(content);
}

// ------------------------------------------------------------------------------------------

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
    world = await Circles.findOne({name: req.body.world});
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

// ------------------------------------------------------------------------------------------

// Removing sent file to world database entry (sent file was deleted by user from a specified whiteboard)
const removeWhiteboardFile = async (req, res, next) => 
{
  var world = null;

  try
  {
    // Getting world from database
    world = await Circles.findOne({name: req.body.world});
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

// ------------------------------------------------------------------------------------------

// Returning the files the whiteboard in the world has
const getWhiteboardFiles = async (req, res, next) => 
{
  var world = null;
  var files = null;

  try
  {
    // Getting world from database
    world = await Circles.findOne({name: req.body.world});
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

// ------------------------------------------------------------------------------------------

// Updating file position in its world database entry
const updateFilePosition = async (req, res, next) =>
{
  if (req.body.world && req.body.file && req.body.newX && req.body.newY)
  {
    var world = null;

    try
    {
      // Getting world from database
      world = await Circles.findOne({name: req.body.world});
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

// Wardrobe ----------------------------------------------------------------------------------------------------------------------------------------

const updateUserModel = async (req, res, next) => 
{
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

    if (req.body.type === 'head')
    {
      userData.gltf_head_url = req.body.model;
    }
    else if (req.body.type === 'hair')
    {
      userData.gltf_hair_url = req.body.model;
    }
    else if (req.body.type === 'body')
    {
      userData.gltf_body_url = req.body.model;
    }

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
  else
  {
    console.log('Could not find user (' + req.user._id + ') to update profile');
    res.json('error');
    return;
  }
}

// ------------------------------------------------------------------------------------------

const updateUserColour = async (req, res, next) => 
{
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

    if (req.body.type === 'head')
    {
      userData.color_head = req.body.colour;
    }
    else if (req.body.type === 'hair')
    {
      userData.color_hair = req.body.colour;
    }
    else if (req.body.type === 'body')
    {
      userData.color_body = req.body.colour;
    }

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
  else
  {
    console.log('Could not find user (' + req.user._id + ') to update profile');
    res.json('error');
    return;
  }
}

// Data Collection ---------------------------------------------------------------------------------------------------------------------------------

// Saving data collected in an .csv
const saveCollectedData = async (req, res, next) => 
{
  if (req.body.circle)
  {
    const fileName = __dirname + '/../collectedData/' + req.body.circle + '.csv';
    const possibleData = ['date', 'time', 'user', 'position', 'name', 'description'];

    var log = '';
    var header = '';

    // Checking if .csv file exists for the circle
    var fileExists = fs.existsSync(fileName);

    // Going through possible data collected
    for (const data of possibleData)
    {
      // If that data was collected, adding it to log
      if (req.body.hasOwnProperty(data))
      {
        // If data is an array, adding each entry to the log, surrounded by quotation marks
        // Otherwise, just adding entry to log
        if (Array.isArray(req.body[data]))
        {
          log += '"';

          for (var i = 0; i < req.body[data].length; i++)
          {
            log += req.body[data][i] + ',';
          }

          // Removing last comma (,) from log
          log = log.slice(0, -1);

          log += '",';
        }
        else
        {
          // Checking is data is "user"
          // If it is, adding current user's username to log
          if (data == 'user')
          {
            log += req.user.username + ',';
          }
          else if (req.body[data].includes(','))
          {
            log += '"' + req.body[data] + '",';
          }
          else
          {
            log += req.body[data] + ',';
          }
        }

        // If .csv file does not exist for the circle, adding to header
        if (!fileExists)
        {
          header += data + ',';
        }
      }
    }

    // Removing last comma (,) from log
    log = log.slice(0, -1);

    // If .csv file does not exist for the circle, adding header to log
    // Otherwise, adding a new line at the start of the log
    if (!fileExists)
    {
      log = header.slice(0, -1) + '\n' + log;
    }
    else
    {
      log = '\n' + log;
    }

    // Adding log to .csv file
    // (If this is the first log for the circle, .csv file is created)
    try
    {
      fs.appendFileSync(fileName, log, "utf8");
    }
    catch(e)
    {
      console.log(e);
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
  // Rendering Circles
  serveWorld,
  serveRelativeWorldContent,
  // Whiteboard
  serveWhiteboardFile,
  getUserFiles,
  insertWhiteboardFile,
  removeWhiteboardFile,
  getWhiteboardFiles,
  updateFilePosition,
  // Wardrobe
  updateUserModel,
  updateUserColour,
  // Data Collection
  saveCollectedData,
}