'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

const WorldGroupsSchema = new mongoose.Schema({
    name: {
      type:       String,
      unique:     true,
      required:   true,
      trim:       true
    },
    subgroups: [{
        name: {type: String},
    }]
});

const WorldGroups = mongoose.model('worldGroups', WorldGroupsSchema);

module.exports = WorldGroups;