// Component for task 7 for mission control
// Bars go left and right until the ideal values are reached for the position, velocity, and altitude
// Top set of buttons control position and velocity
// Middle set of buttons control velocity
// Bottom set of buttons control altitude and velocity

'user strict'

// Functions ---------------------------------------------------------------------------------------------------------------

// Calculates and creates bar object to indicate the ideal amount
// Takes the ideal amount as a percent and the screen
var createIdealBar = function(idealAmount, screen)
{
    // Getting screen height and width
    var screenHeight = screen.getAttribute('geometry')['height'];
    var screenWidth = screen.getAttribute('geometry')['width'];

    // Calculating the position of the bar on the screen depending on the ideal amount
    // Position is between -(screenHeight / 2) and (screenHeight / 2)
    var decimal = idealAmount / 100;

    var percentOfScreen = decimal * screenWidth;

    var barPos = -(screenWidth / 2) + percentOfScreen;
    
    // Creating bar object
    var bar = document.createElement('a-entity');

    bar.setAttribute('position', {
        x: barPos,
        y: 0,
        z: 0.01
    });

    bar.setAttribute('geometry', {
        primitive: 'plane',
        height: screenHeight,
        width: 0.05
    });

    bar.setAttribute('material', {
        color: '#000000'
    });

    screen.appendChild(bar);
}

// --------------------------------------------------------

// Increasing the bar
var rightButton = function(bar, screen)
{
    var screenWidth = screen.getAttribute('geometry')['width'];

    // Getting current width of bar
    var currentWidth = bar.getAttribute('geometry')['width'];

    // Making sure the bar does not go over the screen
    if ((currentWidth + 0.05) < screenWidth)
    {
        // Adding to bar
        bar.setAttribute('geometry', {width: currentWidth + 0.05});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: bar.getAttribute('position')['x'] + 0.025,
            y: bar.getAttribute('position')['y'],
            z: bar.getAttribute('position')['z'],
        });
    }
    else
    {
        bar.setAttribute('geometry', {width: screenWidth});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: screen.getAttribute('position')['x'],
            y: bar.getAttribute('position')['y'],
            z: bar.getAttribute('position')['z'],
        });
    }
}

// --------------------------------------------------------

// Decreasing the bar
var leftButton = function(bar, screen)
{
    var screenWidth = screen.getAttribute('geometry')['width'];

    // Getting current width of bar
    var currentWidth = bar.getAttribute('geometry')['width'];

    // Making sure the bar does not go into negatives
    if (currentWidth - 0.05 > 0)
    {
        // Subtracting from bar
        bar.setAttribute('geometry', {width: currentWidth - 0.05});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: bar.getAttribute('position')['x'] - 0.025,
            y: bar.getAttribute('position')['y'],
            z: bar.getAttribute('position')['z'],
        });
    }
    else
    {
        bar.setAttribute('geometry', {width: 0});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: screen.getAttribute('position')['x'] - screenWidth / 2,
            y: bar.getAttribute('position')['y'],
            z: bar.getAttribute('position')['z'],
        });
    }
}

// --------------------------------------------------------

// Checking if all bars have reached their ideal amount (+-2%)
var checkBars = function(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen)
{
    // Getting percent width the bars are at
    var positionPercent = (positionBar.getAttribute('geometry')['width'] / positionScreen.getAttribute('geometry')['width']) * 100;
    var velocityPercent = (velocityBar.getAttribute('geometry')['width'] / velocityScreen.getAttribute('geometry')['width']) * 100;
    var altitudePercent = (altitudeBar.getAttribute('geometry')['width'] / altitudeScreen.getAttribute('geometry')['width']) * 100;

    // Comparing the percents against the appropriate ideal amounts
    if (positionPercent < positionIdeal + 2)
    {
        if (velocityPercent < velocityIdeal + 2)
        {
            if (altitudePercent < altitudeIdeal + 2)
            {
                if (positionPercent > positionIdeal - 2)
                {
                    if (velocityPercent > velocityIdeal - 2)
                    {
                        if (altitudePercent > altitudeIdeal - 2)
                        {
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false;
}

// Turns all bars green to indicate task is complete
var greenBars = function(positionBar, velocityBar, altitudeBar)
{
    positionBar.setAttribute('material', {color: '#00FF00'});
    velocityBar.setAttribute('material', {color: '#00FF00'});
    altitudeBar.setAttribute('material', {color: '#00FF00'});
}

// Turns buttons back to gray
var buttonsOff = function(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight)
{
    topLeft.setAttribute('circles-button', {button_color: '#333239', button_color_hover: '#333239'});
    middleLeft.setAttribute('circles-button', {button_color: '#333239', button_color_hover: '#333239'});
    bottomLeft.setAttribute('circles-button', {button_color: '#333239', button_color_hover: '#333239'});

    topRight.setAttribute('circles-button', {button_color: '#333239', button_color_hover: '#333239'});
    middleRight.setAttribute('circles-button', {button_color: '#333239', button_color_hover: '#333239'});
    bottomRight.setAttribute('circles-button', {button_color: '#333239', button_color_hover: '#333239'});
}

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('levers', 
{
    schema: 
    {
        // If all the levers are at the ideal values
        isGood : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Getting a random ideal position, velocity, and altitude percent (between 20% and 80%)
        // Formula for generating a random number between a min and max from https://www.w3schools.com/js/js_random.asp
        var positionIdeal = Math.floor(Math.random() * (80 - 20) ) + 20;
        var velocityIdeal = Math.floor(Math.random() * (80 - 20) ) + 20;
        var altitudeIdeal = Math.floor(Math.random() * (80 - 20) ) + 20;

        // Getting screens for position, velocity, and altitude
        var positionScreen = document.querySelector('#positionScreen');
        var velocityScreen = document.querySelector('#velocityScreen');
        var altitudeScreen = document.querySelector('#altitudeScreen');

        // Getting indication bars for position, velocity, and altitude
        var positionBar = document.querySelector('#positionBar');
        var velocityBar = document.querySelector('#velocityBar');
        var altitudeBar = document.querySelector('#altitudeBar');

        // Getting top buttons
        var topLeft = document.querySelector('#topLeft');
        var topRight = document.querySelector('#topRight');

        // Getting middle buttons
        var middleLeft = document.querySelector('#middleLeft');
        var middleRight = document.querySelector('#middleRight');

        // Getting bottom buttons
        var bottomLeft = document.querySelector('#bottomLeft');
        var bottomRight = document.querySelector('#bottomRight');

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the buttons their appropriate colours
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                topLeft.setAttribute('circles-button', {button_color: '#be0404', button_color_hover: '#930101'});
                middleLeft.setAttribute('circles-button', {button_color: '#be0404', button_color_hover: '#930101'});
                bottomLeft.setAttribute('circles-button', {button_color: '#be0404', button_color_hover: '#930101'});

                topRight.setAttribute('circles-button', {button_color: '#04be29', button_color_hover: '#01931e'});
                middleRight.setAttribute('circles-button', {button_color: '#04be29', button_color_hover: '#01931e'});
                bottomRight.setAttribute('circles-button', {button_color: '#04be29', button_color_hover: '#01931e'});

                clearInterval(taskActive);
            }

        }, 30);

        // Creating a visual bar of the ideal position, velocity, and altitude amount and displaying it to the user
        createIdealBar(positionIdeal, positionScreen);
        createIdealBar(velocityIdeal, velocityScreen);
        createIdealBar(altitudeIdeal, altitudeScreen);

        // Listening for left or right button clicks on top row buttons
        topLeft.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                leftButton(positionBar, positionScreen);
                leftButton(velocityBar, velocityScreen);

                // Checking if all bars have reached the ideal amount
                // If they have, record that the task is complete
                if(checkBars(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    greenBars(positionBar, velocityBar, altitudeBar);
                    buttonsOff(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight);
                }
            }
        });

        topRight.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                rightButton(positionBar, positionScreen);
                rightButton(velocityBar, velocityScreen);

                // Checking if all bars have reached the ideal amount
                // If they have, record that the task is complete
                if(checkBars(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    greenBars(positionBar, velocityBar, altitudeBar);
                    buttonsOff(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight);
                }
            }
        });

        // Listening for left or right button clicks on middle row buttons
        middleLeft.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                leftButton(velocityBar, velocityScreen);

                // Checking if all bars have reached the ideal amount
                // If they have, record that the task is complete
                if(checkBars(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    greenBars(positionBar, velocityBar, altitudeBar);
                    buttonsOff(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight);
                }
            }
        });

        middleRight.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                rightButton(velocityBar, velocityScreen);

                // Checking if all bars have reached the ideal amount
                // If they have, record that the task is complete
                if(checkBars(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    greenBars(positionBar, velocityBar, altitudeBar);
                    buttonsOff(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight);
                }
            }
        });

        // Listening for left or right button clicks on bottom row buttons
        bottomLeft.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                leftButton(altitudeBar, altitudeScreen);
                leftButton(velocityBar, velocityScreen);

                // Checking if all bars have reached the ideal amount
                // If they have, record that the task is complete
                if(checkBars(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    greenBars(positionBar, velocityBar, altitudeBar);
                    buttonsOff(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight);
                }
            }
        });

        bottomRight.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                rightButton(altitudeBar, altitudeScreen);
                rightButton(velocityBar, velocityScreen);

                // Checking if all bars have reached the ideal amount
                // If they have, record that the task is complete
                if(checkBars(positionBar, positionIdeal, positionScreen, velocityBar, velocityIdeal, velocityScreen, altitudeBar, altitudeIdeal, altitudeScreen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    greenBars(positionBar, velocityBar, altitudeBar);
                    buttonsOff(topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight);
                }
            }
        });
    }
});