// Component for task 9 for spaceship
// Turn dial when button is pressed

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('turn_dial', 
{
    schema: 
    {
        // If dial is aligned with the sun
        isAligned : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // If the button is currently being held down
        var buttonHold = false;

        // Getting button
        var button = document.querySelector('#spin');

        // Getting dial container
        var dial = document.querySelector('#dialContainer');

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the button yellow
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                button.setAttribute('circles-button', {button_color: '#fbff00', button_color_hover: '#bdb600'});

                clearInterval(taskActive);
            }

        }, 30);

        // Listening for button click
        // Turning button when clicked
        button.addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isAligned === false)
            {
                currentRotation = dial.getAttribute('rotation')['y'];

                dial.setAttribute('rotation', {y: currentRotation - 1});

                console.log(currentRotation);
            }
        });

        // Listening for button press
        button.addEventListener('mousedown', function()
        {
            //  If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isAligned === false)
            {
                // When button is held, rotation dial every 30 milliseconds
                mouseHold = setInterval(function() 
                {
                    currentRotation = dial.getAttribute('rotation')['y'];

                    dial.setAttribute('rotation', {y: currentRotation - 1});

                    buttonHold = true;

                    // Listening for button release
                    button.addEventListener('mouseup', function()
                    {
                        setTimeout(function() 
                        {
                            clearInterval(mouseHold);

                            buttonHold = false;
                            
                        }, 20);
                    });

                }, 5);
            }
        });
    }
});