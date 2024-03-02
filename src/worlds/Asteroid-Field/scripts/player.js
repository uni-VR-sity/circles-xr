'user strict'

// Controls player behaviour

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Setting up player functionility on desktop
// (Player position, movement, cursor interaction, collider)
function setUpDesktopPlayer(schema, element, playerHeight, colliderRadius)
{
    // Position
    element.setAttribute('position', {
        x: 0,
        y: playerHeight,
        z: 0,
    });

    // Movement
    var minBounds = {
        x: -playerHeight * 2, 
        y: playerHeight / 2, 
        z: 0
    }

    var maxBounds = {
        x: playerHeight * 2, 
        y: playerHeight * 2.5, 
        z: 0
    };

    element.setAttribute('player-wasd', {
        active: schema.canMove,
        minBounds: minBounds,
        maxBounds: maxBounds,
    });

    // Cursor interaction
    var cursor = document.createElement('a-entity');
    
    cursor.setAttribute('cursor', {
        rayOrigin: 'mouse',
    });

    cursor.setAttribute('raycaster', {
        objects: '.interactive', 
        far: 100,
        interval: 30, 
        useWorldCoordinates: true,
    });

    element.querySelector('[camera]').appendChild(cursor);

    // Player collider
    element.querySelector('[camera]').setAttribute('static-body', {
        sphereRadius: colliderRadius,
    });
}

// ------------------------------------------------------------------------------------------

// Setting up player functionality on desktop
// (Controller interaction, collider)
function setUpHeadsetPlayer(schema, element, colliderRadius)
{
    // Left Controller interaction
    setUpController(element, 'left', schema.hasControllers);

    // Right Controller interaction
    setUpController(element, 'right', schema.hasControllers);

    // Player collider
    element.querySelector('[camera]').setAttribute('static-body', {
        sphereRadius: colliderRadius,
    });
}

// ------------------------------------------------------------------------------------------

// Setting up player controller
function setUpController(element, side, showLine)
{
    var controller = document.createElement('a-entity');
    controller.setAttribute('id', side + '-controller');

    controller.setAttribute('laser-controls', { 
        hand: side, 
        model: false});

        controller.setAttribute('hand-controls', {
        hand: side, 
        handModelStyle: 'lowPoly'});

        controller.setAttribute('raycaster', {
        objects: '.interactive', 
        far: 100,
        interval: 30, 
        showLine: showLine, 
        useWorldCoordinates: true
    });

    element.appendChild(controller);
}

// ------------------------------------------------------------------------------------------

// Editing controller to show or hide raycaster line
function editController(element, side, showLine)
{
    element.querySelector('#' + side + '-controller').setAttribute('raycaster', {
        showLine: showLine,
    });
}

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('player', 
{
    schema: 
    {
        canMove: {type: 'boolean', default: false},
        hasControllers: {type: 'boolean', default: true},
    },

    init: function()
    {
        this.DESKTOP_CONSTANTS = {
            PLAYER_HEIGHT: 10,
            COLLIDER_RADIUS: 0.4,
        }

        this.HEADSET_CONSTANTS = {
            COLLIDER_RADIUS: 0.2,
        }

        const element = this.el;
        const schema = this.data;

        this.test = 1;

        this.getPlayerHeight = this.getPlayerHeight.bind(this);

        // Setting up player depending on what device they are on
        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            setUpHeadsetPlayer(schema, element, this.HEADSET_CONSTANTS.COLLIDER_RADIUS);

            // Waiting for user to enter vr to get their height
            document.querySelector('a-scene').addEventListener('enter-vr', this.getPlayerHeight);
        }
        else
        {
            setUpDesktopPlayer(schema, element, this.DESKTOP_CONSTANTS.PLAYER_HEIGHT, this.DESKTOP_CONSTANTS.COLLIDER_RADIUS);

            // Emitting event that player is ready
            element.emit('player-ready', {playerHeight: this.DESKTOP_CONSTANTS.PLAYER_HEIGHT}, false);
        }
    },

    update: function(oldData)
    {
        const element = this.el;
        const schema = this.data;
        
        // If player on headset
        //      If player can have controllers, showing raycaster lines
        //      Otherwise, hiding them
        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            if (schema.hasControllers && !oldData.hasControllers)
            {
                editController(element, 'left', true);
                editController(element, 'right', true);
            }
            else if (!schema.hasControllers && oldData.hasControllers)
            {
                editController(element, 'left', false);
                editController(element, 'right', false);
            }
        }

        // If player on desktop,
        //      If player can move, activating player-wasd component
        //      Otherwise, disabling it
        if (!AFRAME.utils.device.checkHeadsetConnected())
        {
            if (schema.canMove && !oldData.canMove)
            {
                element.setAttribute('player-wasd', {
                    active: true,
                });
            }
            else if (!schema.canMove && oldData.canMove)
            {
                element.setAttribute('player-wasd', {
                    active: false,
                });
            }
        }
    },

    // Getting player height in headset
    getPlayerHeight: function(event)
    {
        const element = this.el;
        const schema = this.data;

        setTimeout(function() 
        {
            var playerHeight = element.querySelector('[camera]').getAttribute('position').y;
            
            // Emitting event that player is ready
            element.emit('player-ready', {playerHeight: playerHeight}, false);

        }, 500);

        document.querySelector('a-scene').removeEventListener('enter-vr', getPlayerHeight);
    },
});