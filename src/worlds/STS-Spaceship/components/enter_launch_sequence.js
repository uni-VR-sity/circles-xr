// Component for task 4 for the spaceship
// Allows users to enter a code
// Compares the launch sequence with the user entered code and outputs when it matches

'user strict'

// Functions ---------------------------------------------------------------------------------------------------------------

// Checks if the user sequence matches the launch sequence
// If it does, return true, if it doesn't, return false
var checkSequence = function(userSequence, launchSequence)
{
    for (let i = 0; i < 6; i++)
    {
        if (userSequence[i] != launchSequence[i])
        {
            return false;
        }
    }

    return true;
}

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('enter_launch_sequence', 
{
    schema: 
    {
        // Launch sequence
        sequence : {type: 'array', default:[0, 0, 0, 0, 0, 0]},

        // If the launch sequence and the user entered sequence is a match
        isMatch : {type: 'boolean', default: false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // User entered sequence
        var userSequence = [];

        // Current position in the user sequence
        var sequencePos = 0;

        // Array of objects that display the code the user entered
        // The array holds the objects from left to right
        var sequenceDisplay = document.querySelector('#code').children;

        // Adding event listeners for clicks on the number pad
        // When a number is clicked, record it into the user sequence and display it to the user
        var numberPad = document.querySelector('#pad').children;

        // The number pad is 0 to 9 and the children of the "pad" object are in order
        // Therefore i is the value the specific pad holds
        for (let i = 0; i < 10; i++)
        {
            numberPad[i].addEventListener('click', function()
            {
                //  If the previous task is complete
                // And if task is not already complete and correct sequence has not been entered
                if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isMatch === false && sequencePos < 6)
                {
                    userSequence[sequencePos] = i;

                    sequenceDisplay[sequencePos].setAttribute('text', {value: i});

                    sequencePos += 1;

                    // Checking if the user sequence is full (has 6 digits)
                    // If it is, checking if the sequence matches the launch sequence
                    // If if does, record that the task is complete and display confirmation to the user
                    // If it doesn't display an error message and clear the user sequence
                    if (sequencePos === 6)
                    {
                        if (checkSequence(userSequence, CONTEXT_AF.data.sequence) === true)
                        {
                            CONTEXT_AF.data.isMatch = true;

                            document.querySelector('#dataRequest').setAttribute('circles-button', {button_color: '#2b2c31', button_color_hover: '#2b2c31'});
                        }
                        else
                        {
                            // Clearing the user sequence display in a second and a half
                            setTimeout(function() 
                            {
                                sequencePos = 0;

                                for (let i = 0; i < 6; i++)
                                {
                                    sequenceDisplay[i].setAttribute('text', {value: '', color: '#000000'});
                                }

                            }, 1500);
                        }
                        
                        // Changing colour of sequence display depending on if the user got it right or not
                        // Green = Correct
                        // Red = Incorrect
                        for (let i = 0; i < 6; i++)
                        {
                            if (CONTEXT_AF.data.isMatch === true)
                            {
                                sequenceDisplay[i].setAttribute('text', {color: '#04be29'});
                            }
                            else
                            {
                                sequenceDisplay[i].setAttribute('text', {color: '#be0404'});
                            }
                        }
                    }
                }
            });
        }

        // Adding event listeners for the backspace on the number pad (last child of the numberpad)
        // When clicked, removes the last digit in the sequence
        // Display gets updated for the user
        numberPad[10].addEventListener('click', function() 
        {
            //  If the previous task is complete
            // And if task is not already complete and correct sequence has not been entered
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isMatch === false && sequencePos < 6)
            {
                // Making sure there is a digit to remove
                if (sequencePos > 0)
                {
                    sequenceDisplay[sequencePos - 1].setAttribute('text', {value: ''});

                    sequencePos -= 1;
                }
            }
        });
    }
}); 