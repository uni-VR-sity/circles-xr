'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

const CircleGroupsSchema = new mongoose.Schema({
    name: {
      type:       String,
      unique:     true,
      required:   true,
      trim:       true
    },
    subgroups: [{
        name: { 
                type: String,
              },
    }]
});

const CircleGroups = mongoose.model('circleGroups', CircleGroupsSchema);

module.exports = CircleGroups;