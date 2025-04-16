// Component for task 11 for mission control
// Moves blue and purple waves and checks if they are aligned

'user strict'

// Functions ---------------------------------------------------------------------------------------------------------------

// Generating a random starting offset for the wave between 1 and 10
var generateOffset = function(wave)
{
    // Formula for generating a random numnber between a min and max from https://www.w3schools.com/js/js_random.asp
    var randomOffset = Math.random() * (10 - 1) + 1;

    // Making offset string
    var offsetString = randomOffset + " 0";

    // Moving wave
    wave.setAttribute('material', {
        offset: offsetString
    });
}

// --------------------------------------------------------

// Moving wave by 0.01
// Direction depends on variable: 1 = left, -1 = right
var moveWave = function(wave, direction)
{
    // Getting current offset of the wave
    var currentOffset = wave.getAttribute('material')['offset']['x'];
    
    // Calculating new offset
    var newOffset = currentOffset + (direction * 0.01);

    // Making offset string
    var offsetString = newOffset + " 0";

    // Moving wave
    wave.setAttribute('material', {
        offset: offsetString
    });
}

// --------------------------------------------------------

// Checks if the blue and purple waves are aligned
// Returns true if they are, otherwise returns false
var checkAlign = function(blueWave, purpleWave, waveSegment)
{
    // Getting wave offsets
    var blueOffset = blueWave.getAttribute('material')['offset']['x'];
    var purpleOffset = purpleWave.getAttribute('material')['offset']['x'];

    // Making sure offsets are positive
    if (blueOffset < 0)
    {
        blueOffset = blueOffset * -1;
    }

    if (purpleOffset < 0)
    {
        purpleOffset = purpleOffset * -1;
    }

    // Checking if waves are aligned (+- 0.01)
    // If the sum of the offests is a whole number, they are aligned

    var sum = blueOffset + purpleOffset;
    var modulo = sum % 1;

    if ((modulo >= 0) && (modulo <= 0 + 0.01))
    {
        return true;
    }
    else if ((modulo < 1) && (modulo >= 1 - 0.01))
    {
        return true;
    }

    return false;
}

// --------------------------------------------------------

// Change waves and buttons colours to indicate task completion
var turnCorrect = function(wave1, wave2, button1, button2)
{
    wave1.setAttribute('material', {color: '#00FF00'});
    wave2.setAttribute('material', {color: '#00FF00'});

    button1.setAttribute('circles-button', {button_color: '#cbfdc4', button_color_hover: '#cbfdc4'});
    button2.setAttribute('circles-button', {button_color: '#cbfdc4', button_color_hover: '#cbfdc4'});
}

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('align_waves', 
{
    schema: 
    {
        // If the waves are aligned and task is completed
        wavesAligned : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Getting waves
        var blueWave = document.querySelector('#blueFrame');
        var purpleWave = document.querySelector('#purpleFrame');

        // Getting wave segment length (photo length)
        var waveSegment = purpleWave.getAttribute('geometry')['width'] / 2;

        // Generating random starting offsets for the blue wave
        generateOffset(blueWave);

        // Getting buttons
        var blueButton = document.querySelector("#blueAlign");
        var purpleButton = document.querySelector("#purpleAlign");

        // If buttons are currently being held down
        var blueHold = false;
        var purpleHold = false;

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the buttons blue
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                blueButton.setAttribute('circles-button', {button_color: '#3d59a4', button_color_hover: '#384e8a'});
                purpleButton.setAttribute('circles-button', {button_color: '#8568aa', button_color_hover: '#6f5b8b'});

                clearInterval(taskActive);
            }

        }, 30);

        // Listening for blue button press
        blueButton.addEventListener('mousedown', function()
        {
            // If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.wavesAligned === false && blueHold === false)
            {
                // When button is held, move wave to the left every 30 milliseconds
                mouseBlueHold = setInterval(function() 
                {
                    moveWave(blueWave, 1);

                    blueHold = true;

                    // Listening for button release
                    blueButton.addEventListener('mouseup', function()
                    {
                        setTimeout(function() 
                        {
                            clearInterval(mouseBlueHold);

                            blueHold = false;

                            // Checking if waves are aligned, if buttons are not pressed, in 250 milliseconds
                            setTimeout(function() 
                            {   
                                if (blueHold === false && purpleHold === false)
                                {
                                    // If the waves are aligned
                                    // Indication task is complete by changing wave and button colour
                                    if (checkAlign(blueWave, purpleWave, waveSegment) === true)
                                    {
                                        CONTEXT_AF.data.wavesAligned = true;

                                        turnCorrect(blueWave, purpleWave, blueButton, purpleButton);
                                    }
                                }

                            }, 250);

                        }, 120);
                    });

                }, 30);
            }
        });

        // Listening for purple button press
        purpleButton.addEventListener('mousedown', function()
        {
            // If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.wavesAligned === false && purpleHold === false)
            {
                // When button is held, move wave to the left every 30 milliseconds
                mousePurpleHold = setInterval(function() 
                {
                    moveWave(purpleWave, -1);

                    purpleHold = true;

                    // Listening for button release
                    purpleButton.addEventListener('mouseup', function()
                    {
                        setTimeout(function() 
                        {
                            clearInterval(mousePurpleHold);

                            purpleHold = false;

                            // Checking if waves are aligned, if buttons are not pressed, in 250 milliseconds
                            setTimeout(function() 
                            {   
                                if (blueHold === false && purpleHold === false)
                                {
                                    // If the waves are aligned
                                    // Indication task is complete by changing wave and button colour
                                    if (checkAlign(blueWave, purpleWave, waveSegment) === true)
                                    {
                                        CONTEXT_AF.data.wavesAligned = true;

                                        turnCorrect(blueWave, purpleWave, blueButton, purpleButton);
                                    }
                                }

                            }, 250);

                        }, 120);
                    });

                }, 30);
            }
        });
    }
});