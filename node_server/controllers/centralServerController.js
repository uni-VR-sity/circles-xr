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
    name: "Asteroid Field (VR)",
    credit: "------",
    description: "------",
    instructions: "------",
    link: "------",
    image: "default-circle-profile.png",
    contact: "------",
  }

  games[1] = {
    name: "Ambivalence",
    credit: "Elis Joynes",
    description: "------",
    instructions: "------",
    link: "https://elisvoid.itch.io/ambivalence",
    image: "default-circle-profile.png",
    contact: '-----',
  }

  games[2] = {
    name: "Avian RumbLOL",
    credit: "------",
    description: "------",
    instructions: "------",
    link: "------",
    image: "default-circle-profile.png",
    contact: "------",
  }

  games[3] = {
    name: "Deck of Laughs",
    credit: "Tyson Moyes, Michael Dillabough, Jason Hein, David Dunkelman, Mathieu O'Brien",
    description: "Tactical Card Comedy! Use your spell cards to cast jokes onto the crowd of gremlins to make them laugh. Beware, the hexler will cast his own spells and end the laughter.\nBug note: In the end screen, if your mouse disappears after clicking, hit TAB on the keyboard, your mouse should reappear.",
    instructions: "Extract the files from the zip. In-game, click on the card you wish to read & select. Click on the location in the crowd to cast the spell. Right click to cancel the spell and to deselect the card. When you are done your turn, click the 'end turn' button.",
    link: "https://skypyre.itch.io/deck-of-laughs",
    image: "DeckOfLaughsCover.png",
    contact: "general@skypyre.com",
  }

  games[4] = {
    name: "Just a Jester Jesting",
    credit: "------",
    description: "Can you perform enough tricks to survive the king's wrath?\nA 2D and 3D fusion game where you only need a mouse to play. Help the jester be funny for the court\nSurvive as long as you can while keeping all your lives (hearts), the fast paced mini games in the bottom half of the screen will test your skill. Inspired by Nintendo DS games likes Wario Ware and Rhythm Heaven. Keep up!",
    instructions: "Mouse: Use the left click to interact with elements on the bottom half of the screen\nClick fast, drag, and time your clicks to stay alive.",
    link: "https://dcole.itch.io/just-a-jester-jesting",
    image: "default-circle-profile.png",
    contact: "------",
  }

  games[5] = {
    name: "Sea Barks",
    credit: "Anastacia Gorbenko, Msgana Ocabazgi, Sam Lamoureux, Zoe Prevost",
    description: "In this underwater adventure, you play the role of Neptune, an eager puppy looking to please his owner at his new underwater farm SeaBarks. Neptune is responsible for putting away the sea creatures, and protecting them from hungry sharks. Get the sea creatures in to correct pens and you will be rewarded with treats.",
    instructions: "Use your keyboard arrows to move around, and the space bar to bark!\nGuide sea creatures into their pens, and the catch? Neptune holds himself to good boy standards and wants to guide a minimum number of sea creatures to safety (shown on each pen). Neptune's hard work does not go unnoticed, he receives a treat before embarking on his next duty.\nBarking can be used on the sea creatures and the shark to yield different results. For the sea creatures, barking has different effects on each creature (find out more on hints screen) and barking at the shark scares them away when they are attacking.\nThe shark will think about its meal choice for a few seconds before they attack, be prepared to defend that creature! If the shark eats too many and you can no longer meet the farm’s minimum requirements, it's level over. Don’t worry, Neptune's owner always gives him another shot!",
    link: "https://stacy-g.itch.io/sea-barks",
    image: "SeaBarksCover.png",
    contact: "------",
  }

  games[6] = {
    name: "Shooting range (VR)",
    credit: "Anastacia Gorbenko",
    description: "------",
    instructions: "------",
    link: "------",
    image: "ShootingRangeCover.png",
    contact: "------",
  }

  games[7] = {
    name: "Super Laugh Bros",
    credit: "------",
    description: "You're jesters tasked with pleasing the Lord of the land... with laughter! Please his requests for humor, but stay out of his way if he runs at you, or you'll be pushed out of the arena.",
    instructions: "Controller controls:\nMove: left stick\nJump: Xbox A / Sony cross / Nintendo B\nAttack: Xbox X / Sony square / Nintendo Y\n\nKeyboard controls:\nMove: WASD / IJKL\nJump: E / U\nAttack: Q / O",
    link: "https://globalgamejam.org/games/2024/super-laugh-bros-6",
    image: "default-circle-profile.png",
    contact: "------",
  }

  games[8] = {
    name: "Wattson's Way Home",
    credit: "------",
    description: "------",
    instructions: "------",
    link: "https://alexdinobile.itch.io/wattsons-way-home",
    image: "default-circle-profile.png",
    contact: "------",
  }

  games[9] = {
    name: "Wend",
    credit: "Chrita B",
    description: "Wend is a single player, top-down perspective game about exploration where you, the player, will navigate a complex labyrinth, lighting your way with a single torch as you collect relics and wander towards the center. The catch, however, is that the brightness and size of your torch light is dependent on your state of motion",
    instructions: "Controller:\nUse the left stick to move around the labyrinth\nUse the right stick to move the camera (only enabled when you're standing still!)\nPress 'A' to pick up and drop gems, and to collect relics\nPress Start to pause\n\nKeyboard Controls:\nWASD to move\nArrow keys to move camera\nB key for picking up/dropping objects and any other action button prompts\nTAB to pause (arrow keys to navigate menus while paused)",
    link: "https://christabuttera.itch.io/wend",
    image: "default-circle-profile.png",
    contact: "------",
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