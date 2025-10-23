# Circles Networking

<br>

Circles uses [Networked-Aframe](https://github.com/networked-aframe/networked-aframe) to sync avatars and various networked objects. 
It can send basic messages and small javascript objects, as well as sync events. If you want to add your own _networked_ objects, please consult the [Networked-Aframe documentation](https://github.com/networked-aframe/networked-aframe/blob/master/README.md). 

_For voice or vother large bandwidth items like video, you will have to run a janus server and use the [naf-janus-adapter](https://github.com/networked-aframe/naf-janus-adapter). For local development, it defaults to fast and reliable [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) communication that does not support voice and video._

The following example shows how to implement a networked light (a simplified example from [Fully Featured World](https://github.com/uni-VR-sity/circles-xr/tree/main/src/worlds/fully-featured))

```js
// Connect to web sockets to sync the lights between users
CONTEXT_AF.socket = null;
CONTEXT_AF.connected = false;
CONTEXT_AF.synchEventName = "lights_event";

// Create a function to call to get all the networked stuff connected
CONTEXT_AF.createNetworkingSystem = function () {
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
    CONTEXT_AF.connected = true;
    console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

    CONTEXT_AF.light.addEventListener('click', function () {
        CONTEXT_AF.toggleLight(CONTEXT_AF.light, false);
        CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light.lightOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    });

    // Listen for when others turn on the light on
    CONTEXT_AF.socket.on(CONTEXT_AF.synchEventName, function(data) {
        if (CONTEXT_AF.light.lightOn !== data.light_on) {
            CONTEXT_AF.toggleLight(CONTEXT_AF.light, true);
        }
    });

    // Request other user's state to sync up
    // Asking over a random time to try and minimize users loading and asking at the same time
    setTimeout(function() {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }, THREE.MathUtils.randInt(0,1200));

    // Sending data if someone else requests to sync
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
        // If the same world as the one requesting
        if (data.world === CIRCLES.getCirclesWorldName()) {
            CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, { light_on:CONTEXT_AF.light.lightOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
        }
    });

    // Receiving sync data from others
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
        // Make sure we are receiving data for this world
        if (data.world === CIRCLES.getCirclesWorldName()) {
            if (CONTEXT_AF.light.lightOn !== data.light_on) {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light, false);
            }
        }
    });
}
```