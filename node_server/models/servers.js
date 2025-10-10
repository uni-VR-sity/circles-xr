'use strict';

//database
const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    ownerName: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
    },
    description: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
    },
    worlds: { 
      type:       [String],
      unique:     false,
      required:   true,
      trim:       true,
    },
    link: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
    },
    active: {
      type:       Boolean,
      unique:     false,
      required:   true,
      trim:       true,
      default:    true,
    },
  });

  const Servers = mongoose.model('servers', ServerSchema);

  module.exports = Servers;