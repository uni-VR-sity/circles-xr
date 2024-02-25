'user strict'

// Spawns asteroid entities

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Generates a random number between min and max (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function randomNum(min, max)
{
    return Math.random() * (max - min) + min;
}

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('asteroid-spawner', 
{
    schema:
    {
        minBounds: {type: 'vec3'},
        maxBounds: {type: 'vec3'},
        despawnLocation: {type: 'vec3', default: {x: 0, y: 0, z: 2}},
        minScale: {type: 'number', default: 1},
        maxScale: {type: 'number', default: 5},
        minSpeed: {type: 'number', default: 0.01},
        maxSpeed: {type: 'number', default: 0.08},
        minSpawnRate: {type: 'int', default: 250},
        maxSpawnRate: {type: 'int', default: 3000},
        rateIncreaseInterval: {type: 'int', default: 3},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.spawnerLoop = this.spawnerLoop.bind(this);

        this.numSpawned = 0;
        this.nextIntervalIncrease = schema.rateIncreaseInterval;
        this.spawnRate = schema.maxSpawnRate;

        // Spawning the first asteroid
        this.spawnAsteroid();
        this.numSpawned++;

        // Setting up the spawn loop
        this.spawningInterval = setInterval(this.spawnerLoop, this.spawnRate);
    },

    // Asteroid spawning loop
    spawnerLoop: function()
    {
        const element = this.el;
        const schema = this.data;

        // Spawning asteroid
        this.spawnAsteroid();
        this.numSpawned++;

        // If the number of asteroids spawned is at the next interval increase
        if (this.numSpawned == this.nextIntervalIncrease)
        {
            // If the spawn rate isn't at the minimum
            // Decrease the spawn rate, set the next interval increase, clear the current spawn interval, and set a new one at the new spawn rate
            if (this.spawnRate != schema.minSpawnRate)
            {
                this.spawnRate -= 250;

                this.nextIntervalIncrease += schema.rateIncreaseInterval;

                clearInterval(this.spawningInterval);

                this.spawningInterval = setInterval(this.spawnerLoop, this.spawnRate);
            }
        }
    },

    // Spawning an asteroid
    spawnAsteroid: function()
    {
        const element = this.el;
        const schema = this.data;

        // Generating random position between min and max bounds
        var startPos = {
            x: randomNum(schema.minBounds.x, schema.maxBounds.x),
            y: randomNum(schema.minBounds.y, schema.maxBounds.y),
            z: randomNum(schema.minBounds.z, schema.maxBounds.z),
        }

        // Generating random scale between min and max bounds
        var scale = {
            x: randomNum(schema.minScale.x, schema.maxScale.x),
            y: randomNum(schema.minScale.y, schema.maxScale.y),
            z: randomNum(schema.minScale.z, schema.maxScale.z),
        }

        // Generating random start rotation
        var startRotation = {
            x: randomNum(0, 360),
            y: randomNum(0, 360),
            z: randomNum(0, 360),
        }

        // Generation random axes of rotation
        var rotationAxes = {
            x: randomNum(0, 1),
            y: randomNum(0, 1),
            z: randomNum(0, 1),
        }

        // Generationg a random speed
        var speed = randomNum(schema.minSpeed, schema.maxSpeed);

        // Creating new asteroid
        var asteroid = document.createElement('a-entity');

        asteroid.setAttribute('asteroid', {
            startPos: startPos,
            endPos: schema.despawnLocation,
            scale: scale,
            startRotation: startRotation,
            rotationAxes: rotationAxes,
            speed: speed
        });

        document.getElementById('asteroid-container').appendChild(asteroid);
    },
});