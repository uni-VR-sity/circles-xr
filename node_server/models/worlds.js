'use strict';

//database
const mongoose = require('mongoose');

const WorldSchema = new mongoose.Schema({
    name: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
      },
    url: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
      },
    accessRestrictions: {
        type:       Boolean,
        unique:     false,
        required:   false,
        trim:       true,
        default:    false
      },
});

const Worlds = mongoose.model('worlds', WorldSchema);
module.exports = Worlds;