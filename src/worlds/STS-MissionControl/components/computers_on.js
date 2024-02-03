// Component for task 1 for mission control
// Turns on computers from button click

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('computers_on', 
{
    schema: 
    {
        // If the computers are on and task is completed
        isOn : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the button pink
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                element.setAttribute('circles-button', {button_color: '#fb9dcf', button_color_hover: '#ff75bf'});

                clearInterval(taskActive);
            }

        }, 30);

        // Getting computer screens
        var computers = document.querySelectorAll('.computer');
        var numComputers = computers.length;

        // Listening for on button click 
        // When button is clicked, turn on computer screen
        element.addEventListener('click', function()
        {
            // If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isOn === false)
            {
                CONTEXT_AF.data.isOn = true;

                element.setAttribute('circles-button', {button_color: '#cbfdc4', button_color_hover: '#cbfdc4'});

                for (let i = 0; i < numComputers; i++)
                {
                    computers[i].setAttribute('material', {color: '#dadbf1'});
                }
            }
        });
    }
});