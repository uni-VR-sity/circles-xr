// Creating standalone_controller.js file for others to reference to create standalone Circles worlds

const fs = require('fs');

const dotenv                = require('dotenv');
const dotenvParseVariables  = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

env = dotenvParseVariables(env.parsed);

// Getting standalone_controller.js template
let controller                  = fs.readFileSync('./node_server/controllers/standalone_template.js', 'utf8');


// Adding in the central server domain name
// -------------------------------------------------------------------------------------------------------------------------------------------------------
controller = controller.replace('central-domain', env.DOMAIN);


// Inserting world parts
// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting world parts
let circles_header              =  fs.readFileSync('./src/webpack.worlds.parts/circles_header.part.html', 'utf8');
let circles_enter_ui            =  fs.readFileSync('./src/webpack.worlds.parts/circles_enter_ui.part.html', 'utf8');
let circles_scene_properties    =  fs.readFileSync('./src/webpack.worlds.parts/circles_scene_properties.part.html', 'utf8');
let circles_assets              =  fs.readFileSync('./src/webpack.worlds.parts/circles_assets.part.html', 'utf8');
let circles_avatar              =  fs.readFileSync('./src/webpack.worlds.parts/circles_avatar_manager.part.html', 'utf8');
let circles_end_scripts         =  fs.readFileSync('./src/webpack.worlds.parts/circles_end_scripts.part.html', 'utf8');

// Inserting env vars into scene properties
const nafAudioRegex   = new RegExp(/\{\{(\s+)?NAF_AUDIO(\s+)?\}\}/,   'gmi');
const nafAdapterRegex = new RegExp(/\{\{(\s+)?NAF_ADAPTER(\s+)?\}\}/, 'gmi');
const nafServerRegex  = new RegExp(/\{\{(\s+)?NAF_SERVER(\s+)?\}\}/,  'gmi');

circles_scene_properties = circles_scene_properties.toString().replace(nafAudioRegex,   env.NAF_AUDIO);
circles_scene_properties = circles_scene_properties.toString().replace(nafAdapterRegex, env.NAF_ADAPTER);
circles_scene_properties = circles_scene_properties.toString().replace(nafServerRegex,  env.NAF_SERVER);

// Updating header and start UI to request the files from the central server
circles_header = circles_header.replace(/\/global/gm, env.DOMAIN + '/standalone-circles/get-file');
circles_enter_ui = circles_enter_ui.replace(/\/global/gm, env.DOMAIN + '/standalone-circles/get-file');

// Extracting header elements to append them to document
// Title
let circles_title = circles_header.split(/<title>(.+)?<\/title>/gm)[1];

// Scripts
let circles_scripts = [];
let circles_scripts_unfiltered = circles_header.split(/src="(.+)?"/gm);

for (const line of circles_scripts_unfiltered)
{
  if (line.includes('/js/'))
  {
    circles_scripts.push(line);
  }
}

// Style
let circles_style = [];
let circles_style_unfiltered = circles_header.split(/href="(.+)?"/gm);

for (const line of circles_style_unfiltered)
{
  if (line.includes('/css/'))
  {
    circles_style.push(line);
  }
}

// Removing all line breaks (and replacing with spaces to keep multiline statements seperate) to create a string
circles_enter_ui                = circles_enter_ui.replace(/[\r\n]+/gm, ' ');
circles_scene_properties        = circles_scene_properties.replace(/[\r\n]+/gm, ' ');
circles_assets                  = circles_assets.replace(/[\r\n]+/gm, ' ');
circles_avatar                  = circles_avatar.replace(/[\r\n]+/gm, ' ');
circles_end_scripts             = circles_end_scripts.replace(/[\r\n]+/gm, ' ');

// Updating controller script
controller = controller.replace('title-part', circles_title);
controller = controller.replace('scripts-part', circles_scripts);
controller = controller.replace('style-part', circles_style);
controller = controller.replace('start-ui-part', circles_enter_ui);
controller = controller.replace('scene-part', circles_scene_properties);
controller = controller.replace('assets-part', circles_assets);
controller = controller.replace('avatar-part', circles_avatar);
controller = controller.replace('end-part', circles_end_scripts);


// Overwriting controller script file to update
// -------------------------------------------------------------------------------------------------------------------------------------------------------

fs.writeFileSync('./node_server/controllers/standalone_controller.js', controller);