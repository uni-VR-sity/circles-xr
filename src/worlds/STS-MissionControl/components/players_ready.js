// Component for beginning the game
// Detects is players 1 and 2 have pressed their buttons to start the game

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('players_ready', 
{
    schema: 
    {
        // If player 1 is ready
        player1 : {type: 'boolean', default:false},

        // If player 2 is ready
        player2 : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Getting player 1 and 4 buttons
        var player1 = document.querySelector('#player1Ready');
        var player2 = document.querySelector('#player2Ready');

        // Getting player 1 and 2 ready texts
        var text1 = document.querySelector('#player1ReadyText');
        var text2 = document.querySelector('#player2ReadyText');

        // Player 1
        player1.addEventListener('click', function() 
        {
            // If player 1 was not ready before, make them ready
            if (CONTEXT_AF.data.player1 === false)
            {
                CONTEXT_AF.data.player1 = true;

                // Turning player 1 text green
                text1.setAttribute('text', {color: '#00FF00'});
            }
            // If player 1 was ready before, make them not ready
            else
            {
                CONTEXT_AF.data.player1 = false;

                // Turning player 1 text gray
                text1.setAttribute('text', {color: '#4a4a4a'});
            }
        });

        // Player 2
        player2.addEventListener('click', function() 
        {
            // If player 2 was not ready before, make them ready
            if (CONTEXT_AF.data.player2 === false)
            {
                CONTEXT_AF.data.player2 = true;

                // Turning player 2 text green
                text2.setAttribute('text', {color: '#00FF00'});
            }
            // If player 2 was ready before, make them not ready
            else
            {
                CONTEXT_AF.data.player2 = false;

                // Turning player 2 text gray
                text2.setAttribute('text', {color: '#4a4a4a'});
            }
        });
    }
});