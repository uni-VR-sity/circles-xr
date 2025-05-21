'use strict';

require('../../src/core/circles_server')

const { spawn } = require('child_process');

// -------------------------------------------------------------------------------------------------------------------------------------------------

// Getting phones from specific audio clip using allosaurus
const getPhones = async (req, res, next) =>
{
  // Running allosaurus
  const allosaurusProcess = spawn('python', ['-m', 'allosaurus.run', '-i', 'sample.wav', '--timestamp', 'True'], { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });

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

    var response = {
      status: 'success',
      phones: phones,
    }

    res.json(response);
  });
  
  // Listening for allosaurus error
  allosaurusProcess.stderr.on('data', (error) => 
  {
    console.error('Allosaurus Error: ' + error);

    var response = {
      status: 'error',
    }

    res.json(response);
  });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
   getPhones, 
}