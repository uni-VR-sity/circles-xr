'user strict'

// Controls player movement with WASD and arrow keys
// Movement based on https://github.com/aframevr/aframe/blob/master/src/components/wasd-controls.js

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('player-wasd', 
{
    schema: 
    {
        active: {type: 'boolean', default: true},
        acceleration: {type: 'number', default: 0.2},
        minBounds: {type: 'vec3'},
        maxBounds: {type: 'vec3'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.DELTA_TIME = 0.01;

        this.move = this.move.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);

        this.moveInterval;

        this.easing = 1.1;

        this.velocity = new THREE.Vector3();
        
        this.keyPressed = {
            left: false,
            right: false,
            up: false,
            down: false,
        }

        // Setting up movement keys if component is active
        if (schema.active)
        {
            this.setUpMovement();
        }
    },

    update: function (oldData)
    {
        const element = this.el;
        const schema = this.data;

        // If component has become active, listen for movement key input
        // Otherwise, disable movement key input
        if (schema.active && !oldData.active)
        {
            this.setUpMovement();
        }
        else if (!schema.active && oldData.active)
        {
            this.disableMovement();

            this.keyPressed.right = false;
            this.keyPressed.left = false;
            this.keyPressed.up = false;
            this.keyPressed.down = false;
        }
    },

    move: function()
    {
        const element = this.el;
        const schema = this.data;

        if (schema.active)
        {
            // Decelerating player movement
            var deceleration = Math.pow(1 / this.easing, this.DELTA_TIME * 40);

            this.velocity.x = this.velocity.x * deceleration;
            this.velocity.y = this.velocity.y * deceleration;

            // Adding acceleration to velocity if a key is pressed
            if (this.keyPressed.right)
            {
                this.velocity.x += schema.acceleration * this.DELTA_TIME;
            }
            
            if (this.keyPressed.left)
            {
                this.velocity.x -= schema.acceleration * this.DELTA_TIME;
            }

            if (this.keyPressed.up)
            {
                this.velocity.y += schema.acceleration * this.DELTA_TIME;
            }
            
            if (this.keyPressed.down)
            {
                this.velocity.y -= schema.acceleration * this.DELTA_TIME;
            }

            // Updating player position
            var oldPos = element.getAttribute('position');

            var newPos = {
                x: oldPos.x += this.velocity.x,
                y: oldPos.y += this.velocity.y,
                z: oldPos.z += this.velocity.z,
            };

            // Checking that player is within bounds
            if (newPos.x > schema.maxBounds.x)
            {
                newPos.x = schema.maxBounds.x;
            }
            else if (newPos.x < schema.minBounds.x)
            {
                newPos.x = schema.minBounds.x;
            }

            if (newPos.y > schema.maxBounds.y)
            {
                newPos.y = schema.maxBounds.y;
            }
            else if (newPos.y < schema.minBounds.y)
            {
                newPos.y = schema.minBounds.y;
            }

            element.setAttribute('position', {
                x: newPos.x,
                y: newPos.y,
                z: newPos.z,
            });
        }
    },

    // Setting up event listeners for WASD and arrow keys
    // Setting up movement loop
    setUpMovement: function()
    {
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);

        this.moveInterval = setInterval(this.move, this.DELTA_TIME * 1000);
    },

    // Removing event listeners for WASD and arrow keys
    // Clearing movement loop
    disableMovement: function()
    {
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);

        clearInterval(this.moveInterval);
    },

    // Checking what key is pressed
    // If it is a WASD or arrow key, marking the corresponding axis and direction of movement
    keyDown: function(event)
    {
        const element = this.el;
        const schema = this.data;

        if (schema.active)
        {
            if (event.code === 'KeyW' || event.code === 'ArrowUp')
            {
                this.keyPressed.up = true;
            }
            else if (event.code === 'KeyA' || event.code === 'ArrowLeft')
            {
                this.keyPressed.left = true;
            }
            else if (event.code === 'KeyS' || event.code === 'ArrowDown')
            {
                this.keyPressed.down = true;
            }
            else if (event.code === 'KeyD' || event.code === 'ArrowRight')
            {
                this.keyPressed.right = true;
            }
        }
    },

    // Checking what key was released
    // If it is a WASD or arrow key, marking the corresponding axis and direction of movement
    keyUp: function(event)
    {
        const element = this.el;
        const schema = this.data;

        if (schema.active)
        {
            if (event.code === 'KeyW' || event.code === 'ArrowUp')
            {
                this.keyPressed.up = false;
            }
            else if (event.code === 'KeyA' || event.code === 'ArrowLeft')
            {
                this.keyPressed.left = false;
            }
            else if (event.code === 'KeyS' || event.code === 'ArrowDown')
            {
                this.keyPressed.down = false;
            }
            else if (event.code === 'KeyD' || event.code === 'ArrowRight')
            {
                this.keyPressed.right = false;
            }
        }
    },
});