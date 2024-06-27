'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

const CircleSchema = new mongoose.Schema({
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
    credit: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
    },
    description: {
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
    },
    extraInfo: [{
      title: {
        type:       String,
        unique:     false,
        required:   false,
        trim:       true,
      },
      description: {
        type:       String,
        unique:     false,
        required:   false,
        trim:       true
      },
    }],
    url: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true
    },
    contact: [{
      type:       String,
      unique:     false,
      required:   false,
      trim:       true,
    }],
    hasProfileImage: {
      type:       Boolean,
      unique:     false,
      required:   true,
      trim:       true,
    },
    group: {
      type:       mongoose.Schema.Types.ObjectId, 
      ref:        'circleGroups',
    },
    subgroup: {
      type:       mongoose.Schema.Types.ObjectId, 
      ref:        'circleGroups.subgroups',
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

const Circles = mongoose.model('circles', CircleSchema);

// Adding circles from public/worlds to the database
const addCircles = async function()
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
        // If the circle is not already in the database, add it
        // If it is, check that the settings are still the same (if something changed, update it)
        if (stat.isDirectory())
        {
          var circle = null;

          try
          {
            circle = await Circles.findOne({ name: file }).exec();
          }
          catch (e)
          {
            console.log(e.message);
          }

          // Getting settings folder
          var settings;
          var displayName;

          try
          {
            settings = JSON.parse(fs.readFileSync(path + '/settings.JSON', 'utf8'));
            
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

          // Checking if world has profile image
          var hasProfileImage;

          try
          {
            fs.readFileSync(path + '/profile.jpg', 'utf8');
            hasProfileImage = true;
          }
          catch(e)
          {
            hasProfileImage = false;
          }

          if (circle === null)
          {
            const circleData = {
              name: file,
              displayName: displayName,
              url: path,
              hasProfileImage: hasProfileImage,
            };

            if (settings.world.credit)
            {
              circleData.credit = settings.world.credit;
            }

            if (settings.world.description)
            {
              circleData.description = settings.world.description;
            }

            if (settings.world.extraInfo)
            {
              circleData.extraInfo = settings.world.extraInfo;
            }

            if (settings.world.contact)
            {
              circleData.contact = settings.world.contact;
            }

            try 
            {
              await Circles.create(circleData);
              console.log(file + ' added to database');
            } 
            catch(err) 
            {
              throw file + " creation error: " + err.message;
            }
          }
          else
          {
            if (circle.displayName !== displayName)
            {
              circle.displayName = displayName;
              await circle.save();
            }

            if (circle.hasProfileImage !== hasProfileImage)
            {
              circle.hasProfileImage = hasProfileImage;
              await circle.save();
            }

            if (settings.world.credit && circle.credit !== settings.world.credit)
            {
              circle.credit = settings.world.credit;
              await circle.save();
            }

            if (settings.world.description && circle.description !== settings.world.description)
            {
              circle.description = settings.world.description;
              await circle.save();
            }

            if (settings.world.extraInfo && circle.extraInfo !== settings.world.extraInfo)
            {
              circle.extraInfo = settings.world.extraInfo;
              await circle.save();
            }

            if (settings.world.contact && circle.contact !== settings.world.contact)
            {
              circle.contact = settings.world.contact;
              await circle.save();
            }
          }
        }
      }
    }
  }
}

// Removing all circles that are in the database but not in public/worlds
const removeDeletedCircles = async function()
{
  // Getting all worlds in the database
  var databaseWorlds = [];

  try
  {
    databaseWorlds = await Circles.find({});
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
    var circle = databaseWorlds[i];

    if (!serverWorlds.includes(circle.name))
    {
      try
      {
        console.log('deleting ' + circle.name);
        await Circles.deleteOne({name: circle.name});
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
  var databaseCircles = null;

  try
  {
    databaseCircles = await Circles.find({});
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
  if (databaseCircles)
  { 
    // Going through each world
    for (const circle of databaseCircles)
    {
      var existingFiles = [];
      
      // Going through each whiteboard file
      for (const file of circle.whiteboardFiles)
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
      
      circle.whiteboardFiles = existingFiles;
      await circle.save();
    }
  }
}

// Calling functions one by one (errors occur if async functions run together)
const execute = async function()
{
  await addCircles();
  await removeDeletedCircles();
  await checkWhiteboardFiles();
}

execute();

module.exports = Circles;