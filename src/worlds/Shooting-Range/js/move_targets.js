// Moves the front and back row targets

'user strict'

// Component
AFRAME.registerComponent('move_targets', 
{
    init : function() 
    {
        // Container that holds the target elements in the front row
        var frontRow = document.querySelector('#frontRow');
        var frontRowRight = true;

        // Container that holds the target elements in the back row
        var backRow = document.querySelector('#backRow');
        var backRowRight = false;

        /***************************************************************************************************************************************************************************/

        // Moving front row targets every millisecond
        setInterval(function()
        {
            if (frontRow.getAttribute('position')['z'] >= 2.5) 
            {
                frontRowRight = true;
            }
            else if (frontRow.getAttribute('position')['z'] <= -4.9)
            {
                frontRowRight = false;
            }

            if (frontRowRight === true)
            {
                frontRow.setAttribute('position', {
                    x: frontRow.getAttribute('position')['x'],
                    y: frontRow.getAttribute('position')['y'],
                    z: frontRow.getAttribute('position')['z'] - 0.005
                });
            }
            else
            {
                frontRow.setAttribute('position', {
                    x: frontRow.getAttribute('position')['x'],
                    y: frontRow.getAttribute('position')['y'],
                    z: frontRow.getAttribute('position')['z'] + 0.005
                });
            }

        }, 1);

        /***************************************************************************************************************************************************************************/

        // Moving back row targets every millisecond
        setInterval(function()
        {
            if (backRow.getAttribute('position')['z'] >= 2.6) 
            {
                backRowRight = true;
            }
            else if (backRow.getAttribute('position')['z'] <= -0.6)
            {
                backRowRight = false;
            }

            if (backRowRight === true)
            {
                backRow.setAttribute('position', {
                    x: backRow.getAttribute('position')['x'],
                    y: backRow.getAttribute('position')['y'],
                    z: backRow.getAttribute('position')['z'] - 0.01
                });
            }
            else
            {
                backRow.setAttribute('position', {
                    x: backRow.getAttribute('position')['x'],
                    y: backRow.getAttribute('position')['y'],
                    z: backRow.getAttribute('position')['z'] + 0.01
                });
            }

        }, 1);
    }
});