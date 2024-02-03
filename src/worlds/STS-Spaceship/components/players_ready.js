// Component for beginning the game
// Detects is players 3 and 4 have pressed their buttons to start the game

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('players_ready', 
{
    schema: 
    {
        // If player 3 is ready
        player3 : {type: 'boolean', default:false},

        // If player 4 is ready
        player4 : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Getting player 3 and 4 buttons
        var player3 = document.querySelector('#player3Ready');
        var player4 = document.querySelector('#player4Ready');

        // Getting player 1 and 2 ready texts
        var text3 = document.querySelector('#player3ReadyText');
        var text4 = document.querySelector('#player4ReadyText');

        // Player 3
        player3.addEventListener('click', function() 
        {
            // If player 3 was not ready before, make them ready
            if (CONTEXT_AF.data.player3 === false)
            {
                CONTEXT_AF.data.player3 = true;

                // Turning player 3 text green
                text3.setAttribute('text', {color: '#00FF00'});
            }
            // If player 3 was ready before, make them not ready
            else
            {
                CONTEXT_AF.data.player3 = false;

                // Turning player 3 text gray
                text3.setAttribute('text', {color: '#4a4a4a'});
            }
        });

        // Player 4
        player4.addEventListener('click', function() 
        {
            // If player 4 was not ready before, make them ready
            if (CONTEXT_AF.data.player4 === false)
            {
                CONTEXT_AF.data.player4 = true;

                // Turning player 4 text green
                text4.setAttribute('text', {color: '#00FF00'});
            }
            // If player 4 was ready before, make them not ready
            else
            {
                CONTEXT_AF.data.player4 = false;

                // Turning player 4 text gray
                text4.setAttribute('text', {color: '#4a4a4a'});
            }
        });
    }
});