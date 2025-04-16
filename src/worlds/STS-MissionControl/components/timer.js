// Timer for winning and losing state

'user strict'

// Converts seconds to minutes and updates the timer text
var convertToMinutes = function(time, timerText)
{
    var seconds = time % 60;

    var minutes = Math.floor(time / 60);

    if (seconds >= 10)
    {
        var timeString = '0' + minutes + ':' + seconds;
    }
    else
    {
        var timeString = '0' + minutes + ':0' + seconds;
    }

    timerText.setAttribute('text', {value: timeString});
}

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('timer', 
{
    schema: 
    {
        // Start new timer
        start : {type: 'boolean', default:false},

        // Time to countdown from in seconds
        time : {type: 'int', default:300},

        // If time is up
        timeUp : {type: 'boolean', default: false},

        // If timer should be cleared
        clearTimer : {type: 'boolean', default: false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        var currentTime;

        var timerRunning = false;

        // Getting timer text to update
        var timerText = document.querySelector('#timer');

        // Checking if a new timer is started
        // If is it (and a timer is not currently running), start the countdown
        checkStart = setInterval(function() 
        {
            if (CONTEXT_AF.data.start === true && timerRunning === false)
            {
                timerRunning = true;

                // Restarting variables
                CONTEXT_AF.data.timeUp = false;
                CONTEXT_AF.data.clearTimer = false;
                currentTime = CONTEXT_AF.data.time;

                convertToMinutes(currentTime, timerText);

                // Starting countdown
                var countdown = setInterval(function() 
                {
                    // Checking if timer should be cleared
                    if (CONTEXT_AF.data.clearTimer === true)
                    {
                        clearInterval(countdown);
                        CONTEXT_AF.data.timeUp = true;
                        CONTEXT_AF.data.start = false;
                        CONTEXT_AF.data.clearTimer = false;
                        timerRunning = false;
                    }
                    else
                    {
                        currentTime -= 1;
                        convertToMinutes(currentTime, timerText);

                        // Checking if countdown is up
                        if (currentTime === 0)
                        {
                            clearInterval(countdown);
                            CONTEXT_AF.data.timeUp = true;
                            CONTEXT_AF.data.start = false;
                            timerRunning = false;
                        }
                    }

                }, 1000);
            }

        }, 30);
    }
});