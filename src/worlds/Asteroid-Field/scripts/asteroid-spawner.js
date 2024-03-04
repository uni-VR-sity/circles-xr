'user strict'

// Spawns asteroid entities

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Generates a random number between min and max (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function randomNum(min, max)
{
    return Math.random() * (max - min) + min;
}

// ------------------------------------------------------------------------------------------

// Generating a random number that is more likely to be higher
function weightedHighRandomNum(min, max)
{
    weightedMin = randomNum(min, max / 3);

    return randomNum(weightedMin, max);
}

// ------------------------------------------------------------------------------------------

// Generating a random number that is more likely to be in the middle
function weightedMidRandomNum(min, max)
{
    weightedMin = randomNum(min, max / 2);
    weightedMax = randomNum(min / 2, max);

    return randomNum(weightedMin, weightedMax);
}

// ------------------------------------------------------------------------------------------

// Calculating spawning bounds depending on where the player is
function getSpawningBounds(distanceFromPlayer, z)
{
    // Getting players current position
    var playerPos = document.getElementById('player').components['player'].getPlayerPosition();

    var spawningBounds = {

        min: {
            x: playerPos.x - distanceFromPlayer,
            y: playerPos.y - distanceFromPlayer,
            z: z,
        },

        max: {
            x: playerPos.x + distanceFromPlayer,
            y: playerPos.y + distanceFromPlayer,
            z: z,
        },
    }

    return spawningBounds;
}

// ------------------------------------------------------------------------------------------

// Generating a random starting position and making sure it is not similar to the past 3 spawns
function generateStartPos(spawningBounds, pastSpawns)
{
    var startPos = null;

    while (!startPos)
    {
        var pos = {
            x: weightedMidRandomNum(spawningBounds.min.x, spawningBounds.max.x),
            y: weightedMidRandomNum(spawningBounds.min.y, spawningBounds.max.y),
            z: weightedMidRandomNum(spawningBounds.min.z, spawningBounds.max.z),
        }

        var valid = {
            x: false,
            y: false,
        }

        for (var i = 0; i < pastSpawns.length; i++)
        {
            if (pos.x < (pastSpawns[i].x - 0.5) || pos.x > (pastSpawns[i].x + 0.5))
            {
                valid.x = true;
            }

            if (pos.y < (pastSpawns[i].y - 0.5) || pos.y > (pastSpawns[i].y + 0.5))
            {
                valid.y = true;
            }
        }

        if (valid.x && valid.y)
        {
            startPos = pos;
        }
    }

    return startPos;
}

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('asteroid-spawner', 
{
    schema:
    {
        //minBounds: {type: 'vec3'},
        //maxBounds: {type: 'vec3'},
        spawnLocation: {type: 'vec3'},
        spawnRange: {type: 'number'},
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

        this.pastSpawns = [{x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}];

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

        // Generating random position in range of the player
        var spawningBounds = getSpawningBounds(schema.spawnRange, schema.spawnLocation.z);
        var startPos = generateStartPos(spawningBounds, this.pastSpawns);

        // Saving start position
        this.pastSpawns.shift();
        this.pastSpawns.push(startPos);

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
        var speed = weightedHighRandomNum(schema.minSpeed, schema.maxSpeed);

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