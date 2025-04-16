'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

const MagicLinkSchema = new mongoose.Schema({
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
    },
    forwardLink: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    magicLink: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    expires: {
        type:       Boolean,
        unique:     false,
        required:   true,
        trim:       true,
    },
    expiryDate: {
        type:       Date,
        unique:     false,
        required:   false,
        trim:       true,
      },
    worlds: { 
        type:       [String], 
        required:   true,
    },
});

const MagicLinks = mongoose.model('magicLinks', MagicLinkSchema);

module.exports = MagicLinks;