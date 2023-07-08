'use strict';

//database
const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
      },
    displayName: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
      },
    name: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
      },
    url: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
      },
    type: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
      },
    category: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
      },
});

const Uploads = mongoose.model('uploads', UploadSchema);

module.exports = Uploads;