'user strict'

// Spawns asteroid entities

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Generates a random number between min and max (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function randomNum(min, max)
{
    return Math.random() * (max - min) + min;
}

function weightedRandomNum(min, max)
{
    weightedMin = randomNum(min, max / 3);

    return randomNum(weightedMin, max);
}

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('asteroid-spawner', 
{
    schema:
    {
        minBounds: {type: 'vec3'},
        maxBounds: {type: 'vec3'},
        despawnLocation: {type: 'vec3', default: {x: 0, y: 0, z: 2}},
        minScale: {type: 'number'},
        maxScale: {type: 'number'},
        minSpeed: {type: 'number'},
        maxSpeed: {type: 'number'},
        minSpawnRate: {type: 'int'},
        maxSpawnRate: {type: 'int'},
        rateDecrease: {type: 'int'},
        rateIncreaseInterval: {type: 'int'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.spawnerLoop = this.spawnerLoop.bind(this);
        this.increaseSpawnRate = this.increaseSpawnRate.bind(this);

        this.increaseRate = schema.rateIncreaseInterval;
        this.spawnRate = schema.maxSpawnRate;

        // Spawning the first asteroid
        this.spawnAsteroid();

        // Setting up the spawn loop
        this.spawningInterval = setInterval(this.spawnerLoop, this.spawnRate);

        // Setting up spawn rate increase loop
        this.increaseRateInterval = setInterval(this.increaseSpawnRate, this.increaseRate);
    },

    // Clearing interval and deleting all remaining asteroids when component is removed
    remove: function()
    {
        clearInterval(this.spawningInterval);
        clearInterval(this.increaseRateInterval);

        var asteroidContainer = document.getElementById('asteroid-container');

        while (asteroidContainer.lastChild)
        {
            asteroidContainer.removeChild(asteroidContainer.lastChild);
        }
    },

    // Increasing spawning rate
    increaseSpawnRate: function()
    {
        const element = this.el;
        const schema = this.data;

        // If the spawn rate isn't at the minimum
        // If it is, clearing the interval
        if (this.spawnRate > schema.minSpawnRate)
        {
            // Decreasing spawn rate
            this.spawnRate -= schema.rateDecrease;

            // Increasing increase rate
            this.increaseRate += (schema.rateDecrease * 5);

            // Clearing current loops
            clearInterval(this.spawningInterval);
            clearInterval(this.increaseRateInterval);

            // Setting up new spawning loop with new rate, and new spawn rate increase loop
            this.spawningInterval = setInterval(this.spawnerLoop, this.spawnRate);
            this.increaseRateInterval = setInterval(this.increaseSpawnRate, this.increaseRate);
        }
        else
        {
            clearInterval(this.increaseRateInterval);
        }
    },

    // Asteroid spawning loop
    spawnerLoop: function()
    {
        const element = this.el;
        const schema = this.data;

        // Spawning asteroid
        this.spawnAsteroid();
        this.numSpawned++;
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
        var scale = randomNum(schema.minScale, schema.maxScale);

        // Generating random start rotation
        var startRotation = {
            x: randomNum(0, 360),
            y: randomNum(0, 360),
            z: randomNum(0, 360),
        }

        // Generation random axes of rotation
        var rotationAxes = {
            x: 1,
            y: randomNum(0, 1),
            z: randomNum(0, 1),
        }

        // Generationg a random speed
        var speed = weightedRandomNum(schema.minSpeed, schema.maxSpeed);

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