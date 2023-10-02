'use strict';

//database
const mongoose = require('mongoose');

const fs       = require('fs');

const UploadSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
      },
    displayName: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
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
    type: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
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
});

const Uploads = mongoose.model('uploads', UploadSchema);

// Checking that all uploaded files are in the folder
const checkUploadedFiles = async function()
{
  // Getting all files in the database
  let databaseFiles = null;

  try
  {
    databaseFiles = await Uploads.find({});
  }
  catch (e)
  {
    console.log(e);
  }

  // Getting all uploaded files in folder
  let uploadedFiles = [];

  try
  {
    uploadedFiles = await fs.promises.readdir(__dirname + '/../uploads');
  }
  catch (e) 
  {
    console.log(e);
  }

  // For each file, making sure their uploaded file is in the folder
  // If not, delete their entry in the database
  if (databaseFiles)
  {
    // Going through each file
    for (const file of databaseFiles)
    {
      if (!uploadedFiles.includes(file.name))
      {
        try
        {
          console.log('deleting ' + file.name);
          await Uploads.deleteOne({name: file.name});
        }
        catch (e) 
        {
          console.log(e);
        }
      }
    }
  }
}

checkUploadedFiles();

module.exports = Uploads;