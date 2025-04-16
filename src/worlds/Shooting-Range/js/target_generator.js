// Generates targets

'user strict'

// Functions

// Creates targets with specified parameters
createTarget = function(radius, intensity, zPos, ringInnerRad, ringOuterRad, middleRad)
{
    // Creating a target element and setting its attributes
    var target = document.createElement('a-entity');

    // Setting target appearance
    target.setAttribute('geometry', {
        primitive: 'circle',
        radius: radius
    });

    target.setAttribute('rotation', {
        x: 0,
        y: 90,
        z: 0
    });

    target.setAttribute('material', {
        emissive: '#fefe86',
        emissiveIntensity: intensity
    }); 

    // Setting target location
    target.setAttribute('position', {
        x: 0,
        y: 0,
        z: zPos
    });

    /***************************************************************************************************************************************************************************/

    // Creating a ring in the middle of the target
    var ring = document.createElement('a-entity');

    // Setting ring appearence
    ring.setAttribute('geometry', {
        primitive: 'ring',
        radiusInner: ringInnerRad,
        radiusOuter: ringOuterRad
    });

    ring.setAttribute('rotation', {
        x: 0,
        y: 0,
        z: 0
    });

    ring.setAttribute('material', {
        emissive: '#fefe86',
        emissiveIntensity: 5
    }); 

    // Setting ring location
    ring.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0.01
    });

    // Appending the ring to the target
    target.appendChild(ring);

    /***************************************************************************************************************************************************************************/

    // Creating a circle in the center of the target
    var circle = document.createElement('a-entity');

    // Setting circle appearence
    circle.setAttribute('geometry', {
        primitive: 'circle',
        radius: middleRad
    });

    circle.setAttribute('rotation', {
        x: 0,
        y: 0,
        z: 0
    });

    circle.setAttribute('material', {
        emissive: '#fefe86',
        emissiveIntensity: 5
    }); 

    // Setting circle location
    circle.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0.01
    });

    // Appending the circle to the target
    target.appendChild(circle);

    return target;
}

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('target_generator', 
{
    init : function() 
    {
        var zPos;

        // Getting container that holds the target elements in the front row and resets its initial position
        var frontRow = document.querySelector('#frontRow');
        frontRow.setAttribute('position', {
            x: 1.5,
            y: 1,
            z: 0
        });

        // Getting container that holds the target elements in the middle row and resets its initial position
        var middleRow = document.querySelector('#middleRow');
        middleRow.setAttribute('position', {
            x: -4,
            y: 1.5,
            z: 0
        });

        // Getting container that holds the target elements in the back row and resets its initial position
        var backRow = document.querySelector('#backRow');
        backRow.setAttribute('position', {
            x: -8,
            y: 2.5,
            z: 0
        });

        /***************************************************************************************************************************************************************************/

        // Generating 4 targets in the front row

        zPos = 4.2;

        for (let i = 0; i < 4; i++)
        {
            // Creating target element 
            // Parameters: radius, intensity, zPos, ringInnerRad, ringOuterRad, middleRad
            var target = createTarget(0.3, 0.6, zPos, 0.16, 0.21, 0.06);

            // Appending the target to the target front row container
            frontRow.appendChild(target);

            zPos -= 2;
        }

        /***************************************************************************************************************************************************************************/

        // Generating 4 targets in the middle row

        zPos = 4;

        for (let i = 0; i < 4; i++)
        {
            // Creating target element 
            // Parameters: radius, intensity, xPos, yPos, zPos, ringInnerRad, ringOuterRad, middleRad
            var target = createTarget(0.7, 0.3, zPos, 0.4, 0.5, 0.17);

            // Appending the target to the target front row container
            middleRow.appendChild(target);

            zPos -= 3;
        }

        /***************************************************************************************************************************************************************************/

        // Generating 6 targets in the middle row

        zPos = -6;

        for (let i = 0; i < 6; i++)
        {
            // Creating target element 
            // Parameters: radius, intensity, xPos, yPos, zPos, ringInnerRad, ringOuterRad, middleRad 
            var target = createTarget(0.4, 0.05, zPos, 0.2, 0.27, 0.07);

            // Appending the target to the target front row container
            backRow.appendChild(target);

            zPos += 2;
        }

        /***************************************************************************************************************************************************************************/

        // Adding attribute to move the front and back row targets horizontally
        var targetContainer = document.querySelector('#targets');
        targetContainer.setAttribute('move_targets', {});
    }

});

