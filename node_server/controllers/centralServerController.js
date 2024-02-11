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
const Servers = require('../models/servers');

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

// More Circles Page Routes ------------------------------------------------------------------------------------------------------------------------

// Rendering more circles page
const serveMoreCircles = async (req, res, next) =>
{
  const userInfo = getUserInfo(req);

  // Getting success and error messages
  let successMessage = null;
  let errorMessage = null;

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
    res.render(path.resolve(__dirname + '/../public/web/views/CENTRAL_SERVER/more-circles'), {
      title: 'More Circles',
      userInfo: userInfo,
      circleServers: {},
      successMessage: successMessage,
      errorMessage: errorMessage,
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
      res.render(path.resolve(__dirname + '/../public/web/views/CENTRAL_SERVER/more-circles'), {
        title: "More Circles",
        userInfo: userInfo,
        circleServers: JSON.parse(request.response),
        successMessage: successMessage,
        errorMessage: errorMessage,
      });
    }
  };

  request.send();
}

// ------------------------------------------------------------------------------------------

const addCirclesServer = async (req, res, next) =>
{
  // Making sure all required fields are there (owner's name, description, link to server, and worlds)
  if (req.body.ownerName && req.body.link && req.body.description && req.body.circles) 
  {
    let serverData = {
      ownerName: req.body.ownerName,
      description: req.body.description,
      link: req.body.link,
      worlds: [],
    }

      // Adding circles
      // req.body.circles will either be:
      //    - 'circle'                          --> Not array (only 1 subgroup and will add that)
      //    - ['circle1', 'circle2', ...]       --> Array (will loop through and add each subgroup)
      if (Array.isArray(req.body.circles))
      {
        for(const circle of req.body.circles)
        {
          serverData.worlds.push(circle);
        }
      }
      else
      {
        serverData.worlds.push(req.body.circles);
      }

    try
    {
      await Servers.create(serverData);
      req.session.successMessage = serverData.ownerName + "'s server successfully added to database";

    }
    catch(e)
    {
      console.log(e);
      req.session.errorMessage = 'Something went wrong, please try again';
    }
  }

  return res.redirect('/more-circles');
}

// ------------------------------------------------------------------------------------------

const deactivateCirclesServer = async (req, res, next) =>
{
  // Finding server in database
  let server = await Servers.findById(req.body.server);

  // Updating active variable in server
  if (server)
  {
    try
    {
      server.active = false;
      await server.save();

      console.log(server.ownerName + "'s server set to be inactive");
    }
    catch(e)
    {
      console.log("ERROR: Could not set " + server.ownerName + "'s server to be inactive");
    }
  }
  else
  {
    console.log('ERROR: Could not get the server with following id from the database: ' + req.body.server);
  }

  res.json('complete');
}

// ------------------------------------------------------------------------------------------

const activateCirclesServer = async (req, res, next) => 
{
  // Finding server in database
  let server = await Servers.findById(req.body.server);

  // Updating active variable in server
  if (server)
  {
    try
    {
      server.active = true;
      await server.save();

      console.log(server.ownerName + "'s server set to be active");
    }
    catch(e)
    {
      console.log("ERROR: Could not set " + server.ownerName + "'s server to be active");
    }
  }
  else
  {
    console.log('ERROR: Could not get the server with following id from the database: ' + req.body.server);
  }

  res.json('complete');
}

// ------------------------------------------------------------------------------------------

const deleteCirclesServer = async (req, res, next) =>
{
  // Deleting server
  try
  {
    await Servers.findByIdAndDelete(req.body.server);

    console.log('Server with the following id deleted: ' + req.body.server);
  }
  catch(e)
  {
    console.log('ERROR: The server with the following id could not be deleted: ' + req.body.server);
  }

  res.json('complete');
}

// ------------------------------------------------------------------------------------------

// Getting list of servers from database
const getServersList = async (req, res, next) =>
{
  try 
  {
    let servers = await Servers.find({});
    res.json(servers);
  }
  catch(e)
  {
    res.json('ERROR');
  }
}

// Museum Games Page Routes ------------------------------------------------------------------------------------------------------------------------

const serveMuseumGames = async (req, res, next) =>
{
  var games = [];

  games[0] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[1] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[2] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[3] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[4] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[5] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[6] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[7] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[8] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  games[9] = {
    name: 'Game',
    credit: 'Test Studios',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'www.testergame.ca',
    image: 'default-circle-profile.png',
    contact: 'person@testStudios.ca',
  }

  res.render(path.resolve(__dirname + '/../public/web/views/CENTRAL_SERVER/museum-games'), {
    title: "Museum Games",
    games: games,
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    // More Circles Page
    serveMoreCircles,
    addCirclesServer,
    deactivateCirclesServer,
    activateCirclesServer,
    deleteCirclesServer,
    getServersList,
    // Museum Games Page
    serveMuseumGames,

  }