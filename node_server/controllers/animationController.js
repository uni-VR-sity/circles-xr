'use strict';

require('../../src/core/circles_server');

const fs = require('fs');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const uniqueFilename = require('unique-filename');

// -------------------------------------------------------------------------------------------------------------------------------------------------

// Getting phones from audio clip
const getPhonesFromAudio = (req, res, next) =>
{
  var audioFile = 'src' + req.body.audio;

  getPhones(res, audioFile, false);
}

// ------------------------------------------------------------------------------------------

// Getting audio clip and phones from blob
const getPhonesFromBlob = (req, res, next) =>
{
  var responseGiven = false;
  var ffmpegError = '';

  // Creating audio clip file from blob
  const mp3AudioFile = uniqueFilename(__dirname) + '.mp3';

  const writeStream = fs.createWriteStream(mp3AudioFile);
  req.pipe(writeStream);

  // Listening for file to finish writing
  writeStream.on('finish', () => 
  {
    // Converting .mp3 to .wav
    const wavAudioFile = mp3AudioFile.replace('.mp3', '.wav');

    const ffmpegProcess = spawn('ffmpeg', ['-i', mp3AudioFile, wavAudioFile]);

    // (ffmpeg outputs everything to stderr)
    ffmpegProcess.stderr.on('data', (err) => 
    {
      ffmpegError += err;
    });

    ffmpegProcess.on('close', (code) =>
    {
      if (!responseGiven)
      {
        responseGiven = true;
        // If processing was successful, getting phones from .wav file
        // Otherwise, returning error message
        if (code == 0)
        {
          getPhones(res, wavAudioFile, true);

          // Deleting .mp3 file
          fs.unlink(mp3AudioFile, (err => 
          {
            if (err)
            {
              console.log('Error Deleting MP3 File: ' + err);
            }
          }));
        }
        else
        {
          console.log('ffmpeg Error: ' + ffmpegError);

          var response = {
            status: 'error',
          }

          res.json(response);
        }
      }
    });
  });

  // Listing for file writing error
  writeStream.on('error', (err) => 
  {
    console.log('Write Stream Error:' + err);

    if (!responseGiven)
    {
      responseGiven = true;

      var response = {
        status: 'error',
      }

      res.json(response);
    }
  });

}

// ------------------------------------------------------------------------------------------

// Getting phones from specific audio clip using allosaurus
const getPhones = function(res, audioFile, deleteFile)
{
  var responseGiven = false;

  // Running allosaurus
  const allosaurusProcess = spawn('python', ['-m', 'allosaurus.run', '-i', audioFile, '--timestamp', 'True'], { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  
  // Listening for allosaurus output
  allosaurusProcess.stdout.on('data', (data) => 
  {
    // Breaking output into strings for each line
    // Example output: 
    // 0.210 0.045 æ
    // 0.390 0.045 l
    // 0.450 0.045 u
    // 0.540 0.045 s
    // 0.630 0.045 ɔ
    // 0.720 0.045 ɹ
    // 0.870 0.045 s
    var phoneStrings = data.toString().split('\r\n');

    // Getting data about each phone from its string
    var phones = [];

    for (const phoneString of phoneStrings)
    {
      if (phoneString != '')
      {
        var phoneData = phoneString.split(' ');

        var phone = {
          start: phoneData[0],
          duration: phoneData[1],
          phone: phoneData[2]
        };

        // Adding phone to list
        phones.push(phone);
      }
    }

    if (!responseGiven)
    {
      responseGiven = true;

      var response = {
        status: 'success',
        phones: phones,
      }

      res.json(response);
    }

    // Deleting audio file
    if (deleteFile)
    {
      fs.unlink(audioFile, (err => 
      {
        if (err)
        {
          console.log(err);
        }
      }));
    }
  });
  
  // Listening for allosaurus error
  allosaurusProcess.stderr.on('data', (error) => 
  {
    console.log('Allosaurus Error: ' + error);

    if (!responseGiven)
    {
      responseGiven = true;
      
      var response = {
        status: 'error',
      }

      res.json(response);
    }

    // Deleting audio file
    if (deleteFile)
    {
      fs.unlink(audioFile, (err => 
      {
        if (err)
        {
          console.log(err);
        }
      }));
    }
  });
  
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
   getPhonesFromAudio, 
   getPhonesFromBlob,
}