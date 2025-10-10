'use strict';
const fs    = require('fs');
const path  = require('path');
// const StringReplacePlugin = require("string-replace-loader");

const env = require('./node_server/modules/env-util');

module.exports = {
  module: {
    rules: [
      {
        //test: /.\/src\/core\/circles_constants\.js$/,
        test: /circles_constants\.js$/,
        loader: 'string-replace-loader',
        options: {
          // search:'1234567',
          // replace:'9999'
          multiple: [
             { search: /'REPLACE_CIRCLES_WEBRTC_ENABLED_REPLACE'/, replace: (env.NAF_ADAPTER === 'socketio')?'false':'true', flags:'gmi'},
             { search: /'REPLACE_CIRCLES_MIC_ENABLED_REPLACE'/, replace: (env.NAF_AUDIO === true)?'true':'false', flags:'gmi'}
            ]
        }
      }
    ]
  },
  entry: './src/core/circles_client.js',
  target: 'web',
  devtool: "source-map",
  output: {
    filename: 'circles_client_bundle.min.js',
    path: path.resolve(__dirname, 'node_server/public/global/js/'),
  }
};