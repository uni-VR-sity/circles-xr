'user strict'

// Controls gameplay

// Functions ---------------------------------------------------------------------------------------------------------------------------------------

// Ending a game
function gameOver()
{

}

// ------------------------------------------------------------------------------------------

// Displaying the restart screen
function restartScreen()
{

}

// Component ---------------------------------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('game-manager', 
{
    init: function()
    {
        this.score;
        this.lives;
        this.playerHeight;
        this.spawnerMinBounds;
        this.spawnerMaxBounds;

        this.setUpGame = this.setUpGame.bind(this);
        this.playButton = this.playButton.bind(this);

        // Setting up event listeners for player to be ready to set up the game
        document.getElementById('player').addEventListener('player-ready', this.setUpGame);
    },

    // Setting up game with player information
    setUpGame: function(event)
    {
        // Getting player height
        var playerHeight = event.detail.playerHeight;
        
        // Calculating asteroid spawner min and max bounds
        this.spawnerMinBounds = {
            x: -playerHeight * 2,
            y: playerHeight / 2,
            z: -28,
        };

        this.spawnerMaxBounds = {
            x: playerHeight * 2,
            y: playerHeight * 3,
            z: -28,
        };

        // Position start and restart screen to match player height
        var screenPos = {
            x: 0,
            y: playerHeight,
            z: 0,
        };

        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            screenPos.z = -20;
        }
        else
        {
            screenPos.z = -6;
        }

        document.getElementById('start-screen').setAttribute('position', screenPos);
        document.getElementById('restart-screen').setAttribute('position', screenPos);

        // Removing player ready event listener
        document.getElementById('player').removeEventListener('player-ready', this.setUpGame);

        // Starting game
        document.getElementById('start-screen').setAttribute('visible', 'true');
        document.getElementById('play-button').addEventListener('click', this.playButton);
    },

    // Listening for play button press
    playButton: function(event)
    {
        // Hiding start screen
        document.getElementById('start-screen').setAttribute('visible', 'false');

        // Removing event listener from button
        document.getElementById('play-button').removeEventListener('click', this.playButton);
    
        // Starting game
        this.playGame();
    },

    // Setting up and starting a new game
    playGame: function()
    {
        // Enabling player movement
        document.getElementById('player').setAttribute('player', {
            canMove: true,
        });

        // Hiding controller rays (if on headset)
        if (AFRAME.utils.device.checkHeadsetConnected())
        {
            document.getElementById('left-controller').setAttribute('raycaster', { showLine: false, });
            document.getElementById('right-controller').setAttribute('raycaster', { showLine: false, });
        }

        this.score = 0;
        this.lives = 3;

        // Attaching asteroid spawner
        document.getElementById('spawner').setAttribute('asteroid-spawner', {
            minBounds: this.spawnerMinBounds,
            maxBounds: this.spawnerMaxBounds,
        });
    },

    // Decreasing player lives by 1
    hit: function()
    {
        this.lives -= 0
    },

    // Increasing player score by 1
    increaseScore: function()
    {
        points++;
    },
});