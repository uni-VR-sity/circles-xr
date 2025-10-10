'use strict';
const fs    = require('fs');
const path  = require('path');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');

const env = require('./node_server/modules/env-util.js');

// Read in parts content to insert (default parts)
let circles_header              =  fs.readFileSync('./src/webpack.worlds.parts/circles_header.part.html', 'utf8');
let circles_basic_ui            =  fs.readFileSync('./src/webpack.worlds.parts/circles_basic_ui.part.html', 'utf8');
let circles_enter_ui            =  fs.readFileSync('./src/webpack.worlds.parts/circles_enter_ui.part.html', 'utf8');
let circles_scene_properties    =  fs.readFileSync('./src/webpack.worlds.parts/circles_scene_properties.part.html', 'utf8');
let circles_assets              =  fs.readFileSync('./src/webpack.worlds.parts/circles_assets.part.html', 'utf8');
let circles_avatar              =  fs.readFileSync('./src/webpack.worlds.parts/circles_avatar_manager.part.html', 'utf8');
let circles_end_scripts         =  fs.readFileSync('./src/webpack.worlds.parts/circles_end_scripts.part.html', 'utf8');

// Read in parts content to insert (no networking parts)
let circles_NN_scene_properties =  fs.readFileSync('./src/webpack.worlds.parts/noNetworking/circles_NN_scene_properties.part.html', 'utf8');
let circles_NN_end_scripts      =  fs.readFileSync('./src/webpack.worlds.parts/noNetworking/circles_NN_end_scripts.part.html', 'utf8');

// Read in parts content to insert (no avatar parts)
let circles_NA_enter_ui         =  fs.readFileSync('./src/webpack.worlds.parts/noAvatar/circles_NA_enter_ui.part.html', 'utf8');
let circles_NA_avatar           =  fs.readFileSync('./src/webpack.worlds.parts/noAvatar/circles_NA_avatar_manager.part.html', 'utf8');

const nafAudioRegex   = new RegExp(/\{\{(\s+)?NAF_AUDIO(\s+)?\}\}/,   'gmi');
const nafAdapterRegex = new RegExp(/\{\{(\s+)?NAF_ADAPTER(\s+)?\}\}/, 'gmi');
const nafServerRegex  = new RegExp(/\{\{(\s+)?NAF_SERVER(\s+)?\}\}/,  'gmi');

// Insert env vars into parts
circles_scene_properties = circles_scene_properties.toString().replace(nafAudioRegex,   env.NAF_AUDIO);
circles_scene_properties = circles_scene_properties.toString().replace(nafAdapterRegex, env.NAF_ADAPTER);
circles_scene_properties = circles_scene_properties.toString().replace(nafServerRegex,  env.NAF_SERVER);

// Removing the current public worlds folder
fs.rmSync(__dirname + '/node_server/public/worlds', {recursive: true, force: true});

function transformWorldHtml(content, filePath) {
  if (filePath.endsWith('.html')) {
    content = content.toString();
    content = content.replace(/<circles-start-scripts(\s+)?\/>/i, circles_header);
    content = content.replace(/<circles-basic-ui(\s+)?\/>/i, circles_basic_ui);
    content = content.replace(/<circles-start-ui(\s+)?\/>/i, circles_enter_ui);
    content = content.replace(/circles_scene_properties/i, circles_scene_properties);
    content = content.replace(/<circles-assets(\s+)?\/>/i, circles_assets);
    content = content.replace(/<circles-manager-avatar(\s+)?\/>/i, circles_avatar);
    content = content.replace(/<circles-end-scripts(\s+)?\/>/i, circles_end_scripts);
    content = content.replace(/circles_NN_scene_properties/i, circles_NN_scene_properties);
    content = content.replace(/<circles-NN-end-scripts(\s+)?\/>/i, circles_NN_end_scripts);
    content = content.replace(/<circles-NA-start-ui(\s+)?\/>/i, circles_NA_enter_ui);
    content = content.replace(/<circles-NA-manager-avatar(\s+)?\/>/i, circles_NA_avatar);
    return content;
  }
  return content;
}

module.exports = {
  entry: function() {
    return {};
  },
  output: {
    path: path.resolve(__dirname, 'node_server/public/worlds')
  },
  target: 'web',
  devtool: "source-map",
  performance: {
    hints: false
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['node_server/public/worlds'],
      verbose: true
    }),
    new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/worlds',
            to: './',
            noErrorOnMissing: true,
            transform (content, filePath) {
              return transformWorldHtml(content, filePath);
            }
          },
          {
            from: '../worlds',
            to: './',
            noErrorOnMissing: true,
            transform (content, filePath) {
              return transformWorldHtml(content, filePath);
            }
          }
        ]
      }
    )
  ]
}
