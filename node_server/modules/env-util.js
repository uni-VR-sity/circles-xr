const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

// Loading in config  
var env = dotenv.config({});

if (env.error) 
{
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

env = dotenvParseVariables(env.parsed);

module.exports = env;