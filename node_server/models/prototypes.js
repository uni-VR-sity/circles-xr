'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

const PrototypeSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
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
});

const Prototypes = mongoose.model('prototypes', PrototypeSchema);

// Checking that all prototypes are in the folder
const checkPrototypes = async function()
{
  // Getting all files in the database
  let databasePrototypes = null;

  try
  {
    databasePrototypes = await Prototypes.find({});
  }
  catch (e)
  {
    console.log(e);
  }

  // Getting all prototypes in folder
  let folderPrototypes = [];

  try
  {
    folderPrototypes = await fs.promises.readdir(__dirname + '/../public/prototypes/created');
  }
  catch (e) 
  {
    console.log(e);
  }

  // For each prototype in the database, making sure their prototype is in the folder
  // If not, delete their entry in the database
  if (databasePrototypes)
  {
    // Going through each prototype
    for (const prototype of databasePrototypes)
    {
      if (!folderPrototypes.includes(prototype.name))
      {
        try
        {
          console.log('deleting ' + prototype.name);
          await Prototypes.deleteOne({name: prototype.name});
        }
        catch (e) 
        {
          console.log(e);
        }
      }
    }
  }
}

checkPrototypes();

module.exports = Prototypes;