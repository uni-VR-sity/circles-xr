// Component for task 10 for spaceship
// Tank breaks off when button is clicked

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('break_tank', 
{
    schema: 
    {
        // If the fuel tank is broken off and task is completed
        isBrokenOff : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the button yellow
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                element.setAttribute('circles-button', {button_color: '#9dfba8', button_color_hover: '#9aff75'});

                clearInterval(taskActive);
            }

        }, 30);

        // Listening for on button click 
        // When button is clicked, break tank off
        element.addEventListener('click', function()
        {
            // If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isBrokenOff === false)
            {
                CONTEXT_AF.data.isBrokenOff = true;

                element.setAttribute('circles-button', {button_color: '#424243', button_color_hover: '#424243'});
            }
        });
    }
});