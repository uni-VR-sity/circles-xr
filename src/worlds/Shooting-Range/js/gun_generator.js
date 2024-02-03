// Generates guns on table

'user strict'

// Functions

// Creates gun with specified parameters
createGun = function(gunId, colour, position, rotation)
{
    // Creating a gun element and setting its attributes
    var gun = document.createElement('a-entity');

    // Setting gun id
    gun.setAttribute('id', gunId);

    // Setting gun classes
    gun.setAttribute('class', 'gun interactive');

    // Setting gun appearance
    gun.setAttribute('rotation', {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2]
    });

    gun.setAttribute('scale', {
        x: 0.7,
        y: 0.7,
        z: 0.5
    });

    // Setting gun location
    gun.setAttribute('position', {
        x: position[0],
        y: position[1],
        z: position[2]
    });

    // Having gun highlight when hovered
    gun.setAttribute('highlight_gun', {id: gunId});

    // Allowing gun to be picked up
    gun.setAttribute('pickup_gun', {id: gunId});

    /***************************************************************************************************************************************************************************/

    // Creating bottom of gun and setting its attributes
    var gun_bottom = document.createElement('a-entity');

    // Setting gun bottom classes
    gun_bottom.setAttribute('class', 'gun_bottom interactive');

    // Setting gun bottom appearance
    gun_bottom.setAttribute('geometry', {
        primitive: 'box',
        height: 0.87,
        width: 0.37,
        depth: 0.37
    });

    gun_bottom.setAttribute('rotation', {
        x: 0,
        y: 0,
        z: 18
    });

    gun_bottom.setAttribute('material', {
        emissive: colour,
        emissiveIntensity: 0.5
    });

    // Appending the gun bottom to gun
    gun.appendChild(gun_bottom);

    /***************************************************************************************************************************************************************************/

    // Creating top of gun and setting its attributes
    var gun_top = document.createElement('a-entity');

    // Setting gun bottom classes
    gun_top.setAttribute('class', 'gun_top interactive');

    // Setting gun bottom appearance
    gun_top.setAttribute('geometry', {
        primitive: 'box',
        height: 1.75,
        width: 0.37,
        depth: 0.37
    });

    gun_top.setAttribute('rotation', {
        x: 90,
        y: 0,
        z: 90
    });

    gun_top.setAttribute('material', {
        emissive: colour,
        emissiveIntensity: 0.5
    });

    // Setting gun top location
    gun_top.setAttribute('position', {
        x: -0.556,
        y: 0.435,
        z: 0
    });

    // Appending the gun top to gun
    gun.appendChild(gun_top);

    /***************************************************************************************************************************************************************************/

    // Creating top of gun and setting its attributes
    var gun_trigger = document.createElement('a-entity');

    // Setting gun bottom classes
    gun_trigger.setAttribute('class', 'gun_trigger interactive');

    // Setting gun bottom appearance
    gun_trigger.setAttribute('geometry', {
        primitive: 'box',
        height: 0.28,
        width: 0.12,
        depth: 0.37
    });

    gun_trigger.setAttribute('rotation', {
        x: 0,
        y: 0,
        z: -20
    });

    gun_trigger.setAttribute('material', {
        emissive: colour,
        emissiveIntensity: 0.5
    });

    // Setting gun top location
    gun_trigger.setAttribute('position', {
        x: -0.431,
        y: 0.156,
        z: 0
    });

    // Appending the gun top to gun
    gun.appendChild(gun_trigger);

    // Returning finished gun
    return gun;
}

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('gun_generator', 
{
    init : function() 
    {
        // Getting scene
        var scene = document.querySelector('#scene');

        var gun;

        // Generating yellow gun
        // Parameters: id, colour, position, rotation
        gun = createGun('yellow', '#E3E34B', [6.455, 1, 0.064], [-90, 45, 0]);
        scene.appendChild(gun);

        // Generating pink gun
        // Parameters: id, colour, position, rotation
        gun = createGun('pink', '#FC92D0', [6.086, 1, -1.968], [-90, 121, 0]);
        scene.appendChild(gun);

        // Generating blue gun
        // Parameters: id, colour, position, rotation
        gun = createGun('blue', '#4BCCE3', [6.24, 1, 1.994], [-90, -30, 0]);
        scene.appendChild(gun);

        // Updating instructions
        var instructions = document.querySelector('#instructions');

        instructions.setAttribute('text', {
            value: 'Select a gun to begin'
        });
    }
});