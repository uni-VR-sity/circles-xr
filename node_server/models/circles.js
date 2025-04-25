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

// ------------------------------------------------------------------------------------------

// Adding circle settings to circle data
const addCircleSettings = function(possibleSettings, circleSettings, circleData)
{
  // Going through all possible settings
  for (const setting of possibleSettings)
  {
    // If the circle has the setting, storing its value
    if (circleSettings.hasOwnProperty(setting.name))
    {
      circleData[setting.circleName] = circleSettings[setting.name];
    }
  }

  return circleData;
}

// ------------------------------------------------------------------------------------------

// Updating circle settings in circle
const updateCircleSettings = function(possibleSettings, circleSettings, circle)
{
  // Going through all possible settings
  for (const setting of possibleSettings)
  {
    // Checking if circle has the setting
    if (circleSettings.hasOwnProperty(setting.name))
    {
      // If the setting has changed, saving the new value
      if (setting.type == "string")
      {
        if (circle[setting.circleName] !== circleSettings[setting.name])
        {
          circle[setting.circleName] = circleSettings[setting.name];
        }
      }
      else if (setting.type == "array")
      {
        if (JSON.stringify(circle[setting.circleName]) !== JSON.stringify(circleSettings[setting.name]))
        {
          circle[setting.circleName] = circleSettings[setting.name];
        }
      }
    }
    // Resetting value in case setting was removed
    else
    {
      if (setting.type == "string")
      {
        circle[setting.circleName] = null;
      }
      else if (setting.type == "array")
      {
        circle[setting.circleName] = [];
      }
    }
  }
}

// ------------------------------------------------------------------------------------------

// Resetting circle setting in circle
const resetCircleSettings = function(possibleSettings, circle)
{
  // Going through all possible settings and resetting them
  for (const setting of possibleSettings)
  {
    if (setting.type == "string")
    {
      circle[setting.circleName] = null;
    }
    else if (setting.type == "array")
    {
      circle[setting.circleName] = [];
    }
  }
}

// ------------------------------------------------------------------------------------------

// Adding circles from public/worlds to the database
const addCircles = async function()
{
  const possibleWorldSettings = [
    { name: 'credit', type: 'string', circleName: 'credit' },
    { name: 'description', type: 'string', circleName: 'description' },
    { name: 'extraInfo', type: 'array', circleName: 'extraInfo' },
    { name: 'contact', type: 'array', circleName: 'contact' },
  ];

  // Getting all world folders under public/worlds
  var folders = null;
  try
  {
    folders = await fs.promises.readdir(__dirname + '/../../src/worlds/');
  }
  catch(e) 
  {
    console.log(e.message);
  }

  if (folders)
  {
    for (const folder of folders)
    {
      // Skipping over Wardrobe circle as everyone has access to it
      if (folder != 'Wardrobe')
      {
        const path = __dirname + '/../../src/worlds/' + folder;

        // Checking if path is a directory
        var stat = null;

        try
        {
          stat = await fs.promises.stat(path);
        }
        catch(e)
        {
          console.log(e.message);
        }

        // Making sure path is a directory
        if (stat.isDirectory())
        {
          // Getting circle from database
          var circle = null;

          try
          {
            circle = await Circles.findOne({ name: folder }).exec();
          }
          catch(e)
          {
            console.log(e.message);
          }

          // Getting settings file and display name from it
          var circleSettings;

          try
          {
            circleSettings = JSON.parse(fs.readFileSync(path + '/settings.JSON', 'utf8'));
          }
          catch(e)
          {
            circleSettings = null;
          }

          // Checking if circle has display name
          // Otherwise assigning the folder name to be the display name
          var displayName;

          if (circleSettings && circleSettings.world && circleSettings.world.name)
          {
            displayName = circleSettings.world.name;
          }
          else
          {
            displayName = folder;
          }

          // Checking if circle has profile image
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

          // If circle is not in the database, add it
          if (circle === null)
          {
            var circleData = {
              name: folder,
              displayName: displayName,
              url: path,
              hasProfileImage: hasProfileImage,
            };

            // Getting settings
            if (circleSettings)
            {
              // World settings
              if (circleSettings.world)
              {
                circleData = addCircleSettings(possibleWorldSettings, circleSettings.world, circleData);
              }
            }

            // Adding circle to database
            try 
            {
              await Circles.create(circleData);
              console.log(folder + ' added to database');
            } 
            catch(err) 
            {
              throw folder + " creation error: " + err.message;
            }
          }
          // If the circle is already in the database, check that the information is still the same (if something changed, update it)
          else
          {
            // Display name
            if (circle.displayName !== displayName)
            {
              circle.displayName = displayName;
            }

            // Profile image
            if (circle.hasProfileImage !== hasProfileImage)
            {
              circle.hasProfileImage = hasProfileImage;
            }

            // Settings
            if (circleSettings)
            {
              // World settings
              if (circleSettings.world)
              {
                updateCircleSettings(possibleWorldSettings, circleSettings.world, circle);
              }
              else
              {
                // If there were world settings that have been removed, resetting relevant settings
                resetCircleSettings(possibleWorldSettings, circle);
              }
            }
            else
            {
              // If there were settings that have been removed, resetting all settings
              resetCircleSettings(possibleWorldSettings, circle);
            }

            await circle.save();
          }
        }
      }
    }
  }
}

// ------------------------------------------------------------------------------------------

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
    serverWorlds = await fs.promises.readdir(__dirname + '/../../src/worlds/');
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

// ------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------

// Calling functions one by one (errors occur if async functions run together)
const execute = async function()
{
  await addCircles();
  await removeDeletedCircles();
  await checkWhiteboardFiles();
}

execute();

module.exports = Circles;