'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

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
        default:    true
      },
});

const Worlds = mongoose.model('worlds', WorldSchema);

const addWorlds = async function()
{
  // Getting all world folders under public/worlds
  let files = null;
  try
  {
    files = await fs.promises.readdir(__dirname + '/../public/worlds');
  }
  catch (e) 
  {
    console.log(e.message);
  }

  for (const file of files) 
  {
    const path = __dirname + '/../public/worlds/' + file;

    let stat = null;

    // Checking if path is a directory
    try
    {
      stat = await fs.promises.stat(path);
    }
    catch (e)
    {
      console.log(e.message);
    }

    // If path is a directory,
    // If the world is not already in the database,
    // Add it to the database
    if (stat.isDirectory())
    {
      let world = null;

      try
      {
        world = await Worlds.findOne({ name: file }).exec();
      }
      catch (e)
      {
        console.log(e.message);
      }

      if (world === null)
      {
        const worldData = {
          name: file,
          url: path,
        };

        try 
        {
          await Worlds.create(worldData);
          console.log(file + ' added to database');
        } 
        catch(err) 
        {
          throw file + " creation error: " + err.message;
        }
      }
    
    }
  }
}

addWorlds();

module.exports = Worlds;