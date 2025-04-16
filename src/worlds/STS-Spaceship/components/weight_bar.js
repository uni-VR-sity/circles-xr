// Component for task 2 for spaceship
// Weight bar rises and falls until ideal amount is reached
// Weight bar can not be moved if task is complete

'user strict'

// Functions ---------------------------------------------------------------------------------------------------------------

// Calculates and creates bar object to indicate the ideal amount
// Takes the ideal amount as a percent and the screen
var placeIdealBar = function(idealAmount, screen)
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
        x: 0,
        y: barPos,
        z: 0.01
    });

    bar.setAttribute('geometry', {
        primitive: 'plane',
        height: 0.05,
        width: screenWidth
    });

    bar.setAttribute('material', {
        color: '#000000'
    });

    screen.appendChild(bar);
}

// --------------------------------------------------------

// Increasing the bar
var upButton = function(bar, screen)
{
    var screenHeight = screen.getAttribute('geometry')['height'];

    // Getting current height of bar
    var currentHeight = bar.getAttribute('geometry')['height'];

    // Making sure the bar does not go over the screen
    if ((currentHeight + 0.05) < screenHeight)
    {
        // Adding to bar
        bar.setAttribute('geometry', {height: currentHeight + 0.05});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: bar.getAttribute('position')['x'],
            y: bar.getAttribute('position')['y'] + 0.025,
            z: bar.getAttribute('position')['z'],
        });
    }
    else
    {
        bar.setAttribute('geometry', {height: screenHeight});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: bar.getAttribute('position')['x'],
            y: screen.getAttribute('position')['y'],
            z: bar.getAttribute('position')['z'],
        });
    }
}

// --------------------------------------------------------

// Decreasing the bar
var downButton = function(bar, screen)
{
    var screenHeight = screen.getAttribute('geometry')['height'];

    // Getting current height of bar
    var currentHeight = bar.getAttribute('geometry')['height'];

    // Making sure the bar does not go into negatives
    if (currentHeight - 0.05 > 0)
    {
        // Subtracting from bar
        bar.setAttribute('geometry', {height: currentHeight - 0.05});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: bar.getAttribute('position')['x'],
            y: bar.getAttribute('position')['y'] - 0.025,
            z: bar.getAttribute('position')['z'],
        });
    }
    else
    {
        bar.setAttribute('geometry', {height: 0});

        // Leveling out position of bar
        bar.setAttribute('position', {
            x: bar.getAttribute('position')['x'],
            y: screen.getAttribute('position')['y'] - screenHeight / 2,
            z: bar.getAttribute('position')['z'],
        });
    }
}

// --------------------------------------------------------

// Checking if all bars have reached their ideal amount (+-2%)
var checkWeight = function(idealAmount, bar, screen)
{
    // Getting percent height the bars are at
    var percentHeight = (bar.getAttribute('geometry')['height'] / screen.getAttribute('geometry')['height']) * 100;

    // Comparing the percents against the appropriate ideal amounts
    if (percentHeight < idealAmount + 2)
    {
        if (percentHeight > idealAmount - 2)
        {
            return true
        }
    }

    return false;
}

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('weight_bar', 
{
    schema: 
    {
        // If the weight bar is at the ideal value
        isGood : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Get a random ideal weight percent (between 20% and 100%)
        // Formula for generating a random number between a min and max from https://www.w3schools.com/js/js_random.asp
        var idealAmount = Math.floor(Math.random() * (80 - 20) ) + 20;

        // Getting screen
        var screen = document.querySelector('#weightScreen');

        console.log(screen);

        // Getting indication bar
        var weightBar = document.querySelector('#weightBar');

        // Getting top button
        var top = document.querySelector('#weightUp');

        // Getting bottom button
        var bottom = document.querySelector('#weightDown');

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the buttons their appropriate colours
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                top.setAttribute('circles-button', {button_color: '#04be29', button_color_hover: '#01931e'});
                bottom.setAttribute('circles-button', {button_color: '#be0404', button_color_hover: '#930101'});

                clearInterval(taskActive);
            }

        }, 30);

        // Creating a visual bar of the ideal position, velocity, and altitude amount and displaying it to the user
        placeIdealBar(idealAmount, screen);

        // Listening for top or bottom button
        top.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                upButton(weightBar, screen);

                // Checking if weight bars has reached the ideal amount
                // If it have, record that the task is complete
                if(checkWeight(idealAmount, weightBar, screen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    top.setAttribute('circles-button', {button_color: '#2b2c31', button_color_hover: '#2b2c31'});
                    bottom.setAttribute('circles-button', {button_color: '#2b2c31', button_color_hover: '#2b2c31'});
                }
            }
        });

        bottom.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isGood === false)
            {
                downButton(weightBar, screen);

                // Checking if weight bars has reached the ideal amount
                // If it have, record that the task is complete
                if(checkWeight(idealAmount, weightBar, screen) === true)
                {
                    CONTEXT_AF.data.isGood = true;

                    top.setAttribute('circles-button', {button_color: '#2b2c31', button_color_hover: '#2b2c31'});
                    bottom.setAttribute('circles-button', {button_color: '#2b2c31', button_color_hover: '#2b2c31'});
                }
            }
        });
    }
});