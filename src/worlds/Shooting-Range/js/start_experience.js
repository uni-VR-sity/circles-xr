// Opening screen when user open the experience
// Forces button press to allow sound to start playing

'user strict'

// Functions

// For when start button is clicked to start the experience
// Remove start screen and play ambient sound
startExperience = function()
{
    document.querySelector('#startScreen').style.display = 'none';

    // Start ambient sound
    var ambientSound = document.querySelector('#ambientEntity');
    ambientSound.components.sound.playSound();

    // Generating instructions
    var scene = document.querySelector('#scene');
    var instructions = document.createElement('a-entity');

    instructions.setAttribute('id', 'instructions');

    instructions.setAttribute('text', {
        value: '',
        font: 'dejavu',
        color: '#f7f4af',
        align: 'center'
    });

    instructions.setAttribute('position', {
        x: 6.71,
        y: 0.33,
        z: 0.1
    });

    instructions.setAttribute('scale', {
        x: 2,
        y: 2,
        z: 2
    });

    instructions.setAttribute('rotation', {
        x: 0,
        y: 90,
        z: 0
    });

    scene.appendChild(instructions);

    // Generating guns
    scene.setAttribute('gun_generator', {});
}