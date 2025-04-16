// Component for task 6 for mission control
// Players 1 and 2 must press the buttons at the same time

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('initiate_launch', 
{
    schema: 
    {
        // If launch has been initiated and countdown is complete
        launched : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Getting countdown text
        var countdownText = document.querySelector('#countdown');
        var instructions = document.querySelector('#launchInstructions');

        // Getting player 1 and 2 buttons
        var player1 = document.querySelector('#player1LaunchButton');
        var player2 = document.querySelector('#player2LaunchButton');

        // Getting player 1 and 2 ready texts
        var ready1 = document.querySelector('#player1Initiate');
        var ready2 = document.querySelector('#player2Initiate');

        // Checking if the previous task is complete and it is this task's turn to run
        // When it is, turn the buttons blue
        var taskActive = setInterval(function() 
        {
            if (CONTEXT_AF.data.isPrevComplete === true)
            {
                player1.setAttribute('circles-button', {button_color: '#9da8fb', button_color_hover: '#757eff'});
                player2.setAttribute('circles-button', {button_color: '#9da8fb', button_color_hover: '#757eff'});

                clearInterval(taskActive);
            }

        }, 30);

        // Listening for player 1 and 2 button clicks
        var player1Ready = false;
        var player2Ready = false;

        var player1Timer;
        var player2Timer;

        // Player 1
        player1.addEventListener('click', function() 
        {
            // If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.launched === false)
            {
                player1Ready = true;

                // Turning player 1 text green
                ready1.setAttribute('text', {color: '#00FF00'});

                // Players have +-1/2 a second to press the buttons together
                player1Timer = setTimeout(function() 
                {
                    player1Ready = false;

                    // Turning player 1 screen back to gray
                    ready1.setAttribute('text', {color: '#6e6e6e'});

                }, 500);
            }
        });

        // Player 2
        player2.addEventListener('click', function() 
        {
            // If the previous task is complete
            // And if task has not been completed
            if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.launched === false)
            {
                player2Ready = true;

                // Turning player 2 screen green
                ready2.setAttribute('text', {color: '#00FF00'});

                // Players have +-1/2 a second to press the buttons together
                player2Timer = setTimeout(function() 
                {
                    player2Ready = false;

                    // Turning player 2 screen back to gray
                    ready2.setAttribute('text', {color: '#6e6e6e'});

                }, 500);
            }
        });

        // Checking if the players have pressed the buttons together 50 milliseconds
        var checkReady = setInterval(function() 
        {
            if (player1Ready === true && player2Ready === true)
            {
                CONTEXT_AF.data.launched = true;

                // Clearning timers so screens stay green
                clearTimeout(player1Timer);
                clearTimeout(player2Timer);

                clearInterval(checkReady);

                player1.setAttribute('circles-button', {button_color: '#cbfdc4', button_color_hover: '#cbfdc4'});
                player2.setAttribute('circles-button', {button_color: '#cbfdc4', button_color_hover: '#cbfdc4'});

                // Starting countdown in a second
                setTimeout(function() 
                {
                    var countdownNum = 10;

                    countdownText.setAttribute('visible', true);
                    instructions.setAttribute('visible', false);
                    ready2.setAttribute('visible', false);
                    ready1.setAttribute('visible', false);

                    countdown = setInterval(function() 
                    {
                        countdownNum -= 1;

                        countdownText.setAttribute('text', {value: countdownNum});

                        if (countdownNum === 0)
                        {
                            clearInterval(countdown);

                            countdownText.setAttribute('scale', {x: 10, y: 10, z: 10});

                            countdownText.setAttribute('text', {value: 'Launch\nSuccessful!'});
                        }

                    }, 50);

                }, 1000);
            }

        }, 50);
    }
});