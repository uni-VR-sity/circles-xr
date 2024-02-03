// User shoots gun when spacebar is pressed (with 200 millisecond cool down)
// (Animation is triggered and bullet is shot)

'user strict'

// Functions

// Controls shooting animations for the gun and trigger
enableAnimation = function()
{
    // All select the classes now as there is only one gun element
    const trigger = document.querySelector('.gun_trigger');
    const gun = document.querySelector('.gun');

    // Setting off animation for shooting gun

    // Flick up animation
    gun.setAttribute('animation__joltForward', {enabled:false});                    // Disabling the animation that puts the gun in its resting position
    gun.setAttribute('animation__joltBack', {enabled:true});                        // Enabling the animation that jolts the gun back

    // Trigger pull animation
    trigger.setAttribute('animation__releaseTrigger', {enabled:false});             // Disabling the animation that puts the trigger in its resting position
    trigger.setAttribute('animation__pullTrigger', {enabled:true});                 // Enabling the animation that pulls the trigger back

    // Setting the gun back to its resting position when the animation is done 
    var countdown_gun = setTimeout(function()
    {
        gun.setAttribute('animation__joltBack', {enabled:false});
        gun.setAttribute('animation__joltForward', {enabled:true});
    }, 100);

    // Setting the trigger back to its resting position when the animation is done 
    var countdown_trigger = setTimeout(function()
    {
        trigger.setAttribute('animation__pullTrigger', {enabled:false});
        trigger.setAttribute('animation__releaseTrigger', {enabled:true});
    }, 110);
}

/***************************************************************************************************************************************************************************/

// Creating bullet object being shot by gun 
createBullet = function(x, y, z)
{
    // Getting the top of the gun element (where the bullet will shoot from)
    var top = document.querySelector('.gun_top');

    // Getting the side of the gun for a reference point for movement vector
    var bottom = document.querySelector('.gun_bottom');

    // Getting the bullet container that will hold all bullet elements
    const bulletContainer = document.querySelector('#bullets');

    // Creating a bullet element and setting its attributes
    var bullet = document.createElement('a-entity');

    // Setting bullet appearance    
    bullet.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.1
    });

    bullet.setAttribute('scale', {
        x: 0.6,
        y: 0.6,
        z: 0.6 
    });

    bullet.setAttribute('material', {
        emissive: top.getAttribute('material')['emissive'],
        emissiveIntensity: top.getAttribute('material')['emissiveIntensity']
    }); 
    
    // Placing bullet inside gun chamber by getting the world space position of the gun chamber
    var bulletPos = new THREE.Vector3();
    top.object3D.getWorldPosition(bulletPos);

    bullet.setAttribute('position', {
        x: bulletPos['x'],
        y: bulletPos['y'],
        z: bulletPos['z']
    });

    // Getting a second point in the gun chamber by moving the gun bottom up to be in the chamber
    bottom.setAttribute('position', {
        y: bottom.getAttribute('position')['y'] + 0.435
    });

    var secondPos = new THREE.Vector3();
    bottom.object3D.getWorldPosition(secondPos);

    // Moving the gun bottom back into is original position
    bottom.setAttribute('position', {
        y: bottom.getAttribute('position')['y'] - 0.435
    });

    // Getting the vector the bullet will be moving from the gun chamber by subtracting two points in the vector
    var moveX = bulletPos['x'] - secondPos['x'];
    var moveY = bulletPos['y'] - secondPos['y'];
    var moveZ = bulletPos['z'] - secondPos['z'];

    // Adding attribute for bullet movement with the bullet movement vector
    bullet.setAttribute('move_bullet', {
        vectorX: moveX,
        vectorY: moveY,
        vectorZ: moveZ
    });

    // Adding attribute to detect if the bullet has collided with something
    bullet.setAttribute('bullet_collider', {});

    // Appending the bullet to the bullet container
    bulletContainer.appendChild(bullet);
}

/***************************************************************************************************************************************************************************/

// Shooting gun
shoot = function()
{
    // Playing gun shot sound
    var gunShot = document.querySelector('#gunShotEntity');
    gunShot.components.sound.playSound();

    // Setting off animations
    enableAnimation();

    // Shooting bullet
    createBullet();
}

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('shoot_gun', 
{
    schema: 
    {
        // The colour of the bullet to shoot
        colour : {type: 'color', default:'#FFFFFF'}
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        var readyShoot = true;

        // Detecting gun shooting depending on what device the user is on
        // PC: Spacebar press
        // Mobile: Press on gun
        if (AFRAME.utils.device.isMobile() == false)
        {
            document.addEventListener('keypress', function(key)
            {
                if (key.keyCode === 32 && readyShoot === true)
                {
                    shoot();

                    readyShoot = false;

                    // Bullet can be shot every 500 milliseconds
                    setTimeout(function()
                    {
                        readyShoot = true;

                    }, 500);
                }
            });
        }
        else
        {
            element.addEventListener('click', function()
            {
                if (readyShoot === true)
                {
                    shoot();

                    readyShoot = false;

                    // Bullet can be shot every 500 milliseconds
                    setTimeout(function()
                    {
                        readyShoot = true;

                    }, 500);
                }
            });
        }
    }
});