'use strict';

//database
const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    ownerName: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
    },
    description: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
    },
    worlds: { 
      type:       [String],
      unique:     false,
      required:   true,
      trim:       true,
    },
    link: {
      type:       String,
      unique:     false,
      required:   true,
      trim:       true,
    },
    active: {
      type:       Boolean,
      unique:     false,
      required:   true,
      trim:       true,
      default:    true,
    },
  });

  const Servers = mongoose.model('servers', ServerSchema);

  /*
  
  const addSuperUser = async function()
  {
    const serverData1 = {
      ownerName: 'Test Server 1',
      description: 'Mauris egestas faucibus sem nec pulvinar. Donec vel hendrerit quam. Praesent dignissim, mi eget lobortis ullamcorper, eros libero congue magna, a dapibus sapien velit at ligula. Praesent ut maximus augue.',
      worlds: ['foundation', 'preach', 'racism', 'nervous', 'album'],
      link: 'testerserver1.com',
    };

    const serverData2 = {
      ownerName: 'Test Server 2',
      description: 'Mauris egestas faucibus sem nec pulvinar. Donec vel hendrerit quam.',
      worlds: ['mystery', 'fever', 'X-ray', 'citizen', 'boat', 'reader', 'corn', 'flash'],
      link: 'testerserver2.com',
    };

    const serverData3 = {
      ownerName: 'Test Server 3',
      description: 'Etiam accumsan varius erat, et congue ante tincidunt ut. Morbi ac justo a diam dictum iaculis ut id ligula. Suspendisse potenti. Phasellus ac metus et sapien semper condimentum. Etiam arcu sapien, dictum nec tempor eu, tincidunt et augue. Fusce ac magna metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      worlds: ['agency', 'integrity', 'paper', 'building', 'tragedy', 'hurt'],
      link: 'testerserver3.com',
    };
    
    
    async function createNewUser(newUser) 
    {
      try {
        user = await Servers.create(newUser);
      } 
      catch(err) 
      {
      }
    }

    createNewUser(serverData1);
    createNewUser(serverData2);
    createNewUser(serverData3);
    
  }

  addSuperUser(); 
  
  */

  module.exports = Servers;