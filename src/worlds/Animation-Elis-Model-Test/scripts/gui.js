import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// Animations and states
const mouthAnimations = [/* 'mouthNeutral',
                        'fullSmile', 
                        'mouthPressRight', 'relaxMouthPressRight', 'mouthPressLeft', 'relaxMouthPressLeft', 'mouthPress', 
                        'frownRight', 'relaxFrownRight', 'frownLeft', 'relaxFrownLeft', 'fullFrown', 
                        'mouthLeft', 'mouthLeftNeutral', 'mouthRight', 'mouthRightNeutral',
                        'mouthPucker', 'relaxPucker',
                        'mouthFunnel', 'relaxFunnel',
                        'mouthStretchRight', 'mouthStretchRelaxRight', 'mouthStretchLeft', 'mouthStretchRelaxLeft', 'mouthStretch',
                        'mouthUpperUpRight', 'mouthUpperUpRelaxRight', 'mouthUpperUpLeft', 'mouthUpperUpRelaxLeft', 'mouthUpperUp',
                        'mouthRollUpper', 'relaxRollUpper','mouthRollLower', 'relaxRollLower', 'mouthRoll',
                        'mouthShrugUpper', 'relaxShrugUpper', 'mouthShrugLower', 'relaxShrugLower', 'mouthShrug',
                        'mouthLowerDownRight', 'mouthLowerDownRelaxRight', 'mouthLowerDownLeft', 'mouthLowerDownRelaxLeft', 'mouthLowerDown',
                        'mouthOpen','mouthClose', 'relaxMouthClose', */
                        'viseme-sil', 'viseme-BMP', 'viseme-FF', 'viseme-TH', 'viseme-TLDN', 'viseme-KK', 'viseme-CH',
                        'viseme-SS', 'viseme-RR', 'viseme-AA', 'viseme-E', 'viseme-I', 'viseme-O', 'viseme-U'
                ];
const states = ['Idle'];

// GUI
const gui = new GUI();
const obj = {}

// Adding animations
const animationsFolder = gui.addFolder('Mouth Animations');

// Find the face to animate
const animatedModels = document.getElementsByClassName("animated");
const firstAnimated = animatedModels[0];
console.log(firstAnimated.id);

for (const animation of mouthAnimations)
{
    obj[animation] = function() {
        firstAnimated.emit('viseme-sil');
        firstAnimated.emit(animation);
    };
    animationsFolder.add(obj, animation);
}

// Adding tests
const TestFolder = gui.addFolder('Tests');

obj['Object'] = function() 
{
    var agent = document.getElementById('agent');
    console.log(agent);
};

TestFolder.add(obj, 'Object');

obj['Mesh'] = function() 
{
    var mesh = document.getElementById('agent').getObject3D('mesh');
    console.log(mesh);
};

TestFolder.add(obj, 'Mesh');

obj['Morph Target'] = function() 
{
    var targets = document.getElementById('agent').getObject3D('mesh').children[8].morphTargetDictionary;
    console.log(targets);
};

TestFolder.add(obj, 'Morph Target');