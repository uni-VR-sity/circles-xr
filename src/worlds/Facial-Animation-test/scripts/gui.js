import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// Animations and states
const mouthAnimations = ['mouthNeutral',
                        'fullSmile', 
                        /*'mouthPressRight', 'relaxMouthPressRight', 'mouthPressLeft', 'relaxMouthPressLeft',*/ 'mouthPress', 
                        /*'frownRight', 'relaxFrownRight', 'frownLeft', 'relaxFrownLeft',*/ 'fullFrown', 
                        /*'mouthLeft', 'mouthLeftNeutral', 'mouthRight', 'mouthRightNeutral',*/
                        'mouthPucker', /*'relaxPucker',*/
                        'mouthFunnel', /*'relaxFunnel',*/
                        /*'mouthStretchRight', 'mouthStretchRelaxRight', 'mouthStretchLeft', 'mouthStretchRelaxLeft',*/ 'mouthStretch',
                        /*'mouthUpperUpRight', 'mouthUpperUpRelaxRight', 'mouthUpperUpLeft', 'mouthUpperUpRelaxLeft',*/ 'mouthUpperUp',
                        /*'mouthRollUpper', 'relaxRollUpper','mouthRollLower', 'relaxRollLower',*/ 'mouthRoll',
                        /*'mouthShrugUpper', 'relaxShrugUpper', 'mouthShrugLower', 'relaxShrugLower',*/ 'mouthShrug',
                        /*'mouthLowerDownRight', 'mouthLowerDownRelaxRight', 'mouthLowerDownLeft', 'mouthLowerDownRelaxLeft',*/ 'mouthLowerDown',
                        'mouthOpen', /*'mouthClose', 'relaxMouthClose'*/
                        'viseme-BMP', 'viseme-FF', 'viseme-TH', 'viseme-TLDN', 'viseme-kk', 'viseme-CH',
                        'viseme-SS', 'viseme-RR', 'viseme-AA', 'viseme-E', 'viseme-I', 'viseme-O', 'viseme-U'
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
const animationsFolder = gui.addFolder('Mouth Animations');

// Find the face to animate
const animatedModels = document.getElementsByClassName("animated");
const firstAnimated = animatedModels[0];
console.log(firstAnimated.id);

for (const animation of mouthAnimations)
{
    obj[animation] = function() {
        //firstAnimated.emit('visemes-neutral');
        firstAnimated.emit(animation);
    };
    animationsFolder.add(obj, animation);
}