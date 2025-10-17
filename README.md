# CIRCLES XR Learning Framework

<img src="node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true" width="49.3%" alt="Screenshot of 3D avatars around the campfire in CIRCLES" />  <img src="node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' world that highlights the challenges women face in the trades" /><img src="node_server/public/global/images/Circles_KinematicsHub.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' hub world for showcasing basic kinematics" /> <img src="node_server/public/global/images/Circles_ExampleWorld.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' example world for showing Circles' features to developers" />

----------------

## Table of Contents

<br>

- [Circles Overview](#circles-overview)
- [Required Installs](#required-installs)
- [Submodule Circles-XR and Setup](#submodule-circles-xr-and-setup)
- [Circles Components](https://github.com/uni-VR-sity/circles-xr/tree/main/src/components#readme)
- [Example Worlds](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples)
    - [Hello World](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/hello-world)
    - [Networking](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/networking)
    - [Fully Featured World](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/fully-featured)


<br>

----------------

## Circles Overview

<br>

This is an internal development fork of [Circles-XR](https://github.com/PlumCantaloupe/circlesxr) built by [Anthony Scavarelli](http://portfolio.anthony-scavarelli.com/)

<br>

----------------

## Required Installs

<br>

1. Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
    - Install the [Compass application](https://www.mongodb.com/try/download/compass). This is usually included with the mongo community server install.
1. Install the "LTS" version of [Node.js / npm](https://nodejs.org/en/download/)
1. Make sure you have [Python](https://www.python.org/downloads/) installed

<br>


## Submodule Circles-XR and Setup

<br>

1. Create and empty folder for your project
1. Open a terminal in that folder project and run the following commands:
    - `git submodule add https://github.com/uni-VR-sity/circles-xr`
    - `git submodule update --init --recursive`
1. Go into circles folder and install NPM dependencies:
    - `cd circles-xr`
    - `npm install`
1. Set up the Environment file:
    - `cp .env.dist .env` (or just duplicate the .env.dist file and rename it as .env)
    - Make any changes to your .env file that are specific to your environment
1. Make sure that a Mongo instance is started and running with the Compass application
1. Serve the app so you can view it in your browser. Run this command from within the circle-xr folder:
    - `npm run serve`
1. In a browser (recommend Chrome at this time), go to `localhost:1111`
1. Username: superuser
1. Password: password

<br>
  
----------------
