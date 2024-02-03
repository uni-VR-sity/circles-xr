// Detects bullet collisions with targets and walls

'user strict'

// Functions

// Checks if the bullet has collided with the walls, floor, or ceiling
// Return true if it has, false otherwise
wallCollide = function(bullet)
{
    var height;
    var width;

    // All wall values are world position thus can be compared directly

    // Getting current bullet position
    const bulletX = bullet.getAttribute('position')['x'];
    const bulletY = bullet.getAttribute('position')['y'];
    const bulletZ = bullet.getAttribute('position')['z'];

    // Checking collision with floor
    const floor = document.querySelector('#floor');

    // Checking if the bullet is at the same height as the floor (with 0.05 leniency)
    if ((bulletY < (floor.getAttribute('position')['y'] + 0.05)) && (bulletY > (floor.getAttribute('position')['y'] - 0.05)))
    {
        // Getting floor height and width
        height = floor.getAttribute('geometry')['height'];
        width = floor.getAttribute('geometry')['width'];

        // Checking if the bullet is within the height values of the floor
        if ((bulletX < (floor.getAttribute('position')['x'] + width)) && (bulletX > (floor.getAttribute('position')['x'] - width)))
        {
            // Checking if the bullet is within the width values of the floor
            if ((bulletZ < (floor.getAttribute('position')['z'] + height)) && (bulletZ > (floor.getAttribute('position')['z'] - height)))
            {
                // If reached here, that means the bullet is collided with the floor and return true
                return true;
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // Checking collision with ceiling
    const ceiling = document.querySelector('#ceiling');

    // Checking if the bullet is at the same height as the ceiling (with 0.05 leniency)
    if ((bulletY < (ceiling.getAttribute('position')['y'] + 0.05)) && (bulletY > (ceiling.getAttribute('position')['y'] - 0.05)))
    {
        // Getting floor height and width
        height = ceiling.getAttribute('geometry')['height'];
        width = ceiling.getAttribute('geometry')['width'];

        // Checking if the bullet is within the height values of the ceiling
        if ((bulletX < (ceiling.getAttribute('position')['x'] + width)) && (bulletX > (ceiling.getAttribute('position')['x'] - width)))
        {
            // Checking if the bullet is within the width values of the ceiling
            if ((bulletZ < (ceiling.getAttribute('position')['z'] + height)) && (bulletZ > (ceiling.getAttribute('position')['z'] - height)))
            {
                // If reached here, that means the bullet is collided with the ceiling and return true
                return true;
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // Checking collision with the walls on the x axis
    const xWalls = document.querySelectorAll('.xWall');

    // Checking each wall
    for (let i = 0; i < xWalls.length; i++)
    {
        // Checking if the bullet is at the same x value as the wall (with 0.05 leniency)
        if ((bulletX < (xWalls[i].getAttribute('position')['x'] + 0.05)) && (bulletX > (xWalls[i].getAttribute('position')['x'] - 0.05)))
        {
            // Getting the wall height and width
            height = xWalls[i].getAttribute('geometry')['height'];
            width = xWalls[i].getAttribute('geometry')['width'];

            // Checking if the bullet is within the height values of the wall
            if ((bulletY < (xWalls[i].getAttribute('position')['y'] + width)) && (bulletY > (xWalls[i].getAttribute('position')['y'] - width)))
            {
                // Checking if the bullet is within the width values of the wall
                if ((bulletZ < (xWalls[i].getAttribute('position')['z'] + height)) && (bulletZ > (xWalls[i].getAttribute('position')['z'] - height)))
                {
                    // If reached here, that means the bullet is collided with the wall and return true
                    return true;
                }
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // Checking collision with the walls on the z axis
    const zWalls = document.querySelectorAll('.zWall');

    // Checking each wall
    for (let i = 0; i < xWalls.length; i++)
    {
        // Checking if the bullet is at the same x value as the wall (with 0.05 leniency)
        if ((bulletZ < (zWalls[i].getAttribute('position')['z'] + 0.05)) && (bulletZ > (zWalls[i].getAttribute('position')['z'] - 0.05)))
        {
            // Getting the wall height and width
            height = zWalls[i].getAttribute('geometry')['height'];
            width = zWalls[i].getAttribute('geometry')['width'];

            // Checking if the bullet is within the height values of the wall
            if ((bulletY < (zWalls[i].getAttribute('position')['y'] + width)) && (bulletY > (zWalls[i].getAttribute('position')['y'] - width)))
            {
                // Checking if the bullet is within the width values of the wall
                if ((bulletX < (zWalls[i].getAttribute('position')['x'] + height)) && (bulletX > (zWalls[i].getAttribute('position')['x'] - height)))
                {
                    // If reached here, that means the bullet is collided with the wall and return true
                    return true;
                }
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // If reached here, that means the bullet has not collided with any walls and return false
    return false;
};

/***************************************************************************************************************************************************************************/

// Checks if the bullet has collided with a target
// Return true if it has, false otherwise
targetCollide = function(bullet)
{
    var numTargets;
    var radius;
    var currentZ;

    // Getting current bullet position
    const bulletX = bullet.getAttribute('position')['x'];
    const bulletY = bullet.getAttribute('position')['y'];
    const bulletZ = bullet.getAttribute('position')['z'];

    // Checking if the bullet hit any targets in the front row

    // Getting front row targets
    const frontRowContainer = document.querySelector('#frontRow');
    const frontRowTargets = frontRow.children;
    numTargets = frontRowTargets.length;

    // If there are targets to check
    if (numTargets > 0)
    {
        // Checking if the bullet is at the same x value as the front row (with 0.05 leniency)
        if ((bulletX < (frontRowContainer.getAttribute('position')['x'] + 0.05)) && (bulletX > (frontRowContainer.getAttribute('position')['x'] - 0.05)))
        {
            radius = frontRowTargets[0].getAttribute('geometry')['radius'];

            // Checking if the bullet is at the same y value as the front row 
            if (bulletY < (frontRowContainer.getAttribute('position')['y'] + radius) && (bulletY > (frontRowContainer.getAttribute('position')['y'] - radius)))
            {
                // For each target in the front row, checking if the bullet hit any of them
                for (let i = 0; i < numTargets; i++)
                {
                    currentZ = frontRowTargets[i].getAttribute('position')['z'] + frontRowContainer.getAttribute('position')['z'];

                    if (bulletZ < (currentZ + radius) && (bulletZ > (currentZ - radius)))
                    {
                        // If reached here, that means the bullet is collided with the target, update that target's collider and return true
                        frontRowTargets[i].setAttribute('target_collider', {});

                        return true;
                    }
                }
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // Getting middle row targets
    const middleRowContainer = document.querySelector('#middleRow');
    const middleRowTargets = middleRowContainer.children;
    numTargets = middleRowTargets.length;

    // If there are targets to check
    if (numTargets > 0)
    {
        // Checking if the bullet is at the same x value as the front row (with 0.05 leniency)
        if ((bulletX < (middleRowContainer.getAttribute('position')['x'] + 0.05)) && (bulletX > (middleRowContainer.getAttribute('position')['x'] - 0.05)))
        {
            radius = middleRowTargets[0].getAttribute('geometry')['radius'];

            // Checking if the bullet is at the same y value as the front row 
            if (bulletY < (middleRowContainer.getAttribute('position')['y'] + radius) && (bulletY > (middleRowContainer.getAttribute('position')['y'] - radius)))
            {
                // For each target in the front row, checking if the bullet hit any of them
                for (let i = 0; i < numTargets; i++)
                {
                    currentZ = middleRowTargets[i].getAttribute('position')['z'] + middleRowContainer.getAttribute('position')['z'];

                    if (bulletZ < (currentZ + radius) && (bulletZ > (currentZ - radius)))
                    {
                        // If reached here, that means the bullet is collided with the target, update that target's collider and return true
                        middleRowTargets[i].setAttribute('target_collider', {});

                        return true;
                    }
                }
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // Getting back row targets
    const backRowContainer = document.querySelector('#backRow');
    const backRowTargets = backRowContainer.children;
    numTargets = backRowTargets.length;

    // If there are targets to check
    if (numTargets > 0)
    {
        // Checking if the bullet is at the same x value as the front row (with 0.05 leniency)
        if ((bulletX < (backRowContainer.getAttribute('position')['x'] + 0.05)) && (bulletX > (backRowContainer.getAttribute('position')['x'] - 0.05)))
        {
            radius = backRowTargets[0].getAttribute('geometry')['radius'];
    
            // Checking if the bullet is at the same y value as the front row 
            if (bulletY < (backRowContainer.getAttribute('position')['y'] + radius) && (bulletY > (backRowContainer.getAttribute('position')['y'] - radius)))
            {
                // For each target in the front row, checking if the bullet hit any of them
                for (let i = 0; i < numTargets; i++)
                {
                    currentZ = backRowTargets[i].getAttribute('position')['z'] + backRowContainer.getAttribute('position')['z'];
    
                    if (bulletZ < (currentZ + radius) && (bulletZ > (currentZ - radius)))
                    {
                        // If reached here, that means the bullet is collided with the target, update that target's collider and return true
                        backRowTargets[i].setAttribute('target_collider', {});

                        return true;
                    }
                }
            }
        }
    }

    /***************************************************************************************************************************************************************************/

    // If reached here, that means the bullet has not collided with any targets and return false
    return false;
};

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('bullet_collider', 
{
    init : function() 
    {
        const CONTEXT_AF = this;

        var element = CONTEXT_AF.el;

        // Checking every millisecond if the bullet has collided with something
        const colliderCheck = setInterval(function()
        {
            var hasCollided = false;

            // Checking if bullet has collided with a target
            hasCollided = targetCollide(element);

            // If the bullet has not collided with a wall (hasCollided is false)
            if (hasCollided === false)
            {
                // Checking if bullet has collided with a wall
                hasCollided = wallCollide(element);
            }

            // If the bullet has collided with something, delete it
            if (hasCollided === true)
            {
                element.parentNode.removeChild(element);

                clearInterval(colliderCheck);
            }

        }, 1);
    }

});