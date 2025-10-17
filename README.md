# CIRCLES XR Learning Framework

<img src="node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true" width="49.3%" alt="Screenshot of 3D avatars around the campfire in CIRCLES" />  <img src="node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' world that highlights the challenges women face in the trades" /><img src="node_server/public/global/images/Circles_KinematicsHub.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' hub world for showcasing basic kinematics" /> <img src="node_server/public/global/images/Circles_ExampleWorld.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' example world for showing Circles' features to developers" />

----------------

## Table of Contents

<br>

- [Circles Overview](#circles-overview)
- [Running Circles Locally](#running-circles-locally)
- [Creating A New Circles World](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds#readme)
- [Circles Components](https://github.com/uni-VR-sity/circles-xr/tree/main/src/components#readme)
- [Circles Networking](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/networking#readme)

----------------

## Circles Overview

This is a development fork of [Circles-XR](https://github.com/PlumCantaloupe/circlesxr) built by [Anthony Scavarelli](http://portfolio.anthony-scavarelli.com/)

----------------

## Running Circles Locally
##### *[back to top](#circles-xr-learning-framework)*

<br>

1. Clone repo
    - `git clone https://github.com/PlumCantaloupe/circlesxr.git`
1. Though not necessary, [Visual Studio Code](https://code.visualstudio.com/) is recommended to develop, run, and modify *Circles*. Additionally, VSCode allows you to easily open [an integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) to execute the terminal commands below. It also has many [built-in Github features](https://code.visualstudio.com/docs/editor/versioncontrol). 
1. [Install mongo community server](https://www.mongodb.com/docs/manual/administration/install-community/)
    - We also _recommend_ installing the [MongoDB command line tool](https://www.mongodb.com/docs/mongodb-shell/) so that you can access the Mongo databases via command line, though you can also use the [Compass application](https://www.mongodb.com/docs/compass/current/). This is usually included with the mongo community server install.
1. [Install node/npm](https://nodejs.org/en/download/). **NOTE: We recommend installing the "LTS" version of npm/node.**
1. Make sure you have [Python installed](https://www.python.org/downloads/) (as some libraries may require Python to build this project with NPM)
1. Go into project folder and install NPM dependencies 
    - `npm install`
1. Set up the Environment file
    - `cp .env.dist .env` (or just duplicate the .env.dist file and rename it as .env :)
    - Make any changes to your .env file that are specific to your environment
1. Make sure that a Mongo instance is started and running, either as a service or via command line (see [installation and running instructions for your specific operating system](https://www.mongodb.com/docs/manual/administration/install-community/)).
1. Serve the app so you can view it in your browser
    - `npm run serve`
    - This will build the needed bundles and serve the app for viewing. Check
      out the `scripts` section of `package.json` for more build options and
      details.
1. Please note that due some insecurities around running WebXR (and this library) that we need to [serve webXR content using https](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Startup_and_shutdown). Any easy way to do so using localhost is to use a port-forwarding tool like [ngrok](https://ngrok.com/) to run everything properly across all supported WebXR platforms.
1. In a browser (recommend Chrome at this time), go to `localhost:{SERVER_PORT}/add-all-test-data` (default is `localhost:1111/add-all-test-data`) to add both models to mongo db and test users. Note that if you are using localhost your browser (Chrome at this time) may complain about your site [re-directing assets to load via https and creating https mismatches](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) so you may try other browsers (i.e., Firefox), or consider _[highly recommended]_ using [ngrok](https://ngrok.com/) to serve up localhost as a remote https endpoint (note for WebXR to properly function on reality-based devices i.e. tablets or HMDs the content must served via https). Though ngrok works very well, [please see here for ngrok alternatives](https://github.com/anderspitman/awesome-tunneling). This will also allow you to easily test locally on other devices i.e., a mobile or standalone HMD device, and show your development to other collaborators via a publicly accessible URL.
    - **NOTE:** If you need to clean up or modify db contents use th MongoDB [Compass Application](https://www.mongodb.com/docs/compass/current/?_ga=2.136660531.242864686.1674159088-1142880638.1674159088) or [mongosh](https://www.mongodb.com/docs/mongodb-shell/) shell. For example, to drop the entire _circles_ db (which you will have to do when we make changes to the db structure) use the following commands within the mongosh shell (the re-add data with `localhost:{SERVER_PORT}/add-all-test-data` url):
        - `use circles`
        - `db.dropDatabase()`
1. Login with one of the 3 test users when you enter `localhost:{SERVER_PORT}/`, or as recommended above using [ngrok](https://ngrok.com/), `https://your_ngrok_url.ngrok.io/`(there are also others i.e., t1, r1, p1, p2, p3)
    - `{username}:{password}`
    - `s1@circlesxr.com:password`
    - `s2@circlesxr.com:password`
    - `s3@circlesxr.com:password`
1. Open another instance of browser (or open incognito mode, or another browser)
1. Log in with another user and have fun seeing each other!

*Deploying Remotely: If you are planning on running this on a remote instance like [AWS](https://aws.amazon.com) please see [Networked-Aframe's instructions on doing so with WebRTC](https://github.com/networked-aframe/naf-janus-adapter/blob/master/docs/janus-deployment.md), including some notes from the [Mozilla Hubs team on potential hosting costs](https://hubs.mozilla.com/docs/hubs-cloud-aws-costs.html).*

### Instance Routes

- */explore* (this is to see the list of worlds included here)
- */register* (has been disabled for now)
- */profile*
- */campfire*
- */add-all-test-data* (only do this once, or if you have deleted/dropped the database and need to re-populate test data )
  
----------------
