'user strict'

// Controls player behaviour

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('player', 
{
    schema: 
    {

    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.playerHeight = 10;

        // If player on desktop, setting up WASD and arrow keys for movement
        // Otherwise, waiting for user to enter vr and getting their height from the camera
        if (AFRAME.utils.device.checkHeadsetConnected() === false)
        {
            element.setAttribute('player-wasd', {
                maxCoordinate: {
                    x: this.playerHeight * 2, 
                    y: this.playerHeight * 2.5, 
                    z: 0
                },

                minCoordinate: {
                    x: -this.playerHeight * 2, 
                    y: this.playerHeight / 2, 
                    z: 0
                },
            });

            document.getElementById('spawner').setAttribute('geometry', {
                height: this.playerHeight * 2.5,
                width: this.playerHeight * 4,
            });

            document.getElementById('spawner').setAttribute('position', {
                x: 0,
                y: ((this.playerHeight * 2.5) / 2) + (this.playerHeight / 2),
                z: -28,
            });
        }
        else
        {
            document.querySelector('a-scene').addEventListener('enter-vr', function () 
            {
                setTimeout(function() 
                {
                    this.playerHeight = element.querySelector('[camera]').getAttribute('position').y;

                    document.getElementById('debugger').setAttribute('text', {
                        value: this.playerHeight,
                    });

                    document.getElementById('spawner').setAttribute('geometry', {
                        height: this.playerHeight * 2.5,
                        width: this.playerHeight * 4,
                    });

                    document.getElementById('spawner').setAttribute('position', {
                        x: 0,
                        y: ((this.playerHeight * 2.5) / 2) + (this.playerHeight / 2),
                        z: -28,
                    });

                }, 500);
             });
        }
    },

    // Returning player height
    getPlayerHeight: function()
    {
        return this.playerHeight;
    },
});