// User picks up gun when they click on it
// Setting off target generation after gun is picked up

'user strict'

// Functions

// Adds shooting animations to gun element
addAnimations = function(gun)
{
    // Adding animation to gun for shooting (gun will flick up)
    gun.setAttribute('animation__joltBack', {
        property:'rotation', 
        to:'0 -75 -7', 
        from:'0 -75 0', 
        dur:150,
        enabled:false
    });

    gun.setAttribute('animation__joltForward', {
        property:'rotation', 
        to:'0 -75 0',  
        from:'0 -75 -7',
        dur:100,
        enabled:false
    });
    
    // Adding animation to gun trigger for shooting (trigger will rotate)
    gun.querySelector('.gun_trigger').setAttribute('animation__pullTrigger', {
        property:'rotation.z', 
        to:20, 
        from:-20, 
        dur:150,
        enabled:false
    });

    gun.querySelector('.gun_trigger').setAttribute('animation__releaseTrigger', {
        property:'rotation.z', 
        to:-20,
        from:20, 
        dur:100,
        enabled:false
    });
}

/***************************************************************************************************************************************************************************/

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
AFRAME.registerComponent('pickup_gun', 
{
    schema: 
    {
        // As there are 3 different guns, the entered id will be used to highlight the correct gun
        id : {type: 'string', default:''}
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        // Getting selected gun
        const gun = document.querySelector('#' + CONTEXT_AF.data.id);

        // Getting the all guns
        var all_guns = document.querySelectorAll('.gun');
        var num_guns = all_guns.length;

        // Getting the camera/ user
        var camera = document.querySelector('#user');

        CONTEXT_AF.el.addEventListener('click', function()
        {
            // Removing instructions (hiding them)
            var instructions = document.querySelector('#instructions');

            instructions.setAttribute('text', {
                value: ''
            });

            // Removing the gun generator
            var scene = document.querySelector('#scene');
            scene.removeAttribute('gun_generator');

            // "Cloning" gun element and attaching it to the camera as a child (If gun HTML is generated through JavaScript (as done in gun_generator.js) using the clone() function does not work)
            // User is now "holding" the gun
            var newGun = createGun(CONTEXT_AF.data.id, gun.lastElementChild.getAttribute('material')['emissive'], [0.5, -0.65, -1], [0, -75, 0]);
            camera.appendChild(newGun);

             // Deleting all guns
             for (let i = 0; i < num_guns; i++)
             {
                 all_guns[i].parentNode.removeChild(all_guns[i]);
             }
            
            // Adds shooting animations to gun element
            addAnimations(newGun);

            // Once gun is being held, it should no longer be highlight or picked up again, but it can now be shot
            newGun.setAttribute('shoot_gun', {});
            newGun.removeAttribute('pickup_gun');
            newGun.removeAttribute('highlight_gun');

            // Having targets, buttons, and instructions generated in 250 milliseconds after the gun is picked up
            setTimeout(function() {
                var targetContainer = document.querySelector('#targets');
                targetContainer.setAttribute('target_generator', {});

                var buttonContainer = document.querySelector('#buttons');
                buttonContainer.setAttribute('button_generator', {});

                // Updating instructions depending on what device the user is on
                var instructions = document.querySelector('#instructions');

                if (AFRAME.utils.device.isMobile() == false)
                {
                    instructions.setAttribute('text', {
                        value: 'Press spacebar to shoot'
                    });
                }
                else
                {
                    instructions.setAttribute('text', {
                        value: 'Click gun to shoot'
                    });
                }

            }, 250);
        });
    }
});