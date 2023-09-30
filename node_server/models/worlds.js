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
    displayName: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true
    },
    url: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true
    },
    group: {
      type:       mongoose.Schema.Types.ObjectId, 
      ref:        'worldGroups',
    },
    subgroup: {
      type:       mongoose.Schema.Types.ObjectId, 
      ref:        'worldGroups.subgroups',
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
      ref:        'users',
    }],
    editingPermissions: [{ 
      type:        mongoose.Schema.Types.ObjectId, 
      ref:        'users',
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
  var files = null;
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

        var stat = null;

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
        // If the world is not already in the database, add it
        // If it is, check that the settings are still the name (if something changed, update it)
        if (stat.isDirectory())
        {
          var world = null;

          try
          {
            world = await Worlds.findOne({ name: file }).exec();
          }
          catch (e)
          {
            console.log(e.message);
          }

          // Getting settings folder
          var displayName;

          try
          {
            var settings = JSON.parse(fs.readFileSync(path + '/settings.JSON', 'utf8'));
            
            if (settings.world.name)
            {
              displayName = settings.world.name;
            }
            else
            {
              displayName = file;
            }
          }
          catch(e)
          {
            displayName = file;
          }

          if (world === null)
          {
            const worldData = {
              name: file,
              displayName: displayName,
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
          else
          {
            if (world.displayName !== displayName)
            {
              world.displayName = displayName;
              await world.save();
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
  var databaseWorlds = [];

  try
  {
    databaseWorlds = await Worlds.find({});
  }
  catch (e)
  {
    console.log(e.message);
  }

  // Getting all worlds in public/worlds
  var serverWorlds = [];

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
  for (var i = 0; i < databaseWorlds.length; i++)
  {
    var world = databaseWorlds[i];

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
  var databaseWorlds = null;

  try
  {
    databaseWorlds = await Worlds.find({});
  }
  catch (e)
  {
    console.log(e);
  }

  // Getting all whiteboard files in folder
  var folderFiles = [];

  try
  {
    folderFiles = await fs.promises.readdir(__dirname + '/../whiteboardFiles');
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
      var existingFiles = [];
      
      // Going through each whiteboard file
      for (const file of world.whiteboardFiles)
      { 
        if (folderFiles.includes(file.name))
        {
          existingFiles.push(file);
        }
        else
        {
          console.log('deleting ' + file.name);
        }
      }
      
      world.whiteboardFiles = existingFiles;
      await world.save();
    }
  }
}

// Calling functions one by one (errors occur if async functions run together)
const execute = async function()
{
  await addWorlds();
  await removeDeletedWorlds();
  await checkWhiteboardFiles();
}

execute();

module.exports = Worlds;