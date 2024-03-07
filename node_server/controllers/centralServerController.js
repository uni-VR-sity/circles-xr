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
    credit: "CirclesXR",
    description: "Avoid the asteroids as you navigate through the Asteroid Field!",
    instructions: "<subtitle>VR Headset:\nEnter \"VR Mode\" to begin the game. Avoid the asteroids by jumping. Crouching, and moving side to side.\n\n<subtitle>Desktop:\nUse the WASD or arrow keys to move around through space.",
    link: "https://uni-vr-sity.ca/Asteroid-Field",
    image: "AsteroidFieldCover.png",
    contact: "Ali Arya\narya@carleton.ca\n\nAnastacia Gorbenko\nanastaciagorbenko@yahoo.ca",
    other: [{
      title: "Attributions",
      description: "\"Heart\" (https://skfb.ly/6WPTn) by freshlybaked is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).\n\n\"Asteroids Pack (metallic version)\" (https://skfb.ly/o6LtG) by SebastianSosnowski is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).\n\n\"Bold Style Font Pack 5\" (https://skfb.ly/oGGSO) by Okapiguy is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
    }],
  }

  games[1] = {
    name: "Ambivalence",
    credit: "Elis Joynes, Dandan Tao, Kylie Duck, Emily Chen",
    description: "Ambivalence is a puzzle platformer that plays on there being two halves of one whole puzzle that you switch between in order to get to the end.  ***Flashing Lights***",
    instructions: "All you need to play is your keyboard and mouse. We also suggest that you have your volume on as there are sound effects.",
    link: "https://elisvoid.itch.io/ambivalence",
    image: "AmbivalenceCover.png",
    other: [{
      title: "Attributions",
      description: "<list>Birds Sound Effect: https://freesound.org/people/hargissssound/sounds/345851/\n<list>Light Switch Sound Effect: https://freesound.org/people/FillSoko/sounds/257958/\n<list>Background music: https://soundimage.org/looping-music/",
    }],
  }

  games[2] = {
    name: "Avian RumbLOL",
    credit: "Patrick Boyer",
    description: "In Avian RumbLOL, you're a bird trying to find letters to spell out \"LOL\", \"LMAO\", and \"ROFL\" before anyone else does. Be the first to get all the letters in the right order, and you win!",
    instructions: "<subtitle>Controls:\n<list>For the Chicken: Use the \"WASD\" keys to move around.\n<list>For the Pigeon: Use the arrow keys (← ↑ → ↓) to fly in different directions.\n<list>Got a Gamepad? You can use it to control the chicken if it's connected.\n<list>Oops, Need a Do-Over? Press \"P\" to start the game again.\n<list>All Done Playing? Press \"Esc\" to quit the game.\n\n<subtitle>Rules:\n<list>Wrap-Around Magic: Your bird can magically pop from one side of the screen to the other!\n<list>Letter Hunt: Grab letters as they pop up. But watch out! Grabbing a letter makes a grumpy duck come after you.\n<list>Duck Trouble: If a grumpy duck catches you, you'll lose your letters and have to start over.\n<list>Invincible Bird: After a duck bumps into you, you'll be invincible for a short time. You'll know because your bird will look really sad but don't worry, it can't be hurt during this time.\n<list>Speedy Feathers: Every time you complete a word sequence, you get a little faster. Zoom zoom!\n<list>Bumping Birds: The chicken and pigeon can bump into each other. It's all part of the fun!",
    link: "https://pboyer2.itch.io/avian-rumblol",
    image: "AvianRumbLOLCover.png",
    contact: "boyer.patrick@gmail.com",
    other: [{
      title: "Responsible AI Use Disclosure:",
      description: "The description and playing instructions for Avian RumbLOL were crafted with the assistance of an Artificial Intelligence (AI) tool. This AI, developed by OpenAI, provided guidance on language simplification and creativity to ensure the content is engaging and understandable for a target audience of K-6 students. I am committed to using AI responsibly and transparently, enhancing my creative processes while maintaining the integrity and safety of the content. I reviewed the synthetic wording and adjusted where needed to produce the final version of the content. For any questions or concerns about the use of AI, please feel free to reach out to me.",
    }],
  }

  games[3] = {
    name: "Deck of Laughs",
    credit: "Tyson Moyes, Michael Dillabough, Jason Hein, David Dunkelman, Mathieu O'Brien",
    description: "Tactical Card Comedy! Use your spell cards to cast jokes onto the crowd of gremlins to make them laugh. Beware, the hexler will cast his own spells and end the laughter.\nBug note: In the end screen, if your mouse disappears after clicking, hit TAB on the keyboard, your mouse should reappear.",
    instructions: "Extract the files from the zip. In-game, click on the card you wish to read & select. Click on the location in the crowd to cast the spell. Right click to cancel the spell and to deselect the card. When you are done your turn, click the \"end turn\" button.",
    link: "https://skypyre.itch.io/deck-of-laughs",
    image: "DeckOfLaughsCover.png",
    contact: "general@skypyre.com",
  }

  games[4] = {
    name: "Just a Jester Jesting",
    credit: "------",
    description: "Can you perform enough tricks to survive the king's wrath?\nA 2D and 3D fusion game where you only need a mouse to play. Help the jester be funny for the court\nSurvive as long as you can while keeping all your lives (hearts), the fast paced mini games in the bottom half of the screen will test your skill. Inspired by Nintendo DS games likes Wario Ware and Rhythm Heaven. Keep up!",
    instructions: "Mouse: Use the left click to interact with elements on the bottom half of the screen. Click fast, drag, and time your clicks to stay alive.",
    link: "https://dcole.itch.io/just-a-jester-jesting",
    image: "JustAJesterJestingCover.png",
  }

  games[5] = {
    name: "Rooting for Carrots",
    credit: "Avery Babineau",
    description: "Rooting for carrots is a rpg-based farming simulator created for the 2022 Global Game Jam. The game jam theme was roots.",
    instructions: "Use the arrow keys to move. Find the garden. In the garden, left click to plant, watch the carrots grow and right click to harvest the carrots.",
    link: "https://avocadoscancode.itch.io/rooting-for-carrots",
    image: "RootingForCarrotsCover.png",
  }

  games[6] = {
    name: "Sea Barks",
    credit: "Anastacia Gorbenko, Msgana Ocabazgi, Sam Lamoureux, Zoe Prevost",
    description: "In this underwater adventure, you play the role of Neptune, an eager puppy looking to please his owner at his new underwater farm SeaBarks. Neptune is responsible for putting away the sea creatures, and protecting them from hungry sharks. Get the sea creatures in to correct pens and you will be rewarded with treats.",
    instructions: "<list>Use your keyboard arrows to move around, and the space bar to bark!\n<list>Guide sea creatures into their pens, and the catch? Neptune holds himself to good boy standards and wants to guide a minimum number of sea creatures to safety (shown on each pen). Neptune's hard work does not go unnoticed, he receives a treat before embarking on his next duty.\n<list>Barking can be used on the sea creatures and the shark to yield different results. For the sea creatures, barking has different effects on each creature (find out more on hints screen) and barking at the shark scares them away when they are attacking.\n<list>The shark will think about its meal choice for a few seconds before they attack, be prepared to defend that creature! If the shark eats too many and you can no longer meet the farm’s minimum requirements, it's level over. Don’t worry, Neptune's owner always gives him another shot!",
    link: "https://stacy-g.itch.io/sea-barks",
    image: "SeaBarksCover.png",
  }

  games[7] = {
    name: "Shooting Range (VR)",
    credit: "Anastacia Gorbenko",
    description: "------",
    instructions: "------",
    link: "https://uni-vr-sity.ca/Shooting-Range",
    image: "ShootingRangeCover.png",
    contact: "anastaciagorbenko@yahoo.ca",
  }

  games[8] = {
    name: "Super Laugh Bros",
    credit: "Forest Kristoffer Ziven Anderson, Matt Penny, Matt Diener",
    description: "You're jesters tasked with pleasing the Lord of the land... with laughter! Please his requests for humor, but stay out of his way if he runs at you, or you'll be pushed out of the arena.",
    instructions: "<subtitle>Controller Controls:\n<list>Move: Left stick\n<list>Jump: Xbox A / Sony cross / Nintendo B\n<list>Attack: Xbox X / Sony square / Nintendo Y\n\n<subtitle>Keyboard Controls:\n<list>Move: WASD / IJKL\n<list>Jump: E / U\n<list>Attack: Q / O",
    link: "https://globalgamejam.org/games/2024/super-laugh-bros-6",
    image: "SuperLaughBrosCover.png",
  }

  games[9] = {
    name: "Wattson's Way Home",
    credit: "Alex Di Nobile, Cole McMullin, Emma Souannhaphanh, Cohen Ly",
    description: "Wattson’s Way Home is a 2D platformer game about helping a little spark find his way home. One day during a thunderstorm, Wattson fell out of a lightning bolt and was sent crashing into an unsuspecting house. Lost in a strange place filled with dust bunnies and leaky pipes, Wattson only knows that he needs to make it back home. Help find Wattson’s Way Home!",
    instructions: "Use arrow keys to move, Space to jump, E/Enter to interact",
    link: "https://alexdinobile.itch.io/wattsons-way-home",
    image: "WattsonsWayHomeCover.png",
  }

  games[10] = {
    name: "Wend",
    credit: "Christa Buttera, Matt Donoghue, Quinn Hentschel, Heather Hennessey",
    description: "Wend is a single player, top-down perspective game about exploration where you, the player, will navigate a complex labyrinth, lighting your way with a single torch as you collect relics and wander towards the center. The catch, however, is that the brightness and size of your torch light is dependent on your state of motion: the torch burns low and small while you run through the labyrinth, and burns bright and large while you stand still. Luminescent gems can be found throughout the labyrinth and allow you to mark your way as you proceed along the dark and mysterious paths. Uncover the mysteries of these unexplored depths as you wend your way through the labyrinth, and recover ancient relics to discover the secrets that lie at its center.",
    instructions: "You, the player, have the ability to control your torch light through the game's movement mechanics: while moving, only a small radius around your avatar is illuminated. While stationary, however, your torch is raised automatically to expand this radius to the neighbouring pathways to view a greater portion of the labyrinth. While playing, you can discover and collect emissive gems hidden throughout the labyrinth to help you find your way. These gems illuminate a small area around themselves, and, as such, can be placed anywhere in the labyrinth to create strategic paths to specific areas or landmarks that you deem significant.\n\n<subtitle>Controller Controls:\nUse the left stick to move around the labyrinth\nUse the right stick to move the camera (only enabled when you're standing still!)\nPress 'A' to pick up and drop gems, and to collect relics\nPress Start to pause\n\n<subtitle>Keyboard Controls:\nWASD to move\nArrow keys to move camera\nB key for picking up/dropping objects and any other action button prompts\nTAB to pause (arrow keys to navigate menus while paused)",
    link: "https://christabuttera.itch.io/wend",
    image: "WendCover.png",
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