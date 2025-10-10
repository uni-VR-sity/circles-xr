// Setting up mail transporter to send emails
// https://www.youtube.com/watch?v=HI_KKUvcwtk
// https://www.youtube.com/watch?app=desktop&v=-rcRf7yswfM&t=05m58s

'use strict';

const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const env = require('../../node_server/modules/env-util');

// Creating OAuth2 client
const oAuth2Client = new google.auth.OAuth2(env.EMAIL_CLIENT_ID, env.EMAIL_CLIENT_SECRET, env.EMAIL_REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: env.EMAIL_REFRESH_TOKEN });

// Sending email
const createMailTransporter = () =>
{
    try
    {
        const accessToken = oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:
            {
                type: 'OAuth2',
                user: env.EMAIL,
                clientId: env.EMAIL_CLIENT_ID,
                clientSecret: env.EMAIL_CLIENT_SECRET,
                refreshToken: env.EMAIL_REFRESH_TOKEN,
                accessToken: accessToken,
            }
        });

        return transport;
    }
    catch(e)
    {
        console.log(e);
        return null;
    }
}

// ------------------------------------------------------------------------------------------

module.exports = { createMailTransporter };