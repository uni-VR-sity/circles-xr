// Setting up mail transporter to send emails
// https://www.youtube.com/watch?v=HI_KKUvcwtk

'use strict';

const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

// ------------------------------------------------------------------------------------------

// Loading in config  
var env = dotenv.config({});

if (env.error) 
{
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

env = dotenvParseVariables(env.parsed);

// ------------------------------------------------------------------------------------------

const createMailTransporter = () => 
{
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: env.EMAIL,
            pass: env.EMAIL_PASS,
        },
    });

    return transporter;
}

// ------------------------------------------------------------------------------------------

module.exports = { createMailTransporter };