import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// Animations and states
const animations = ['pressSmile', 'eyeRoll', 'blinkEyes'];
const states = ['Idle'];

// GUI
const gui = new GUI();
const obj = {}

// Adding states
obj.State = 'Idle';
gui.add(obj, 'State', states).onChange(value => {
    console.log(value);
});

// Adding animations
const animationsFolder = gui.addFolder('Animations');

for (const animation of animations)
{
    obj[animation] = function() { document.getElementById('scene').emit(animation) };
    animationsFolder.add(obj, animation);
}