'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');
const path     = require('path');

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

const worldDirs = [
  path.join(__dirname, '../../src/worlds/'),
  path.join(__dirname, '../../../worlds/')
];

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

  // To avoid processing duplicates
  const processedFolders = new Set();

  for (const worldDir of worldDirs)
  {
    let folders = null;

    try {
      folders = await fs.promises.readdir(worldDir);
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.warn(`Directory not found, skipping: ${worldDir}`);
      } else {
        console.error(`Error reading directory ${worldDir}:`, e);
      }
      continue;
    }

    for (const folder of folders)
    {
      if (folder === 'Wardrobe' || processedFolders.has(folder)) continue;

      const fullPath = path.join(worldDir, folder);

      let stat;
      try {
        stat = await fs.promises.stat(fullPath);
      } catch (e) {
        console.log(`Error stating folder ${fullPath}: ${e.message}`);
        continue;
      }

      if (!stat.isDirectory()) continue;

      processedFolders.add(folder);  // Avoid reprocessing this folder if it's found in both locations

      // Try to find existing circle in DB
      let circle = null;
      try {
        circle = await Circles.findOne({ name: folder }).exec();
      } catch (e) {
        console.log(`Error querying DB for ${folder}: ${e.message}`);
      }

      // Read settings.JSON
      let circleSettings;
      try {
        circleSettings = JSON.parse(fs.readFileSync(path.join(fullPath, 'settings.JSON'), 'utf8'));
      } catch (e) {
        circleSettings = null;
      }

      let displayName = folder;
      if (circleSettings?.world?.name) {
        displayName = circleSettings.world.name;
      }

      let hasProfileImage;
      try {
        fs.readFileSync(path.join(fullPath, 'profile.jpg'));
        hasProfileImage = true;
      } catch (e) {
        hasProfileImage = false;
      }

      if (circle === null)
      {
        let circleData = {
          name: folder,
          displayName: displayName,
          url: fullPath,
          hasProfileImage: hasProfileImage,
        };

        if (circleSettings?.world)
        {
          circleData = addCircleSettings(possibleWorldSettings, circleSettings.world, circleData);
        }

        try {
          await Circles.create(circleData);
          console.log(`${folder} added to database`);
        } catch (err) {
          throw `${folder} creation error: ${err.message}`;
        }
      }
      else
      {
        // Update existing circle
        if (circle.displayName !== displayName)
          circle.displayName = displayName;

        if (circle.hasProfileImage !== hasProfileImage)
          circle.hasProfileImage = hasProfileImage;

        if (circleSettings?.world)
        {
          updateCircleSettings(possibleWorldSettings, circleSettings.world, circle);
        }
        else
        {
          resetCircleSettings(possibleWorldSettings, circle);
        }

        await circle.save();
      }
    }
  }
}


// ------------------------------------------------------------------------------------------

// Removing all circles that are in the database but not in public/worlds
const removeDeletedCircles = async function()
{
  let databaseWorlds = [];
  try {
    databaseWorlds = await Circles.find({});
  } catch (e) {
    console.error('Error loading worlds from DB:', e.message);
    return;
  }

  // Use a Set for fast and clean existence checks
  const serverWorlds = new Set();

  for (const worldDir of worldDirs) {
    try {
      const folders = await fs.promises.readdir(worldDir);
      folders.forEach(folder => serverWorlds.add(folder));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.warn(`Directory not found, skipping: ${worldDir}`);
      } else {
        console.error(`Error reading directory ${worldDir}:`, e);
      }
    }
  }

  // Compare database entries to actual folders and delete missing ones
  for (const circle of databaseWorlds) {
    if (!serverWorlds.has(circle.name)) {
      try {
        console.log('Deleting circle from DB:', circle.name);
        await Circles.deleteOne({ name: circle.name });
      } catch (e) {
        console.error(`Error deleting ${circle.name}:`, e.message);
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