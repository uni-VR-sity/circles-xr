'user strict'

// Controls player behaviour

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('player', 
{
    scheme: 
    {
        canMove: {type: 'boolean', default: false},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.playerHeight = 10;

        // If player on desktop, setting player position, movement (WASD and arrow keys), and cursor interaction
        // Otherwise, setting up controller interaction and waiting for user to enter vr to get their height from the camera
        if (!AFRAME.utils.device.checkHeadsetConnected())
        {
            // Position
            element.setAttribute('position', {
                x: 0,
                y: this.playerHeight,
                z: 0,
            });

            // Movement
            var minBounds = {
                x: -this.playerHeight * 2, 
                y: this.playerHeight / 2, 
                z: 0
            }

            var maxBounds = {
                x: this.playerHeight * 2, 
                y: this.playerHeight * 2.5, 
                z: 0
            };

            element.setAttribute('player-wasd', {
                active: false,
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
                far: 20,
                interval: 30, 
                useWorldCoordinates: true,
            });

            element.querySelector('[camera]').appendChild(cursor);

            // Emitting event that player is ready
            element.emit('player-ready', {playerHeight: this.playerHeight}, false);
        }
        else
        {
            // Left Controller interaction
            var leftController = document.createElement('a-entity');
            leftController.setAttribute('id', 'left-controller');
                    
            leftController.setAttribute('laser-controls',{
                hand: 'left', 
                model: false,
            });

            leftController.setAttribute('hand-controls', {
                hand: 'left', 
                handModelStyle: 'lowPoly',
            });

            leftController.setAttribute('raycaster', {
                objects: '.interactive', 
                far: 20,
                interval: 30, 
                showLine: true, 
                useWorldCoordinates: true,
            });
            
            element.appendChild(leftController);

            // Right Controller interaction
            var rightController = document.createElement('a-entity');
            rightController.setAttribute('id', 'right-controller');

            rightController.setAttribute('laser-controls', { 
                hand: 'right', 
                model: false});

            rightController.setAttribute('hand-controls', {
                hand: 'right', 
                handModelStyle: 'lowPoly'});

            rightController.setAttribute('raycaster', {
                objects: '.interactive', 
                far: 20,
                interval: 30, 
                showLine: true, 
                useWorldCoordinates: true
            });

            element.appendChild(rightController);

            // Player height
            document.querySelector('a-scene').addEventListener('enter-vr', function() 
            {
                setTimeout(function() 
                {
                    this.playerHeight = element.querySelector('[camera]').getAttribute('position').y;
                    
                    // Emitting event that player is ready
                    element.emit('player-ready', {playerHeight: this.playerHeight}, false);

                }, 500);
            });
        }
    },

    update: function(oldData)
    {
        const element = this.el;
        const schema = this.data;
        
        // If player on desktop,
        //      If player can move, activating player-wasd component
        //      Otherwise, disabling it
        if (AFRAME.utils.device.checkHeadsetConnected() === false)
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
});