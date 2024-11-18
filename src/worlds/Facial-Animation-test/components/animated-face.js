'use strict';

AFRAME.registerComponent('animated-face', {
    schema: {
        name:              {type:'string',     default:'no_name_set'},
    },
    init: function(){
        const CONTEXT_AF  = this;
        const data        = this.data;

        //animation-timeline__1="timeline: #myTimeline"

        //document.getElementById('scene').setAttribute('animation-timeline__1', {timeline: '#myTimeLine'});
        // Add the morph targets attached to the model 
        // *The model must have all the required shape keys for this to work*

        // eye morph targets
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeBlinkRight', {morphtarget: 'eyeBlink_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeBlinkLeft', {morphtarget: 'eyeBlink_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyesClosed', {morphtarget: 'eyesClosed', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeSquintRight', {morphtarget: 'eyeSquint_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeSquintLeft', {morphtarget: 'eyeSquint_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__cheekSquintRight', {morphtarget: 'cheekSquint_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__cheekSquintLeft', {morphtarget: 'cheekSquint_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeWideRight', {morphtarget: 'eyeWide_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeWideLeft', {morphtarget: 'eyeWide_left', value: 0});
        // look direction morph targets
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeLookUpRight', {morphtarget: 'eyeLookUp_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeLookUpLeft', {morphtarget: 'eyeLookUp_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyesLookUp', {morphtarget: 'eyesLookUp', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeLookDownRight', {morphtarget: 'eyeLookDown_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeLookDownLeft', {morphtarget: 'eyeLookDown_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyesLookDown', {morphtarget: 'eyesLookDown', value: 0});
        // brow morph targets
        CONTEXT_AF.el.setAttribute('gltf-morph__browInnerUp', {morphtarget: 'browInnerUp', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__browDownRight', {morphtarget: 'browDown_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__browDownLeft', {morphtarget: 'browDown_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__browOuterUpRight', {morphtarget: 'browOuterUp_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__browOuterUpLeft', {morphtarget: 'browOuterUp_left', value: 0});
        // nose morph targets
        CONTEXT_AF.el.setAttribute('gltf-morph__noseSneerRight', {morphtarget: 'noseSneer_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__noseSneerLeft', {morphtarget: 'noseSneer_left', value: 0});
        // mouth morph targets
        CONTEXT_AF.el.setAttribute('gltf-morph__mouthSmile', {morphtarget: 'mouthSmile', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__mouthPressRight', {morphtarget: 'mouthPress_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__mouthPressLeft', {morphtarget: 'mouthPress_left', value: 0});


        // Add the animations to trigger the morphtargets
        // eye animations
        CONTEXT_AF.el.setAttribute('animation__eyesClosed', {   property: 'gltf-morph__eyesClosed.value', 
                                                                from: 0, to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'closeEyes'});
        CONTEXT_AF.el.setAttribute('animation__eyeBlinkRight', {   property: 'gltf-morph__eyeBlinkRight.value', 
                                                                from: 0, to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'blinkEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeBlinkLeft', {   property: 'gltf-morph__eyeBlinkLeft.value', 
                                                                from: 0, to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'blinkEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyesOpen', {   property: 'gltf-morph__eyesClosed.value', 
                                                                from: 1, to: 0, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'openEyes'});
        CONTEXT_AF.el.setAttribute('animation__eyeOpenRight', {   property: 'gltf-morph__eyeBlinkRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'openEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeOpenLeft', {   property: 'gltf-morph__eyeBlinkLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'openEyeLeft'});

        CONTEXT_AF.el.setAttribute('animation__eyeSquintRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintRelaxRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'relaxSquintEyes, relaxSquintEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintRelaxLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'relaxSquintEyes, relaxSquintEyeLeft'});

        CONTEXT_AF.el.setAttribute('animation__cheekSquintRight', {   property: 'gltf-morph__cheekSquintRight.value', 
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false,
                                                                startEvents: 'squintCheeks, squintCheekRight'});
        CONTEXT_AF.el.setAttribute('animation__cheekSquintLeft', {   property: 'gltf-morph__cheekSquintLeft.value', 
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false,
                                                                startEvents: 'squintCheeks, squintCheekLeft'});
        CONTEXT_AF.el.setAttribute('animation__cheekSquintRelaxRight', {   property: 'gltf-morph__cheekSquintRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'relaxSquintCheeks, relaxSquintCheekRight'});
        CONTEXT_AF.el.setAttribute('animation__cheekSquintRelaxLeft', {   property: 'gltf-morph__cheekSquintLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'relaxSquintCheeks, relaxSquintCheekLeft'});

        CONTEXT_AF.el.setAttribute('animation__eyeWideRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideNeutralRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'wideEyesNeutral, wideEyeNeutralRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideNeutralLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'wideEyesNeutral, wideEyeNeutralLeft'});
        
        // Look directions
        CONTEXT_AF.el.setAttribute('animation__eyesLookUp', {   property: 'gltf-morph__eyesLookUp.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyesLookUp'});
        CONTEXT_AF.el.setAttribute('animation__eyesLookUpNeutral', {   property: 'gltf-morph__eyesLookUp.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyesLookUpNeutral'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpRight', {   property: 'gltf-morph__eyeLookUpRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookUpRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpNeutralRight', {   property: 'gltf-morph__eyeLookUpRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookUpNeutralRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpLeft', {   property: 'gltf-morph__eyeLookUpLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookUpLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpNeutralLeft', {   property: 'gltf-morph__eyeLookUpLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookUpNeutralLeft'});

        CONTEXT_AF.el.setAttribute('animation__eyesLookDown', {   property: 'gltf-morph__eyesLookDown.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyesLookDown'});
        CONTEXT_AF.el.setAttribute('animation__eyesLookDownNeutral', {   property: 'gltf-morph__eyesLookDown.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyesLookDownNeutral'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownRight', {   property: 'gltf-morph__eyeLookDownRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookDownRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownNeutralRight', {   property: 'gltf-morph__eyeLookDownRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookDownNeutralRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownLeft', {   property: 'gltf-morph__eyeLookDownLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookDownLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownNeutralLeft', {   property: 'gltf-morph__eyeLookDownLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookDownNeutralLeft'});
        
        // mouth animations
        CONTEXT_AF.el.setAttribute('animation__mouthSmile', {   property: 'gltf-morph__mouthSmile.value',
                                                                from: 0, to: 1, loop: false, dur: 500, autoplay: false, 
                                                                startEvents: 'fullSmile'});
        CONTEXT_AF.el.setAttribute('animation__relaxSmile', {   property: 'gltf-morph__mouthSmile.value', 
                                                                from: 1, to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxSmile'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressRight', {   property: 'gltf-morph__mouthPressRight.value',
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false, 
                                                                startEvents: 'mouthPress, mouthPressRight'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressRelaxRight', {   property: 'gltf-morph__mouthPressRight.value', 
                                                                from: 1, to: 0, loop: false, dur: 500, autoplay: false, 
                                                                startEvents: 'relaxMouthPress, relaxMouthPressRight'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressLeft', {   property: 'gltf-morph__mouthPressLeft.value',
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false, 
                                                                startEvents: 'mouthPress, mouthPressLeft'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressRelaxLeft', {   property: 'gltf-morph__mouthPressLeft.value', 
                                                                from: 1, to: 0, loop: false, dur: 500, autoplay: false, 
                                                                startEvents: 'relaxMouthPress, relaxMouthPressLeft'});


    },
})