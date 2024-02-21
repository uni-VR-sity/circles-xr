'user strict'

// Controls player behaviour

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('player', 
{
    schema: 
    {
        canMove: {type: 'boolean', default: true},
        maxCoordinates: {type: 'vec3'},
        minCoordinates: {type: 'vec3'},
    },

    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;
    },

    update: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // If playing on desktop,
        // If player can move, set movement component to be active
        // Otherwise deactivate it
        if (AFRAME.utils.device.checkHeadsetConnected() === false)
        {
            if (schema.canMove)
            {
                element.setAttribute('player-wasd', {
                    active: true,
                    maxCoordinates: schema.maxCoordinates,
                    minCoordinates: schema.minCoordinates,
                });
            }
            else
            {
                element.setAttribute('player-wasd', {
                    active: false,
                });
            }
        }
    },
});