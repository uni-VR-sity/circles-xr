'use strict';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// QUESTION: will this global variable cause issues if we have multiple faces? 
// I think everyone with a face will get the same expression lol XD
let activeState;

AFRAME.registerComponent('animated-face', {
    schema: {
        id:                             {type:'string',    default:'no_id_set'},
        state:                          {type:'string',    default:'null'},
        morph_eyeBlinkRight:            {type:'float',     default:            0},
        morph_eyeBlinkLeft:             {type:'float',     default:            0},
        morph_eyesClosed:               {type:'float',     default:            0},
    },
    init: function(){
        const CONTEXT_AF  = this;
        const data        = this.data;

        data.id = CONTEXT_AF.el.id;
        
        // create morph targets + animations for face components
        CONTEXT_AF.el.setAttribute('animated-eyes', {});
        CONTEXT_AF.el.setAttribute('animated-cheeks', {});
        CONTEXT_AF.el.setAttribute('animated-nose', {});

        console.log("Eyes created! =D in face");
        //document.getElementById('scene').setAttribute('animation-timeline__1', {timeline: '#myTimeLine'});
        // Add the morph targets attached to the model 
        // *The model must have all the required shape keys for this to work*
        CONTEXT_AF.createMorphTargets(CONTEXT_AF);

        // Add the animations to trigger the morphtargets
        CONTEXT_AF.createAnimations(CONTEXT_AF);


        /*
        CONTEXT_AF.el.addEventListener('moveEyes', function(evt){

            switch(evt.detail.value){

                case 'neutralize':
                    CONTEXT_AF.el.emit('eyesNeutral');

                    break;

                case 'blink':
                    CONTEXT_AF.closeEyes(evt.detail.side, evt.detail.dur);

                    break;

                case 'roll':
                    CONTEXT_AF.rollEyes(evt.detail.side, evt.detail.dur);

                    break;

                case 'look':
                    CONTEXT_AF.lookEyes(evt.detail.side, evt.detail.dur);

                    break;

                case 'squint':
                    CONTEXT_AF.squintEyes(evt.detail.side, evt.detail.dur);

                    break;

                case 'angry':
                    CONTEXT_AF.squintEyes(evt.detail.side, evt.detail.dur);
                    CONTEXT_AF.browsAngry(evt.detail.side, evt.detail.dur);

                    break;

                case 'scared':
                    CONTEXT_AF.scaredEyes(evt.detail.side, evt.detail.dur);
                    CONTEXT_AF.browsScared(evt.detail.dur);

                    break;

                default:
                    console.log('*Unknown Eye Movement*');
            }
        });
        */
        CONTEXT_AF.el.addEventListener('moveMouth', function(evt){

            switch(evt.detail.value){

                case 'neutralize':
                    CONTEXT_AF.el.emit('mouthNeutral');

                    break;

                case 'fullSmile':
                    CONTEXT_AF.fullSmile(evt.detail.dur);

                    break;

                case 'pressSmile':
                    CONTEXT_AF.pressSmile(evt.detail.side, evt.detail.dur);

                    break;

                case 'angryOpen':
                    CONTEXT_AF.mouthOpen('angry', evt.detail.dur);

                    break;

                case 'scaredOpen':
                    CONTEXT_AF.mouthOpen('scared', evt.detail.dur);

                    break;

                case 'frown':
                    CONTEXT_AF.frown(evt.detail.side, evt.detail.dur);

                    break;

                default:
                    console.log('*Unknown Eye Movement*');
            }
        });
    },

    update: function(oldData){
        const CONTEXT_AF  = this;
        const data        = this.data;
        /*
        if(oldData.morph_eyesClosed !== data.morph_eyesClosed){
            CONTEXT_AF.el.setAttribute('gltf-morph__eyesClosed', { value: data.morph_eyesClosed});

            console.log('eyesClosed updated');
        }
        */
        if(oldData.state !== data.state){
            CONTEXT_AF.stateHandler(data.state);
        }
    },

    stateHandler: async function (state){
        const CONTEXT_AF  = this;
        const data        = this.data;

        switch(state){

            case 'null':
                clearInterval(activeState);
                console.log('*Set null ActiveState*');

                break;

            case 'idle':
                CONTEXT_AF.idle();
                activeState = setInterval( async => CONTEXT_AF.idle(), 12000);
                console.log('*Set Idle*');

                break;

            default:
                console.log('*Unknown ActiveState*');
        }
    },

    // NOTE: we might try using transverse to try and make this shorter and look for morph targets and targetNames
    // here's an example: https://github.com/elbobo/aframe-gltf-morph-component/blob/master/dist/aframe-gltf-morph-component.js
    createMorphTargets: async function (context){
        /*
        context.el.setAttribute('gltf-morph__eyeBlinkRight', {morphtarget: 'eyeBlink_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeBlinkLeft', {morphtarget: 'eyeBlink_left', value: 0});
        context.el.setAttribute('gltf-morph__eyesClosed', {morphtarget: 'eyesClosed', value: 0});
        context.el.setAttribute('gltf-morph__eyeSquintRight', {morphtarget: 'eyeSquint_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeSquintLeft', {morphtarget: 'eyeSquint_left', value: 0});
        context.el.setAttribute('gltf-morph__eyeWideRight', {morphtarget: 'eyeWide_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeWideLeft', {morphtarget: 'eyeWide_left', value: 0});
        // look direction morph targets
        context.el.setAttribute('gltf-morph__eyeLookUpRight', {morphtarget: 'eyeLookUp_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookUpLeft', {morphtarget: 'eyeLookUp_left', value: 0});
        context.el.setAttribute('gltf-morph__eyesLookUp', {morphtarget: 'eyesLookUp', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookDownRight', {morphtarget: 'eyeLookDown_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookDownLeft', {morphtarget: 'eyeLookDown_left', value: 0});
        context.el.setAttribute('gltf-morph__eyesLookDown', {morphtarget: 'eyesLookDown', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookInRight', {morphtarget: 'eyeLookIn_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookInLeft', {morphtarget: 'eyeLookIn_left', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookOutRight', {morphtarget: 'eyeLookOut_right', value: 0});
        context.el.setAttribute('gltf-morph__eyeLookOutLeft', {morphtarget: 'eyeLookOut_left', value: 0});
        // brow morph targets
        context.el.setAttribute('gltf-morph__browInnerUp', {morphtarget: 'browInnerUp', value: 0});
        context.el.setAttribute('gltf-morph__browDownRight', {morphtarget: 'browDown_right', value: 0});
        context.el.setAttribute('gltf-morph__browDownLeft', {morphtarget: 'browDown_left', value: 0});
        context.el.setAttribute('gltf-morph__browOuterUpRight', {morphtarget: 'browOuterUp_right', value: 0});
        context.el.setAttribute('gltf-morph__browOuterUpLeft', {morphtarget: 'browOuterUp_left', value: 0});
        */
        // nose morph targets
        context.el.setAttribute('gltf-morph__noseSneerRight', {morphtarget: 'noseSneer_right', value: 0});
        context.el.setAttribute('gltf-morph__noseSneerLeft', {morphtarget: 'noseSneer_left', value: 0});
        // mouth morph targets
        context.el.setAttribute('gltf-morph__mouthSmile', {morphtarget: 'mouthSmile', value: 0});
        context.el.setAttribute('gltf-morph__mouthPucker', {morphtarget: 'mouthPucker', value: 0});
        context.el.setAttribute('gltf-morph__mouthFunnel', {morphtarget: 'mouthFunnel', value: 0});
        context.el.setAttribute('gltf-morph__mouthRollLower', {morphtarget: 'mouthRollLower', value: 0});
        context.el.setAttribute('gltf-morph__mouthRollUpper', {morphtarget: 'mouthRollUpper', value: 0});
        context.el.setAttribute('gltf-morph__mouthShrugLower', {morphtarget: 'mouthShrugLower', value: 0});
        context.el.setAttribute('gltf-morph__mouthShrugUpper', {morphtarget: 'mouthShrugUpper', value: 0});
        context.el.setAttribute('gltf-morph__mouthPressRight', {morphtarget: 'mouthPress_right', value: 0});
        context.el.setAttribute('gltf-morph__mouthPressLeft', {morphtarget: 'mouthPress_left', value: 0});
        context.el.setAttribute('gltf-morph__mouthStretchRight', {morphtarget: 'mouthStretch_right', value: 0});
        context.el.setAttribute('gltf-morph__mouthStretchLeft', {morphtarget: 'mouthStretch_left', value: 0});
        context.el.setAttribute('gltf-morph__mouthUpperUpRight', {morphtarget: 'mouthUpperUp_right', value: 0});
        context.el.setAttribute('gltf-morph__mouthUpperUpLeft', {morphtarget: 'mouthUpperUp_left', value: 0});
        context.el.setAttribute('gltf-morph__mouthLowerDownRight', {morphtarget: 'mouthLowerDown_right', value: 0});
        context.el.setAttribute('gltf-morph__mouthLowerDownLeft', {morphtarget: 'mouthLowerDown_left', value: 0});
        context.el.setAttribute('gltf-morph__mouthFrownRight', {morphtarget: 'mouthFrown_right', value: 0});
        context.el.setAttribute('gltf-morph__mouthFrownLeft', {morphtarget: 'mouthFrown_left', value: 0});
        context.el.setAttribute('gltf-morph__mouthRight', {morphtarget: 'mouth_right', value: 0});
        context.el.setAttribute('gltf-morph__mouthLeft', {morphtarget: 'mouth_left', value: 0});
        context.el.setAttribute('gltf-morph__mouthClose', {morphtarget: 'mouthClose', value: 0});
        context.el.setAttribute('gltf-morph__mouthOpen', {morphtarget: 'mouthOpen', value: 0});
        // cheek morph targets
        context.el.setAttribute('gltf-morph__cheekSquintRight', {morphtarget: 'cheekSquint_right', value: 0});
        context.el.setAttribute('gltf-morph__cheekSquintLeft', {morphtarget: 'cheekSquint_left', value: 0});
        context.el.setAttribute('gltf-morph__cheekPuff', {morphtarget: 'cheekPuff', value: 0});
        // jaw morph targets
        context.el.setAttribute('gltf-morph__jawForward', {morphtarget: 'jawForward', value: 0});
        context.el.setAttribute('gltf-morph__jawOpen', {morphtarget: 'jawOpen', value: 0});
        context.el.setAttribute('gltf-morph__jawRight', {morphtarget: 'jaw_right', value: 0});
        context.el.setAttribute('gltf-morph__jawLeft', {morphtarget: 'jaw_left', value: 0});
        // tongue morph targets
        context.el.setAttribute('gltf-morph__tongueOut', {morphtarget: 'tongueOut', value: 0});
    },

    createAnimations: async function (context){
        /*
        // eye animations
        context.el.setAttribute('animation__eyesClosed', {   property: 'gltf-morph__eyesClosed.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'closeEyes'});
        context.el.setAttribute('animation__eyeBlinkRight', {   property: 'gltf-morph__eyeBlinkRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'blinkEyeRight'});
        context.el.setAttribute('animation__eyeBlinkLeft', {   property: 'gltf-morph__eyeBlinkLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'blinkEyeLeft'});
        context.el.setAttribute('animation__eyesOpen', {   property: 'gltf-morph__eyesClosed.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'blinkEyeRight, blinkEyeLeft, eyesNeutral, eyeRightNeutral, eyeLeftNeutral'});
        context.el.setAttribute('animation__eyeOpenRight', {   property: 'gltf-morph__eyeBlinkRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'openEyeRight, closeEyes, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeOpenLeft', {   property: 'gltf-morph__eyeBlinkLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'openEyeLeft, closeEyes, eyesNeutral, eyeLeftNeutral'});

        context.el.setAttribute('animation__eyeSquintRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeRight'});
        context.el.setAttribute('animation__eyeSquintLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeLeft'});
        context.el.setAttribute('animation__eyeSquintRelaxRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'relaxSquintEyes, relaxSquintEyeRight, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeSquintRelaxLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'relaxSquintEyes, relaxSquintEyeLeft, eyesNeutral, eyeLeftNeutral'});
        
        context.el.setAttribute('animation__cheekSquintRight', {   property: 'gltf-morph__cheekSquintRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'squintCheeks, squintCheekRight'});
        context.el.setAttribute('animation__cheekSquintLeft', {   property: 'gltf-morph__cheekSquintLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'squintCheeks, squintCheekLeft'});
        context.el.setAttribute('animation__cheekSquintRelaxRight', {   property: 'gltf-morph__cheekSquintRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'relaxSquintCheeks, relaxSquintCheekRight'});
        context.el.setAttribute('animation__cheekSquintRelaxLeft', {   property: 'gltf-morph__cheekSquintLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'relaxSquintCheeks, relaxSquintCheekLeft'});
        
        context.el.setAttribute('animation__eyeWideRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeRight'});
        context.el.setAttribute('animation__eyeWideNeutralRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'wideEyesNeutral, wideEyeNeutralRight, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeWideLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeLeft'});
        context.el.setAttribute('animation__eyeWideNeutralLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'wideEyesNeutral, wideEyeNeutralLeft, eyesNeutral, eyeLeftNeutral'});
        //console.log('Finished creating eye animations');
        
        // Look directions
        context.el.setAttribute('animation__eyesLookUp', {   property: 'gltf-morph__eyesLookUp.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyesLookUp'});
        context.el.setAttribute('animation__eyesLookUpNeutral', {   property: 'gltf-morph__eyesLookUp.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyesLookUpNeutral, eyeLookUpRight, eyeLookUpLeft, eyesNeutral, eyeRightNeutral, eyeLeftNeutral'});
        context.el.setAttribute('animation__eyeLookUpRight', {   property: 'gltf-morph__eyeLookUpRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookUpRight'});
        context.el.setAttribute('animation__eyeLookUpNeutralRight', {   property: 'gltf-morph__eyeLookUpRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookUpNeutralRight, eyesLookUpNeutral, eyesLookUp, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeLookUpLeft', {   property: 'gltf-morph__eyeLookUpLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookUpLeft'});
        context.el.setAttribute('animation__eyeLookUpNeutralLeft', {   property: 'gltf-morph__eyeLookUpLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookUpNeutralLeft, eyesLookUpNeutral, eyesLookUp, eyesNeutral, eyeLeftNeutral'});

        context.el.setAttribute('animation__eyesLookDown', {   property: 'gltf-morph__eyesLookDown.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyesLookDown'});
        context.el.setAttribute('animation__eyesLookDownNeutral', {   property: 'gltf-morph__eyesLookDown.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyesLookDownNeutral, eyeLookDownRight, eyeLookDownLeft, eyesNeutral, eyeRightNeutral, eyeLeftNeutral'});
        context.el.setAttribute('animation__eyeLookDownRight', {   property: 'gltf-morph__eyeLookDownRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookDownRight'});
        context.el.setAttribute('animation__eyeLookDownNeutralRight', {   property: 'gltf-morph__eyeLookDownRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookDownNeutralRight, eyesLookDownNeutral, eyesLookDown, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeLookDownLeft', {   property: 'gltf-morph__eyeLookDownLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookDownLeft'});
        context.el.setAttribute('animation__eyeLookDownNeutralLeft', {   property: 'gltf-morph__eyeLookDownLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookDownNeutralLeft, eyesLookDownNeutral, eyesLookDown, eyesNeutral, eyeLeftNeutral'});
                                                                
        context.el.setAttribute('animation__eyeLookInRight', {   property: 'gltf-morph__eyeLookInRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookInRight, eyesLookIn, eyesLookLeft'});
        context.el.setAttribute('animation__eyeLookInNeutralRight', {   property: 'gltf-morph__eyeLookInRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookInNeutralRight, eyesLookInNeutral, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeLookInLeft', {   property: 'gltf-morph__eyeLookInLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookInLeft, eyesLookIn, eyesLookRight'});
        context.el.setAttribute('animation__eyeLookInNeutralLeft', {   property: 'gltf-morph__eyeLookInLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookInNeutralLeft, eyesLookInNeutral, eyesNeutral, eyeLeftNeutral'});
                                                                
        context.el.setAttribute('animation__eyeLookOutRight', {   property: 'gltf-morph__eyeLookOutRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookOutRight, eyesLookOut, eyesLookRight'});
        context.el.setAttribute('animation__eyeLookOutNeutralRight', {   property: 'gltf-morph__eyeLookOutRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookOutNeutralRight, eyesLookOutNeutral, eyesNeutral, eyeRightNeutral'});
        context.el.setAttribute('animation__eyeLookOutLeft', {   property: 'gltf-morph__eyeLookOutLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'eyeLookOutLeft, eyesLookOut, eyesLookLeft'});
        context.el.setAttribute('animation__eyeLookOutNeutralLeft', {   property: 'gltf-morph__eyeLookOutLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookOutNeutralLeft, eyesLookOutNeutral, eyesNeutral, eyeLeftNeutral'});
        //console.log('Finished creating look animations');
                                                                
        // brow animations
        context.el.setAttribute('animation__browInnerUp', {   property: 'gltf-morph__browInnerUp.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'browInnerUp'});
        context.el.setAttribute('animation__browInnerRelax', {   property: 'gltf-morph__browInnerUp.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'browInnerRelax, neutralizeBrows'});
        context.el.setAttribute('animation__browDownRight', {   property: 'gltf-morph__browDownRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'browDownRight, browDown'});
        context.el.setAttribute('animation__browDownRelaxRight', {   property: 'gltf-morph__browDownRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'browDownRelaxRight, browDownRelax, neutralizeBrows'});
        context.el.setAttribute('animation__browDownLeft', {   property: 'gltf-morph__browDownLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'browDownLeft, browDown'});
        context.el.setAttribute('animation__browDownRelaxLeft', {   property: 'gltf-morph__browDownLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'browDownRelaxLeft, browDownRelax, neutralizeBrows'});
        context.el.setAttribute('animation__browOuterUpRight', {   property: 'gltf-morph__browOuterUpRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'browOuterUpRight, browOuterUp'});
        context.el.setAttribute('animation__browOuterUpRelaxRight', {   property: 'gltf-morph__browOuterUpRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'browOuterUpRelaxRight, browOuterUpRelax, neutralizeBrows'});
        context.el.setAttribute('animation__browOuterUpLeft', {   property: 'gltf-morph__browOuterUpLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'browOuterUpLeft, browOuterUp'});
        context.el.setAttribute('animation__browOuterUpRelaxLeft', {   property: 'gltf-morph__browOuterUpLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'browOuterUpRelaxLeft, browOuterUpRelax, neutralizeBrows'});
        console.log('Finished creating brow animations');
        */

        // mouth animations
        context.el.setAttribute('animation__mouthSmile', {   property: 'gltf-morph__mouthSmile.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'fullSmile'});
        context.el.setAttribute('animation__relaxSmile', {   property: 'gltf-morph__mouthSmile.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxSmile, mouthNeutral'});
        context.el.setAttribute('animation__mouthPressRight', {   property: 'gltf-morph__mouthPressRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthPress, mouthPressRight'});
        context.el.setAttribute('animation__mouthPressRelaxRight', {   property: 'gltf-morph__mouthPressRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxMouthPress, relaxMouthPressRight, mouthNeutral'});
        context.el.setAttribute('animation__mouthPressLeft', {   property: 'gltf-morph__mouthPressLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthPress, mouthPressLeft'});
        context.el.setAttribute('animation__mouthPressRelaxLeft', {   property: 'gltf-morph__mouthPressLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxMouthPress, relaxMouthPressLeft, mouthNeutral'});
        context.el.setAttribute('animation__mouthFrownRight', {   property: 'gltf-morph__mouthFrownRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'fullFrown, frownRight'});
        context.el.setAttribute('animation__relaxFrownRight', {   property: 'gltf-morph__mouthFrownRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxFrown, relaxFrownRight, mouthNeutral'});
        context.el.setAttribute('animation__mouthFrownLeft', {   property: 'gltf-morph__mouthFrownLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'fullFrown, frownLeft'});
        context.el.setAttribute('animation__relaxFrownLeft', {   property: 'gltf-morph__mouthFrownLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxFrown, relaxFrownLeft, mouthNeutral'});

        context.el.setAttribute('animation__mouthLeft', {   property: 'gltf-morph__mouthLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthLeft'});
        context.el.setAttribute('animation__mouthLeftNeutral', {   property: 'gltf-morph__mouthLeft.value',
                                                                to: 0, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthLeftNeutral, mouthNeutral'});
        context.el.setAttribute('animation__mouthRight', {   property: 'gltf-morph__mouthRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthRight'});
        context.el.setAttribute('animation__mouthRightNeutral', {   property: 'gltf-morph__mouthRight.value',
                                                                to: 0, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthRightNeutral, mouthNeutral'});
                                                                
        context.el.setAttribute('animation__cheekPuff', {   property: 'gltf-morph__cheekPuff.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'cheekPuff'});
        context.el.setAttribute('animation__relaxPuff', {   property: 'gltf-morph__cheekPuff.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxPuff, mouthNeutral'});
        context.el.setAttribute('animation__mouthPucker', {   property: 'gltf-morph__mouthPucker.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'mouthPucker'});
        context.el.setAttribute('animation__relaxPucker', {   property: 'gltf-morph__mouthPucker.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxPucker, mouthNeutral'});
        context.el.setAttribute('animation__mouthFunnel', {   property: 'gltf-morph__mouthFunnel.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'mouthFunnel'});
        context.el.setAttribute('animation__relaxFunnel', {   property: 'gltf-morph__mouthFunnel.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxFunnel, mouthNeutral'});
        context.el.setAttribute('animation__mouthStretchRight', {   property: 'gltf-morph__mouthStretchRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthStretchRight, mouthStretch'});
        context.el.setAttribute('animation__mouthStretchLeft', {   property: 'gltf-morph__mouthStretchLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthStretchLeft, mouthStretch'});
        context.el.setAttribute('animation__mouthStretchRelaxRight', {   property: 'gltf-morph__mouthStretchRight.value',
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'mouthStretchRelaxRight, mouthStretchRelax, mouthNeutral'});
        context.el.setAttribute('animation__mouthStretchRelaxLeft', {   property: 'gltf-morph__mouthStretchLeft.value',
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'mouthStretchRelaxLeft, mouthStretchRelax, mouthNeutral'});

        context.el.setAttribute('animation__mouthUpperUpRight', {   property: 'gltf-morph__mouthUpperUpRight.value',
                                                                to: 0.75, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthUpperUpRight, mouthUpperUp'});
        context.el.setAttribute('animation__mouthUpperUpLeft', {   property: 'gltf-morph__mouthUpperUpLeft.value',
                                                                to: 0.75, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthUpperUpLeft, mouthUpperUp'});
        context.el.setAttribute('animation__mouthUpperUpRelaxRight', {   property: 'gltf-morph__mouthUpperUpRight.value',
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'mouthUpperUpRelaxRight, mouthUpperUpRelax, mouthNeutral'});
        context.el.setAttribute('animation__mouthUpperUpRelaxLeft', {   property: 'gltf-morph__mouthUpperUpLeft.value',
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'mouthUpperUpRelaxLeft, mouthUpperUpRelax, mouthNeutral'});
        context.el.setAttribute('animation__mouthRollUpper', {   property: 'gltf-morph__mouthRollUpper.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'mouthRollUpper, mouthRoll'});
        context.el.setAttribute('animation__relaxRollUpper', {   property: 'gltf-morph__mouthRollUpper.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxRollUpper, relaxRoll, mouthNeutral'});
        context.el.setAttribute('animation__mouthShrugUpper', {   property: 'gltf-morph__mouthShrugUpper.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'mouthShrugUpper, mouthShrug'});
        context.el.setAttribute('animation__relaxShrugUpper', {   property: 'gltf-morph__mouthShrugUpper.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxShrugUpper, relaxShrug, mouthNeutral'});
                                                                
        context.el.setAttribute('animation__mouthLowerDownRight', {   property: 'gltf-morph__mouthLowerDownRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthLowerDownRight, mouthLowerDown'});
        context.el.setAttribute('animation__mouthLowerDownLeft', {   property: 'gltf-morph__mouthLowerDownLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthLowerDownLeft, mouthLowerDown'});
        context.el.setAttribute('animation__mouthLowerDownRelaxRight', {   property: 'gltf-morph__mouthLowerDownRight.value',
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'mouthLowerDownRelaxRight, mouthLowerDownRelax, mouthNeutral'});
        context.el.setAttribute('animation__mouthLowerDownRelaxLeft', {   property: 'gltf-morph__mouthLowerDownLeft.value',
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'mouthLowerDownRelaxLeft, mouthLowerDownRelax, mouthNeutral'});
        context.el.setAttribute('animation__mouthRollLower', {   property: 'gltf-morph__mouthRollLower.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'mouthRollLower, mouthRoll'});
        context.el.setAttribute('animation__relaxRollLower', {   property: 'gltf-morph__mouthRollLower.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxRollLower, relaxRoll, mouthNeutral'});
        context.el.setAttribute('animation__mouthShrugLower', {   property: 'gltf-morph__mouthShrugLower.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'mouthShrugLower, mouthShrug'});
        context.el.setAttribute('animation__relaxShrugLower', {   property: 'gltf-morph__mouthShrugLower.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxShrugLower, relaxShrug, mouthNeutral'});

        context.el.setAttribute('animation__mouthOpen', {   property: 'gltf-morph__mouthOpen.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthOpen'});
        context.el.setAttribute('animation__relaxMouthOpen', {   property: 'gltf-morph__mouthOpen.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxMouthOpen, mouthClose, mouthNeutral'});
        context.el.setAttribute('animation__mouthClose', {   property: 'gltf-morph__mouthClose.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'mouthClose'});
        context.el.setAttribute('animation__relaxMouthClose', {   property: 'gltf-morph__mouthClose.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxMouthClose, mouthOpen, mouthNeutral'});
        //console.log('Finished creating mouth animations');

        // jaw animations
        context.el.setAttribute('animation__jawOpen', {   property: 'gltf-morph__jawOpen.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'jawOpen'});
        context.el.setAttribute('animation__relaxJawOpen', {   property: 'gltf-morph__jawOpen.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxJawOpen, mouthOpen, jawNeutral'});
        context.el.setAttribute('animation__jawForward', {   property: 'gltf-morph__jawForward.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'jawForward'});
        context.el.setAttribute('animation__relaxJawForward', {   property: 'gltf-morph__jawForward.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxJawForward, jawNeutral'});
        context.el.setAttribute('animation__jawRight', {   property: 'gltf-morph__jawRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'jawRight'});
        context.el.setAttribute('animation__jawNeutralRight', {   property: 'gltf-morph__jawRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'jawNeutralRight, jawNeutral, jawLeft'});
        context.el.setAttribute('animation__jawLeft', {   property: 'gltf-morph__jawLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'jawLeft'});
        context.el.setAttribute('animation__jawNeutralLeft', {   property: 'gltf-morph__jawLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'jawNeutralLeft, jawNeutral, jawRight'});
        //console.log('Finished creating jaw animations');

        // nose animations
        context.el.setAttribute('animation__noseSneerRight', {   property: 'gltf-morph__noseSneerRight.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'noseSneerRight, noseSneer'});
        context.el.setAttribute('animation__noseSneerNeutralRight', {   property: 'gltf-morph__noseSneerRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'noseSneerNeutralRight, noseNeutral'});
        context.el.setAttribute('animation__noseSneerLeft', {   property: 'gltf-morph__noseSneerLeft.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'noseSneerLeft, noseSneer'});
        context.el.setAttribute('animation__noseSneerNeutralLeft', {   property: 'gltf-morph__noseSneerLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'noseSneerNeutralLeft, noseNeutral'});
        //console.log('Finished creating nose animations');

        // tongue animations
        context.el.setAttribute('animation__tongueOut', {   property: 'gltf-morph__tongueOut.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'tongueOut'});
        context.el.setAttribute('animation__tongueIn', {   property: 'gltf-morph__tongueOut.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'tongueIn, mouthClose'});
        //console.log('Finished creating tongue animations');
    },

    closeEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('closeEyes Dur = ' + dur);
        }

        //['both', 'right', 'left']
        if(side == 'both'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('closeEyes');
            await delay(400 * dur);
            this.el.emit('eyesNeutral');
            console.log('Blink eyes');

        }else if(side == 'right'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('blinkEyeRight');
            await delay(400 * dur);
            this.el.emit('openEyeRight');
            console.log('Blink right eye');

        }else if(side == 'left'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('blinkEyeLeft');
            await delay(400 * dur);
            this.el.emit('openEyeLeft');
            console.log('Blink left eye');

        }else{
            console.log('Close eye value not recognized');
        }
        
    },

    rollEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('rollEyes Dur = ' + dur);
        }

        //['both', 'right', 'left']
        if(side == 'both'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyesLookUp');
            await delay(400);
            this.el.emit('eyesLookDown');
            await delay(300 * dur);
            this.el.emit('eyesLookUpNeutral');
            await delay((200 * dur)+ 200);
            this.el.emit('eyesLookDownNeutral');
            console.log('Roll eyes');

        }else if(side == 'right'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyeLookUpRight');
            await delay(400);
            this.el.emit('eyeLookDownRight');
            await delay(300 * dur);
            this.el.emit('eyeLookUpNeutralRight');
            await delay((200 * dur)+ 200);
            this.el.emit('eyeLookDownNeutralRight');
            console.log('Roll right eye');

        }else if(side == 'left'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyeLookUpLeft');
            await delay(400);
            this.el.emit('eyeLookDownLeft');
            await delay(300 * dur);
            this.el.emit('eyeLookUpNeutralLeft');
            await delay((200 * dur)+ 200);
            this.el.emit('eyeLookDownNeutralLeft');
            console.log('Roll left eye');
        }else{
            console.log('Roll eye value not recognized');
        }
        
    },

    squintEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('squint Dur = ' + dur);
        }

        //['both', 'right', 'left']
        if(side == 'both'){
            this.el.emit('eyesNeutral');
            this.el.emit('relaxSquintCheeks');
            await delay(300);
            this.el.emit('squintEyes');
            this.el.emit('squintCheeks');
            await delay(400 * dur);
            this.el.emit('relaxSquintEyes');
            this.el.emit('relaxSquintCheeks');
            console.log('Squint both eyes');

        }else if(side == 'right'){
            this.el.emit('eyeRightNeutral');
            this.el.emit('relaxSquintCheekRight');
            await delay(300);
            this.el.emit('squintEyeRight');
            this.el.emit('squintCheekRight');
            await delay(400 * dur);
            this.el.emit('relaxSquintEyeRight');
            this.el.emit('relaxSquintCheekRight');
            console.log('Squint right');

        }else if(side == 'left'){
            this.el.emit('eyeLeftNeutral');
            this.el.emit('relaxSquintCheekLeft');
            await delay(300);
            this.el.emit('squintEyeLeft');
            this.el.emit('squintCheekLeft');
            await delay(400 * dur);
            this.el.emit('relaxSquintEyeLeft');
            this.el.emit('relaxSquintCheekLeft');
            console.log('Squint left');
        }else{
            console.log('Squint eye value not recognized');
        }
        
    },

    scaredEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('scared eyes Dur = ' + dur);
        }

        //['both', 'right', 'left']
        if(side == 'both'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('wideEyes');
            await delay(400 * dur);
            this.el.emit('wideEyesNeutral');
            console.log('Scared eyes');

        }else if(side == 'right'){
            this.el.emit('eyesRightNeutral');
            await delay(300);
            this.el.emit('wideEyeRight');
            await delay(400 * dur);
            this.el.emit('wideEyeRightNeutral');
            console.log('Scared right eye');

        }else if(side == 'left'){
            this.el.emit('eyeLeftNeutral');
            await delay(300);
            this.el.emit('wideEyeLeft');
            await delay(400 * dur);
            this.el.emit('wideEyeLeftNeutral');
            console.log('Scared left eye');
        }else{
            console.log('Scared eye value not recognized');
        }
        
    },

    lookEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('lookEyes Dur = ' + dur);
        }

        //['bothLeft', 'bothRight', 'bothUp', bothDown', 'rightRight', 'rightLeft', 'rightUp', 'rightDown', 'leftRight', 'leftLeft', 'leftUp', 'leftDown']
        if(side == 'bothLeft'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyesLookLeft');
            await delay(400 * dur);
            this.el.emit('eyesNeutral');
        }else if(side == 'bothRight'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyesLookRight');
            await delay(400 * dur);
            this.el.emit('eyesNeutral');
        }else if(side == 'bothUp'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyesLookUp');
            await delay(400 * dur);
            this.el.emit('eyesNeutral');
        }else if(side == 'bothDown'){
            this.el.emit('eyesNeutral');
            await delay(300);
            this.el.emit('eyesLookDown');
            await delay(400 * dur);
            this.el.emit('eyesNeutral');
        }else if(side == 'rightRight'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookOutRight');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'rightLeft'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookInRight');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'rightUp'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookUpRight');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'rightDown'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookDownRight');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'leftRight'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookOutLeft');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'leftLeft'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookInLeft');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'leftUp'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookUpLeft');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else if(side == 'leftDown'){
            this.el.emit('eyeRightNeutral');
            await delay(300);
            this.el.emit('eyeLookDownLeft');
            await delay(400 * dur);
            this.el.emit('eyeRightNeutral');
        }else{
            console.log('Look value not recognized');
        }
    },

    browsAngry: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('closeEyes Dur = ' + dur);
        }

        //['both', 'right', 'left']
        if(side == 'both'){
            this.el.emit('neutralizeBrows');
            await delay(300);
            this.el.emit('browDown');
            this.el.emit('browOuterUp');
            await delay(400 * dur);
            this.el.emit('neutralizeBrows');
            console.log('angry brows');

        }else if(side == 'right'){
            this.el.emit('browDownRelaxRight');
            this.el.emit('browOuterUpRelaxRight');
            await delay(300);
            this.el.emit('browDownRight');
            this.el.emit('browOuterUpRight');
            await delay(400 * dur);
            this.el.emit('browDownRelaxRight');
            this.el.emit('browOuterUpRelaxRight');
            console.log('angry right brow');

        }else if(side == 'left'){
            this.el.emit('browDownRelaxLeft');
            this.el.emit('browOuterUpRelaxLeft');
            await delay(300);
            this.el.emit('browDownLeft');
            this.el.emit('browOuterUpLeft');
            await delay(400 * dur);
            this.el.emit('browDownRelaxLeft');
            this.el.emit('browOuterUpRelaxLeft');
            console.log('angry left brow');

        }else{
            console.log('Close eye value not recognized');
        }
        
    },

    browsScared: async function (dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('brows scared Dur = ' + dur);
        }

        this.el.emit('neutralizeBrows');
        await delay(300);
        this.el.emit('browInnerUp');
        await delay(400 * dur);
        this.el.emit('browInnerRelax');
        console.log('scared brows');
        
    },

    fullSmile: async function (dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('smile Dur = ' + dur);
        }

        this.el.emit('mouthNeutral');
        await delay(300);
        this.el.emit('fullSmile');
        await delay(400 * dur);
        this.el.emit('mouthNeutral');
        console.log('fullSmile');
    },

    frown: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('frown Dur = ' + dur);
        }

        if(side == 'both'){
            this.el.emit('mouthNeutral');
            await delay(300);
            this.el.emit('fullFrown');
            await delay(400 * dur);
            this.el.emit('mouthNeutral');
            console.log('fullFrown');
        }else if(side == 'right'){
            this.el.emit('mouthRightNeutral');
            await delay(300);
            this.el.emit('frownRight');
            await delay(400 * dur);
            this.el.emit('mouthRightNeutral');
            console.log('right frown');
        }else if(side == 'left'){
            this.el.emit('mouthLeftNeutral');
            await delay(300);
            this.el.emit('frownLeft');
            await delay(400 * dur);
            this.el.emit('mouthLeftNeutral');
            console.log('left frown');
        }else{
            console.log('Frown value not recognized');
        }
        
    },

    pressSmile: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('smile Dur = ' + dur);
        }

        //['both', 'right', 'left']
        if(side == 'both'){
            this.el.emit('mouthNeutral');
            this.el.emit('relaxSquintCheeks');
            await delay(300);
            this.el.emit('mouthPress');
            this.el.emit('squintCheeks');
            await delay(400 * dur);
            this.el.emit('mouthNeutral');
            this.el.emit('relaxSquintCheeks');
            console.log('Press smile');

        }else if(side == 'right'){
            this.el.emit('relaxMouthPressRight');
            this.el.emit('relaxSquintCheekRight');
            await delay(300);
            this.el.emit('mouthPressRight');
            this.el.emit('squintCheekRight');
            await delay(400 * dur);
            this.el.emit('relaxMouthPressRight');
            this.el.emit('relaxSquintCheekRight');
            console.log('Press smile right');

        }else if(side == 'left'){
            this.el.emit('relaxMouthPressLeft');
            this.el.emit('relaxSquintCheekLeft');
            await delay(300);
            this.el.emit('mouthPressLeft');
            this.el.emit('squintCheekLeft');
            await delay(400 * dur);
            this.el.emit('relaxMouthPressLeft');
            this.el.emit('relaxSquintCheekLeft');
            console.log('Press smile left');

        }else{
            console.log('Press smile value not recognized');
        }
        
    },

    mouthOpen: async function (type, dur){
        if(dur == null){
            dur = 1;
        }else{
            //console.log('mouth open Dur = ' + dur);
        }

        //['neutral', 'angry']
        if(type == 'neutral'){
            this.el.emit('mouthNeutral');
            await delay(300);
            this.el.emit('mouthOpen');
            await delay(400 * dur);
            this.el.emit('mouthNeutral');
            console.log('Open mouth');

        }else if(type == 'angry'){
            this.el.emit('mouthNeutral');
            this.el.emit('noseNeutral');
            await delay(300);
            this.el.emit('mouthOpen');
            this.el.emit('noseSneer');
            this.el.emit('mouthUpperUp');
            this.el.emit('mouthLowerDown');
            await delay(400 * dur);
            this.el.emit('mouthNeutral');
            this.el.emit('noseNeutral');
            console.log('mouth open Angry');

        }else if(type == 'scared'){
            this.el.emit('mouthNeutral');
            this.el.emit('noseNeutral');
            await delay(300);
            this.el.setAttribute('animation__jawOpen', {   property: 'gltf-morph__jawOpen.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'jawOpen'});
            this.el.emit('jawOpen');
            this.el.emit('fullFrown');
            await delay(400 * dur);
            this.el.setAttribute('animation__jawOpen', {   property: 'gltf-morph__jawOpen.value', to: 1, loop: false, dur: 300, autoplay: false, startEvents: 'jawOpen'});
            this.el.emit('mouthNeutral');
            this.el.emit('jawNeutral');
            console.log('mouth open Scared');

        }else{
            console.log('Mouth open value not recognized');
        }
        
    },

    // State Functions
    idle: async function (){
        this.el.emit('eyesNeutral');
        this.el.emit('mouthNeutral');
        await delay(200);
        this.el.emit('mouthPress');
        this.el.emit('moveEyes', {value: 'blink', side: 'both', dur: 1});
        await delay(1000);
        this.el.emit('moveEyes', {value: 'blink', side: 'both', dur: 1});
        await delay(1000);
        this.el.emit('relaxMouthPressRight');
        this.el.emit('moveEyes', {value: 'look', side: 'bothRight', dur: 3});
        await delay(2000);
        this.el.emit('moveEyes', {value: 'blink', side: 'both', dur: 1});
        await delay(500);
        this.el.emit('relaxMouthPress');
        await delay(500);
        this.el.emit('moveEyes', {value: 'look', side: 'bothLeft', dur: 3});
        await delay(2500);
        this.el.emit('moveEyes', {value: 'squint', side: 'both', dur: 3});
        console.log('idle');
    },
});