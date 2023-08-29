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
        type:       mongoose.Schema.Types.ObjectId, 
        ref:        'users' 
    }],
    editingPermissions: [{ 
        type:        mongoose.Schema.Types.ObjectId, 
        ref:        'users'
    }],
    whiteboardFiles: [{
      name: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true,
      },
      category: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
      },
      height: {
        type:       Number,
        unique:     false,
        required:   false,
        trim:       true
      },
      width: {
        type:       Number,
        unique:     false,
        required:   false,
        trim:       true
      },
      whiteboardID: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true,
      },
      position: {
        type: [Number],       // 3 values: [x, y, z]
        required: true,
      }
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

  if (files)
  {
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

// Checking that all whiteboard files are in the folder
const checkWhiteboardFiles = async function()
{
  // Getting all worlds in the database
  let databaseWorlds = null;

  try
  {
    databaseWorlds = await Worlds.find({});
  }
  catch (e)
  {
    console.log(e);
  }

  // Getting all whiteboard files in folder
  let whiteboardFiles = [];

  try
  {
    whiteboardFiles = await fs.promises.readdir(__dirname + '/../whiteboardFiles');
  }
  catch (e) 
  {
    console.log(e);
  }

  // For each world, making sure their whiteboard files are in the folder
  // If not, delete their entry in the database
  if (databaseWorlds)
  {
    // Going through each world
    for (const world of databaseWorlds)
    {
      // Going through each whiteboard file
      for (const file of world.whiteboardFiles)
      {
        if (!whiteboardFiles.includes(file.name))
        {
          try
          {
            console.log('deleting ' + file.name);

            var index = world.whiteboardFiles.indexOf(file);
            world.whiteboardFiles.splice(index, 1);

            await world.save();
          }
          catch (e) 
          {
            console.log(e);
          }
        }
      }
    }
  }
}

addWorlds();
removeDeletedWorlds();
checkWhiteboardFiles();

module.exports = Worlds;