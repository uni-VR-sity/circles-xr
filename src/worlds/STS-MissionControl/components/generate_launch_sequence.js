// Component for task 4 for mission control
// Generates a random 6 digit code and displays it to the user

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('generate_launch_sequence', 
{
    schema: 
    {
        // Launch sequence
        sequence : {type: 'array', default:[0, 0, 0, 0, 0, 0]},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Generating 6 random digits, each between 0 and 9, and displaying it to the user
        var sequenceDisplay = document.querySelector('#launchSequence').children;

        for (let i = 0; i < 6; i++)
        {
            CONTEXT_AF.data.sequence[i] = Math.floor(Math.random() * 10);

            sequenceDisplay[i].setAttribute('text', {value: CONTEXT_AF.data.sequence[i]});
        }
    }
});