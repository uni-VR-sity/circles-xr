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
    viewingRestrictions: {
        type:       Boolean,
        unique:     false,
        required:   false,
        trim:       true,
        default:    true
      },
    viewingPermissions: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users' 
    }],
    editingPermissions: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users' 
    }],
});

const Worlds = mongoose.model('worlds', WorldSchema);

// Adding worlds from public/worlds to the database
const addWorlds = async function()
{
  // Getting all world folders under public/worlds
  let files = null;
  try
  {
    files = await fs.promises.readdir(__dirname + '/../public/worlds/');
  }
  catch (e) 
  {
    console.log(e.message);
  }

  for (const file of files) 
  {
    // Skipping over Wardrobe world as everyone has access to it
    if (file != 'Wardrobe')
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
}

// Removing all worlds that are in the database but not in public/worlds
const removeDeletedWorlds = async function()
{
  // Getting all worlds in the database
  let databaseWorlds = [];

  try
  {
    databaseWorlds = await Worlds.find({});
  }
  catch (e)
  {
    console.log(e.message);
  }

  // Getting all worlds in public/worlds
  let serverWorlds = [];

  try
  {
    serverWorlds = await fs.promises.readdir(__dirname + '/../public/worlds/');
  }
  catch (e) 
  {
    console.log(e.message);
  }

  // Comparing the worlds in the database to the worlds in public/worlds
  // If a world in the database is not in public/worlds, delete it
  for (const world of databaseWorlds)
  {
    if (!serverWorlds.includes(world.name))
    {
      try
      {
        console.log('deleting ' + world.name);
        await Worlds.deleteOne({name: world.name});
      }
      catch (e) 
      {
        console.log(e.message);
      }
    }
  }
}

addWorlds();
removeDeletedWorlds();

module.exports = Worlds;