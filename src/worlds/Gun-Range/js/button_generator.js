// Generates buttons

'user strict'

// Functions

// Creates the reset targets button
resetTargetsButton = function()
{
    // Getting the button container that will hold the button element
    const buttonContainer = document.querySelector('#buttons');

    // Creating a button element and setting its attributes
    var button = document.createElement('a-entity');

    // Putting the button in the "interactive" class
    button.setAttribute('class', 'interactive');

    // Setting button appearance
    button.setAttribute('geometry', {
        primitive: 'cylinder',
        radius: 0.15,
        height: 0.15
    });

    button.setAttribute('material', {
        emissive: '#fefe86',
        emissiveIntensity: 0.6
    }); 

    // Setting button location
    button.setAttribute('position', {
        x: 6.2,
        y: 0.86,
        z: 1.43
    });

    // Setting button animation for mouse enter, leave, and click
    button.setAttribute('animation__mouseenter', {
        property: 'material.emissiveIntensity',
        from: 0.6,
        to: 0.8,
        startEvents: 'mouseenter',  
        dur: 0
    });

    button.setAttribute('animation__mouseleave', {
        property: 'material.emissiveIntensity',
        from: 0.8,
        to: 0.6,
        startEvents: 'mouseleave',  
        dur: 0
    });

    button.setAttribute('animation__click', {
        property: 'position',
        from: '6.2 0.76 1.43',
        to: '6.2 0.86 1.43',
        startEvents: 'click',
        dur: 300
    });

    // Adding functionality to button for when it is pressed
    button.setAttribute('reset_targets', {});

    /***************************************************************************************************************************************************************************/

    // Creating text description for the button
    var description = document.createElement('a-entity');

    description.setAttribute('text', {
        value: 'Reset Targets',
        font: 'dejavu',
        color: '#f7f4af'
    });

    description.setAttribute('position', {
        x: 6.71,
        y: 0.53,
        z: 0.6
    });

    description.setAttribute('scale', {
        x: 2,
        y: 2,
        z: 2
    });

    description.setAttribute('rotation', {
        x: 0,
        y: 90,
        z: 0
    });

    /***************************************************************************************************************************************************************************/

    // Appending the button and description to the button container
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(description);

}

/***************************************************************************************************************************************************************************/

// Creates the put down gun button
putDownGunButton = function()
{
    // Getting the button container that will hold the button element
    const buttonContainer = document.querySelector('#buttons');

    // Creating a button element and setting its attributes
    var button = document.createElement('a-entity');

    // Putting the button in the "interactive" class
    button.setAttribute('class', 'interactive');

    // Setting button appearance
    button.setAttribute('geometry', {
        primitive: 'cylinder',
        radius: 0.15,
        height: 0.15
    });

    button.setAttribute('material', {
        emissive: '#fefe86',
        emissiveIntensity: 0.6
    }); 

    // Setting button location
    button.setAttribute('position', {
        x: 6.2,
        y: 0.86,
        z: -1.39
    });

    // Setting button animation for mouse enter, leave, and click
    button.setAttribute('animation__mouseenter', {
        property: 'material.emissiveIntensity',
        from: 0.6,
        to: 0.8,
        startEvents: 'mouseenter',  
        dur: 0
    });

    button.setAttribute('animation__mouseleave', {
        property: 'material.emissiveIntensity',
        from: 0.8,
        to: 0.6,
        startEvents: 'mouseleave',  
        dur: 0
    });

    button.setAttribute('animation__click', {
        property: 'position',
        from: '6.2 0.76 -1.38',
        to: '6.2 0.86 -1.39',
        startEvents: 'click',
        dur: 300
    });

    // Adding functionality to button for when it is pressed
    button.setAttribute('put_down_gun', {});

    /***************************************************************************************************************************************************************************/

    // Creating text description for the button
    var description = document.createElement('a-entity');

    description.setAttribute('text', {
        value: 'Put Gun Down',
        font: 'dejavu',
        color: '#f7f4af'
    });

    description.setAttribute('position', {
        x: 6.71,
        y: 0.53,
        z: -1.9
    });

    description.setAttribute('scale', {
        x: 2,
        y: 2,
        z: 2
    });

    description.setAttribute('rotation', {
        x: 0,
        y: 90,
        z: 0
    });

    /***************************************************************************************************************************************************************************/

    // Appending the button and description to the button container
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(description);
}

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('button_generator', 
{
    init : function() 
    {
        // Generate reset targets button
        resetTargetsButton();

        // Generate put down gun button
        putDownGunButton();
    }
});