'user strict'

// Sets up asteroid entity and controls its movement

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Setting up asteroid entity
function setUpAsteroid(asteroid, schema)
{
    // Model
    asteroid.setAttribute('geometry', {
        primitive: 'box',
        height: 1,
        width: 1,
    });

    // Position
    asteroid.setAttribute('position', {
        x: schema.startPos.x,
        y: schema.startPos.y,
        z: schema.startPos.z,
    });

    // Scale
    asteroid.setAttribute('scale', {
        x: schema.scale,
        y: schema.scale,
        z: schema.scale,
    });

    // Rotation
    asteroid.setAttribute('rotation', {
        x: schema.startRotation.x,
        y: schema.startRotation.y,
        z: schema.startRotation.z,
    });

    // Physics
    asteroid.setAttribute('static-body', {
        shape: 'cube',
    });

    asteroid.setAttribute('physics-collider', {});

    asteroid.setAttribute('collision-filter', {
        collidesWith: 'player',
    });
}

// ------------------------------------------------------------------------------------------

// Moving asteroid
// Returns new asteroid position
function moveAsteroid(asteroid, schema)
{
    // Getting asteroid's current position
    var currentPos = asteroid.getAttribute('position');

    // Moving asteroid forward by specified speed
    var newPos = {
        x: currentPos.x,
        y: currentPos.y,
        z: currentPos.z + schema.speed,
    }

    asteroid.setAttribute('position', {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
    });

    // Getting asteroid's current rotation
    var currentRotation = asteroid.getAttribute('rotation');

    // Rotating asteroid along specified axes by specified speed
    var newRotation = {
        x: currentRotation.x,
        y: currentRotation.y,
        z: currentRotation.z,
    }

    if (schema.rotationAxes.x === 1)
    {
        newRotation.x += (schema.speed * 10);
    }
    
    if (schema.rotationAxes.y === 1)
    {
        newRotation.y += (schema.speed * 10);
    }

    if (schema.rotationAxes.z === 1)
    {
        newRotation.z += (schema.speed * 10);
    }

    asteroid.setAttribute('rotation', {
        x: newRotation.x,
        y: newRotation.y,
        z: newRotation.z,
    });

    return newPos;
}

// ------------------------------------------------------------------------------------------

// Checking if asteroid is at the end point
// If it is, delete asteroid and, if the asteroid has not hit the player, increase player score
function checkPosition(position, asteroid, schema, playerHit)
{
    if (position.z >= schema.endPos.z)
    {
        // Deleting asteroid
        asteroid.parentNode.removeChild(asteroid);

        // Checking if asteroid hit player
        if (!playerHit)
        {
            // Getting game manager and increasing player score
            document.querySelector('#game-manager').components['game-manager'].increaseScore();
        }
    }
}

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('asteroid', 
{
    schema: 
    {
        startPos: {type: 'vec3'},
        endPos: {type: 'vec3'},
        model: {},
        scale: {type: 'number'},
        startRotation: {type: 'vec3'},
        rotationAxes: {type: 'vec3'},
        speed: {type: 'number'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.move = this.move.bind(this);

        // Keeping track if asteroid hits player
        this.playerHit = false;

        // Setting up enitity with model, position, scale, rotation, and physics
        setUpAsteroid(element, schema);

        // Listening for collision with player 
        // If there is a collision, decreasing player lives
        element.addEventListener('collisions', function(event)
        {
            if (event.detail.els.length > 0)
            {
                document.querySelector('#game-manager').components['game-manager'].hit();

                this.playerHit = true;
            }
        });

        // Moving asteroid every 10 millisecond
        this.movingInterval = setInterval(this.move, 10);
    },

    remove: function()
    {
        clearInterval(this.movingInterval);
    },

    move: function()
    {
        const element = this.el;
        const schema = this.data;

        // Moving asteroid
        var asteroidPos = moveAsteroid(element, schema);

        // Checking if asteroid is at the end point
        checkPosition(asteroidPos, element, schema, this.playerHit);
    },
});