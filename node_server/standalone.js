// Creating standalone_controller.js file for others to reference to create standalone Circles worlds

const fs = require('fs');

// Getting standalone_controller.js template
let controller                  = fs.readFileSync('./node_server/controllers/standalone_template.js', 'utf8');

// Getting world parts
let circles_header              =  fs.readFileSync('./src/webpack.worlds.parts/circles_header.part.html', 'utf8');
let circles_enter_ui            =  fs.readFileSync('./src/webpack.worlds.parts/circles_enter_ui.part.html', 'utf8');
let circles_scene_properties    =  fs.readFileSync('./src/webpack.worlds.parts/circles_scene_properties.part.html', 'utf8');
let circles_assets              =  fs.readFileSync('./src/webpack.worlds.parts/circles_assets.part.html', 'utf8');
let circles_avatar              =  fs.readFileSync('./src/webpack.worlds.parts/circles_avatar_manager.part.html', 'utf8');
let circles_end_scripts         =  fs.readFileSync('./src/webpack.worlds.parts/circles_end_scripts.part.html', 'utf8');

// Removing all line breaks to create a string
circles_header                  = circles_header.replace(/[\r\n]+/gm, '');
circles_enter_ui                = circles_enter_ui.replace(/[\r\n]+/gm, '');
circles_scene_properties        = circles_scene_properties.replace(/[\r\n]+/gm, '');
circles_assets                  = circles_assets.replace(/[\r\n]+/gm, '');
circles_avatar                  = circles_avatar.replace(/[\r\n]+/gm, '');
circles_end_scripts             = circles_end_scripts.replace(/[\r\n]+/gm, '');

// Updating controller script
controller                      = controller.replace('start-scripts-part', circles_header);
controller                      = controller.replace('start-ui-part', circles_enter_ui);
controller                      = controller.replace('scene-part', circles_scene_properties);
controller                      = controller.replace('assets-part', circles_assets);
controller                      = controller.replace('avatar-part', circles_avatar);
controller                      = controller.replace('end-part', circles_end_scripts);

// Overwriting controller script file to update
fs.writeFileSync('./node_server/controllers/standalone_controller.js', controller);