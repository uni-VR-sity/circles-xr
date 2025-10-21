AFRAME.registerComponent('lights-interactive', {

    init() {
        const CONTEXT_AF = this;
        const scene      = CIRCLES.getCirclesSceneElement();

        // Have to capture all components we need to play with here
        CONTEXT_AF.light_1    = scene.querySelector('#light_1');
        CONTEXT_AF.light_2    = scene.querySelector('#light_2');
        CONTEXT_AF.light_3    = scene.querySelector('#light_3');
        CONTEXT_AF.light_4    = scene.querySelector('#light_4');

        // Want to keep track of which light in on/off
        CONTEXT_AF.light_1.lightOn = false;
        CONTEXT_AF.light_2.lightOn = false;
        CONTEXT_AF.light_3.lightOn = false;
        CONTEXT_AF.light_4.lightOn = false;

        // Connect to web sockets
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.synchEventName = "lights_event";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            // Light 1
            CONTEXT_AF.light_1.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_1, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn, light_2_on:CONTEXT_AF.light_2.lightOn, 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn, light_4_on:CONTEXT_AF.light_4.lightOn,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });
            
            // Light 2
            CONTEXT_AF.light_2.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_2, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn, light_2_on:CONTEXT_AF.light_2.lightOn, 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn, light_4_on:CONTEXT_AF.light_4.lightOn,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            // Light 3
            CONTEXT_AF.light_3.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_3, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn, light_2_on:CONTEXT_AF.light_2.lightOn, 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn, light_4_on:CONTEXT_AF.light_4.lightOn,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            // Light 4
            CONTEXT_AF.light_4.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_4, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn, light_2_on:CONTEXT_AF.light_2.lightOn, 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn, light_4_on:CONTEXT_AF.light_4.lightOn,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            // Listen for when others turn on lights
            CONTEXT_AF.socket.on(CONTEXT_AF.synchEventName, function(data) {
                // Light 1
                if (CONTEXT_AF.light_1.lightOn !== data.light_1_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_1, true);
                }

                // Light 2
                if (CONTEXT_AF.light_2.lightOn !== data.light_2_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_2, true);
                }

                // Light 3
                if (CONTEXT_AF.light_3.lightOn !== data.light_3_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_3, true);
                }

                // Light 4
                if (CONTEXT_AF.light_4.lightOn !== data.light_4_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_4, true);
                }
            });

            // Request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            // If someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                // If the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, { light_1_on:CONTEXT_AF.light_1.lightOn, light_2_on:CONTEXT_AF.light_2.lightOn, 
                                                                            light_3_on:CONTEXT_AF.light_3.lightOn, light_4_on:CONTEXT_AF.light_4.lightOn, 
                                                                            room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            // Receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                // Make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    // Light 1
                    if (CONTEXT_AF.light_1.lightOn !== data.light_1_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_1, false);
                    }

                    // Light 2
                    if (CONTEXT_AF.light_2.lightOn !== data.light_2_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_2, false);
                    }

                    // Light 3
                    if (CONTEXT_AF.light_3.lightOn !== data.light_3_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_3, false);
                    }

                    // Light 4
                    if (CONTEXT_AF.light_4.lightOn !== data.light_4_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_4, false);
                    }
                }
            });
        };

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log('Circles is ready: ' + CIRCLES.isReady());

            // This is the camera that is now also ready, if we want to parent elements to it i.e., a user interface or 2D buttons
            console.log("Circles camera ID: " + CIRCLES.getMainCameraElement().id);
        });

        // Check if circle networking is ready. If not, add an event to listen for when it is ...
        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        }
        else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };

            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }
    },

    toggleLight : function (lightElem, playSound) {
        lightElem.lightOn = !lightElem.lightOn;

        let emissiveIntensity = (lightElem.lightOn ) ? 6.0 : 0.0;
        let lightIntensity = (lightElem.lightOn ) ? 15.0 : 5.0;

        lightElem.setAttribute('material', { emissiveIntensity:emissiveIntensity });
        lightElem.querySelector('[light]').setAttribute('light', { intensity:lightIntensity });

        // Play sound (if another client turned on so we can make music together :)
        if (lightElem.components['circles-interactive-object'].sound && playSound === true) {
            lightElem.components['circles-interactive-object'].sound.stopSound();
            lightElem.components['circles-interactive-object'].sound.playSound();
        }
    }
});