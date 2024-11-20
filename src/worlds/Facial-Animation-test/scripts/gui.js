import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// Animations and states
const animations = ['mouthPress', 'relaxMouthPress',
                    'fullSmile', 'relaxSmile',
                    'closeEyes', 'openEyes',
                    'squintEyes', 'relaxSquintEyes'
                ];
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

// Find the face to animate
const animatedModels = document.getElementsByClassName("animated");
const firstAnimated = animatedModels[0];
console.log(firstAnimated.id);

for (const animation of animations)
{
    obj[animation] = function() {
        firstAnimated.emit(animation);
    };
    animationsFolder.add(obj, animation);
}