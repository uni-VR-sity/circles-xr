'user strict'

// Controls gameplay

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('game-manager', 
{
    init: function()
    {
        this.DESKTOP_CONSTANTS = {
            SCREEN_Z_POS: -6,

            STATS_CONTAINER: {
                POSITION: {x: -6, y: 0, z: -4.5},
                ROTATION: {x: 0, y: 20, z: 0},
            },

            ASTEROID_SPAWNER: {
                Z_POS: -40,
                SPAWN_RANGE: 2,
                MIN_SCALE: 0.25,
                MAX_SCALE: 1.0,
                MIN_SPEED: 0.04,
                MAX_SPEED: 0.13,
                MIN_SPAWN_RATE: 500,
                MAX_SPAWN_RATE: 1500,
                RATE_DECREASE: 100,
                RATE_INCREASE_INTERVAL: 2000,
            },
        }

        this.HEADSET_CONSTANTS = {
            SCREEN_Z_POS: -20,

            STATS_CONTAINER: {
                POSITION: {x: -5, y: 0, z: -15},
                ROTATION: {x: 0, y: 40, z: 0},
            },

            ASTEROID_SPAWNER: {
                Z_POS: -40,
                SPAWN_RANGE: 1,
                MIN_SCALE: 0.1,
                MAX_SCALE: 0.7,
                MIN_SPEED: 0.04,
                MAX_SPEED: 0.13,
                MIN_SPAWN_RATE: 700,
                MAX_SPAWN_RATE: 2000,
                RATE_DECREASE: 100,
                RATE_INCREASE_INTERVAL: 3000,
            },
        }

        //this.score;
        this.lives;
        this.playerHeight;
        //this.spawnerMinBounds;
        //this.spawnerMaxBounds;

        this.setUpGame = this.setUpGame.bind(this);
        this.playButton = this.playButton.bind(this);
        this.restartButton = this.restartButton.bind(this);

        this.GAME_CONSTANTS;

        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            this.GAME_CONSTANTS = this.HEADSET_CONSTANTS;
        }
        else
        {
            this.GAME_CONSTANTS = this.DESKTOP_CONSTANTS;
        }

        // Setting up event listeners for player to be ready to set up the game
        document.getElementById('player').addEventListener('player-ready', this.setUpGame);
    },

    // Setting up game with player information
    setUpGame: function(event)
    {
        // Getting player height
        this.playerHeight = event.detail.playerHeight;
        
        // Calculating asteroid spawner min and max bounds
        /*
        this.spawnerMinBounds = {
            x: -this.playerHeight * 2,
            y: this.playerHeight / 2,
            z: this.GAME_CONSTANTS.ASTEROID_SPAWNER.Z_POS,
        };

        this.spawnerMaxBounds = {
            x: this.playerHeight * 2,
            y: this.playerHeight * 3,
            z: this.GAME_CONSTANTS.ASTEROID_SPAWNER.Z_POS,
        };
        */

        // Position start and restart screen to match player height
        var screenPos = {
            x: 0,
            y: this.playerHeight,
            z: this.GAME_CONSTANTS.SCREEN_Z_POS,
        };

        document.getElementById('start-screen').setAttribute('position', screenPos);
        document.getElementById('restart-screen').setAttribute('position', screenPos);

        // Position game stats container (if on headset, base height on player height)
        var statsContainer = document.getElementById('game-stats-container');
        var statsPos = this.GAME_CONSTANTS.STATS_CONTAINER.POSITION;

        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            statsPos.y = this.playerHeight / 2;
        }

        statsContainer.setAttribute('position', statsPos);
        statsContainer.setAttribute('rotation', this.GAME_CONSTANTS.STATS_CONTAINER.ROTATION);

        // Removing player ready event listener
        document.getElementById('player').removeEventListener('player-ready', this.setUpGame);

        // Starting game
        document.getElementById('start-screen').setAttribute('visible', 'true');

        var button = document.getElementById('play-button');

        button.classList.add('interactive');
        button.addEventListener('click', this.playButton);
    },

    // Listening for play button press
    playButton: function(event)
    {
        // Hiding start screen
        document.getElementById('start-screen').setAttribute('visible', false);

        // Removing event listener from button
        var button = document.getElementById('play-button');

        button.classList.remove('interactive');
        button.removeEventListener('click', this.playButton);
    
        // Starting game
        this.playGame();
    },

    // Setting up and starting a new game
    playGame: function()
    {
        var player = document.getElementById('player');

        // Enabling player movement and hiding controllers
        player.setAttribute('player', {
            canMove: true,
            hasControllers: false,
        });

        // Resetting score container
        //document.getElementById('score').setAttribute('text', {
            //value: '0',
        //});

        // Resetting lives container
        var livesContainer = document.getElementById('lives-container');

        livesContainer.querySelector('#live-1').setAttribute('material', {
            color: 'red',
        });

        livesContainer.querySelector('#live-2').setAttribute('material', {
            color: 'red',
        });

        livesContainer.querySelector('#live-3').setAttribute('material', {
            color: 'red',
        });

        // Showing game stats container
        document.getElementById('game-stats-container').setAttribute('visible', true);

        // Resetting game variables
        //this.score = 0;
        this.lives = 3;

        // Attaching asteroid spawner
        document.getElementById('spawner').setAttribute('asteroid-spawner', {
            //minBounds: this.spawnerMinBounds,
            //maxBounds: this.spawnerMaxBounds,

            spawnLocation: {x: 0, y: 0, z: this.GAME_CONSTANTS.ASTEROID_SPAWNER.Z_POS},
            spawnRange: this.GAME_CONSTANTS.ASTEROID_SPAWNER.SPAWN_RANGE,

            minScale: this.GAME_CONSTANTS.ASTEROID_SPAWNER.MIN_SCALE,
            maxScale: this.GAME_CONSTANTS.ASTEROID_SPAWNER.MAX_SCALE,

            minSpeed: this.GAME_CONSTANTS.ASTEROID_SPAWNER.MIN_SPEED,
            maxSpeed: this.GAME_CONSTANTS.ASTEROID_SPAWNER.MAX_SPEED,

            minSpawnRate: this.GAME_CONSTANTS.ASTEROID_SPAWNER.MIN_SPAWN_RATE,
            maxSpawnRate: this.GAME_CONSTANTS.ASTEROID_SPAWNER.MAX_SPAWN_RATE,

            rateDecrease: this.GAME_CONSTANTS.ASTEROID_SPAWNER.RATE_DECREASE,
            rateIncreaseInterval: this.GAME_CONSTANTS.ASTEROID_SPAWNER.RATE_INCREASE_INTERVAL,
        });
    },

    // Stopping game
    gameOver: function()
    {
        // Hiding game stats container
        document.getElementById('game-stats-container').setAttribute('visible', false);

        // Removing asteroid spawner
        document.getElementById('spawner').removeAttribute('asteroid-spawner');

        // If on headset, showing controllers
        // If on desktop, setting player back to default position and disabling their movement
        var player = document.getElementById('player');

        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            player.setAttribute('player', {
                hasControllers: true,
            });
        }
        else
        {
            player.setAttribute('player', {
                canMove: false,
            });

            player.setAttribute('position', {
                x: 0,
                y: this.playerHeight,
                z: 0,
            });
        }

        // Restarting game
        document.getElementById('restart-screen').setAttribute('visible', true);
        
        //document.getElementById('final-score').setAttribute('text', {
            //value: 'Score: ' + this.score,
        //});

        var button = document.getElementById('restart-button');

        button.classList.add('interactive');
        button.addEventListener('click', this.restartButton);
    },

    restartButton: function(event)
    {
        // Hiding start screen
        document.getElementById('restart-screen').setAttribute('visible', false);

        // Removing event listener from button
        var button = document.getElementById('restart-button');

        button.classList.remove('interactive');
        document.getElementById('restart-button').removeEventListener('click', this.restartButton);
    
        // Starting game
        this.playGame();
    },

    // Decreasing player lives by 1
    hit: function()
    {
        // Vibrating controllers
        document.getElementById('player').components['player'].vibrateControllers();

        // Updating lives container
        document.querySelector('#live-' + this.lives).setAttribute('material', {
            color: 'grey',
        });

        this.lives -= 1;

        // If player has no lives left, game over
        if (this.lives == 0)
        {
            this.gameOver();
        }
    },

    // Increasing player score by 1
    increaseScore: function()
    {
        this.score++;

        document.getElementById('score').setAttribute('text', {
            value: this.score,
        });
    },
});