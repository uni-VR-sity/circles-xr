'user strict'

// Controls player movement with WASD and arrow keys
// Movement based on https://github.com/aframevr/aframe/blob/master/src/components/wasd-controls.js

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('player-wasd', 
{
    schema: 
    {
        acceleration: {type: 'number', default: 1.5},
        active: {type: 'boolean', default: true},
        maxCoordinates: {type: 'vec3'},
        minCoordinates: {type: 'vec3'},
    },

    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);

        this.easing = 1.1;

        this.velocity = new THREE.Vector3();
        this.xAxis = 0;
        this.yAxis = 0;
    },

    tick: function(time, deltaTime)
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        deltaTime /= 1000;

        // Decelerating player movement
        var deceleration = Math.pow(1 / this.easing, deltaTime * 60);
        this.velocity.x = this.velocity.x * deceleration;
        this.velocity.y = this.velocity.y * deceleration;

        // Adding acceleration to velocity if a key is pressed
        if (this.xAxis > 0)
        {
            this.velocity.x += schema.acceleration * deltaTime;
        }
        else if (this.xAxis < 0)
        {
            this.velocity.x -= schema.acceleration * deltaTime;
        }

        if (this.yAxis > 0)
        {
            this.velocity.y += schema.acceleration * deltaTime;
        }
        else if (this.yAxis < 0)
        {
            this.velocity.y -= schema.acceleration * deltaTime;
        }

        // Updating player position
        var oldPos = element.getAttribute('position');

        var newPos = {
            x: oldPos.x += this.velocity.x,
            y: oldPos.y += this.velocity.y,
            z: oldPos.z += this.velocity.z,
        };

        console.log(schema.maxCoordinates.x);

        // Checking that player is within bounds
        if (newPos.x > schema.maxCoordinates.x)
        {
            newPos.x = schema.maxCoordinates.x;
        }
        else if (newPos.x < schema.minCoordinates.x)
        {
            newPos.x = schema.minCoordinates.x;
        }

        if (newPos.y > schema.maxCoordinates.y)
        {
            newPos.y = schema.maxCoordinates.y;
        }
        else if (newPos.y < schema.minCoordinates.y)
        {
            newPos.y = schema.minCoordinates.y;
        }

        element.setAttribute('position', {
            x: newPos.x,
            y: newPos.y,
            z: newPos.z,
        });
    },

    update: function(oldData)
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;
        
        // If set to active, add player movement event listeners
        // Otherwise remove event listeners
        if (schema.active)
        {
            this.setUpEventListeners();
        }
        else
        {
            this.removeEventListeners();
        }
    },

    // Setting up event listeners for WASD and arrow keys
    setUpEventListeners: function()
    {
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    },

    // Removing event listeners for WASD and arrow keys
    removeEventListeners: function()
    {
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);
    },

    // Checking what key is pressed
    // If it is a WASD or arrow key, marking the corresponding axis and direction of movement
    keyDown: function(event)
    {
        if (event.code === 'KeyW' || event.code === 'ArrowUp')
        {
            this.yAxis = 1;
        }
        else if (event.code === 'KeyA' || event.code === 'ArrowLeft')
        {
            this.xAxis = -1;
        }
        else if (event.code === 'KeyS' || event.code === 'ArrowDown')
        {
            this.yAxis = -1;
        }
        else if (event.code === 'KeyD' || event.code === 'ArrowRight')
        {
            this.xAxis = 1;
        }
    },

    // Checking what key was released
    // If it is a WASD or arrow key, marking the corresponding axis and direction of movement
    keyUp: function(event)
    {
        if (event.code === 'KeyW' || event.code === 'ArrowUp')
        {
            this.yAxis = 0;
        }
        else if (event.code === 'KeyA' || event.code === 'ArrowLeft')
        {
            this.xAxis = 0;
        }
        else if (event.code === 'KeyS' || event.code === 'ArrowDown')
        {
            this.yAxis = 0;
        }
        else if (event.code === 'KeyD' || event.code === 'ArrowRight')
        {
            this.xAxis = 0;
        }
    },
});