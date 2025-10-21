# CIRCLES XR Learning Framework

<img src="node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true" width="49.3%" alt="Screenshot of 3D avatars around the campfire in CIRCLES" />  <img src="node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' world that highlights the challenges women face in the trades" /><img src="node_server/public/global/images/Circles_KinematicsHub.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' hub world for showcasing basic kinematics" /> <img src="node_server/public/global/images/Circles_ExampleWorld.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' example world for showing Circles' features to developers" />

<br>

## Circles XR Overview

This is an internal development fork of [CIRCLES XR Learning Framework](https://github.com/PlumCantaloupe/circlesxr) built by [Anthony Scavarelli](http://portfolio.anthony-scavarelli.com/)

<br>

## Required Installs

1. Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
    - Install the [Compass application](https://www.mongodb.com/try/download/compass). This is usually included with the mongo community server install.
2. Install the "LTS" version of [Node.js / npm](https://nodejs.org/en/download/)
3. Make sure you have [Python](https://www.python.org/downloads/) installed

<br>

## Submodule Circles XR and Setup

1. Create an empty folder for your project
2. Open a terminal in that folder project and run the following commands:
    - `git submodule add https://github.com/uni-VR-sity/circles-xr`
    - `git submodule update --init --recursive`
3. Go into circles folder and install NPM dependencies:
    - `cd circles-xr`
    - `npm install`
4. Set up the Environment file:
    - `cp .env.dist .env` (or just duplicate the .env.dist file and rename it as .env)
    - Make any changes to your .env file that are specific to your environment
5. Make sure that a Mongo instance is started and running with the Compass application
6. Serve the app so you can view it in your browser. Run this command from within the circle-xr folder:
    - `npm run serve`
7. In a browser (recommend Chrome at this time), go to `localhost:1111`
8. Username: superuser
9. Password: password

<br>

## Developer Mode

To enable developer mode, set `DEVELOPER_MODE=true` in .env. This will enable to following features:
- Update world on page load instead of on server load
- Automatically click on "Enter Circles" button on enter UI

<br>

## Documentation and Examples
- [Server Management](https://github.com/uni-VR-sity/circles-xr/tree/main/docs#server-management)
- [World Creation](https://github.com/uni-VR-sity/circles-xr/tree/main/docs#world-creation)
- [Circles Core](https://github.com/uni-VR-sity/circles-xr/tree/main/docs#core)
- [Circles Networking](https://github.com/uni-VR-sity/circles-xr/tree/main/docs/#networking)
- [Circles Components](https://github.com/uni-VR-sity/circles-xr/tree/main/docs/components)
- [Example Worlds](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples)
    - [Hello World](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/hello-world)
    - [Networking](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/networking)
    - [Fully Featured World](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/examples/fully-featured)