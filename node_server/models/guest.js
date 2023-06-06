'use strict';

//database
const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    expireAt: {
      type:       Date,
      expires:    86400,  // Expires in 24 hours
      unique:     false,
      required:   true,
      default:    Date.now
    },
    username: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
      default:    "Guest"
    },
    usertype: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
      default:    CIRCLES.USER_TYPE.GUEST
    },
    displayName: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       false,
      default:    "Guest"
    },
    gltf_head_url: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_GLTF_HEAD
    },
    gltf_hair_url: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_GLTF_HAIR
    },
    gltf_body_url: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_GLTF_BODY
    },
    color_head: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR
    },
    color_hair: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_HAIR_COLOUR
    },
    color_body: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_BODY_COLOUR
    },
    color_hand_left: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR
    },
    color_hand_right: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
      default:    CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR
    }
  });

  const Guest = mongoose.model('guests', GuestSchema);

  module.exports = Guest;
