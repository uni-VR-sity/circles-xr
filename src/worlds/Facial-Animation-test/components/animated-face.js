'use strict';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

AFRAME.registerComponent('animated-face', {
    schema: {
        id:                             {type:'string',    default:'no_id_set'},
        morph_eyeBlinkRight:            {type:'float',     default:            0},
        morph_eyeBlinkLeft:             {type:'float',     default:            0},
        morph_eyesClosed:               {type:'float',     default:            0},
    },
    init: function(){
        const CONTEXT_AF  = this;
        const data        = this.data;

        data.id = CONTEXT_AF.el.id;

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
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'closeEyes'});
        CONTEXT_AF.el.setAttribute('animation__eyeBlinkRight', {   property: 'gltf-morph__eyeBlinkRight.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'blinkEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeBlinkLeft', {   property: 'gltf-morph__eyeBlinkLeft.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'blinkEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyesOpen', {   property: 'gltf-morph__eyesClosed.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'openEyes'});
        CONTEXT_AF.el.setAttribute('animation__eyeOpenRight', {   property: 'gltf-morph__eyeBlinkRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'openEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeOpenLeft', {   property: 'gltf-morph__eyeBlinkLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'openEyeLeft'});

        CONTEXT_AF.el.setAttribute('animation__eyeSquintRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintRelaxRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'relaxSquintEyes, relaxSquintEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintRelaxLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'relaxSquintEyes, relaxSquintEyeLeft'});

        CONTEXT_AF.el.setAttribute('animation__cheekSquintRight', {   property: 'gltf-morph__cheekSquintRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'squintCheeks, squintCheekRight'});
        CONTEXT_AF.el.setAttribute('animation__cheekSquintLeft', {   property: 'gltf-morph__cheekSquintLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'squintCheeks, squintCheekLeft'});
        CONTEXT_AF.el.setAttribute('animation__cheekSquintRelaxRight', {   property: 'gltf-morph__cheekSquintRight.value', 
                                                                to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'relaxSquintCheeks, relaxSquintCheekRight'});
        CONTEXT_AF.el.setAttribute('animation__cheekSquintRelaxLeft', {   property: 'gltf-morph__cheekSquintLeft.value', 
                                                                to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'relaxSquintCheeks, relaxSquintCheekLeft'});

        CONTEXT_AF.el.setAttribute('animation__eyeWideRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideNeutralRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'wideEyesNeutral, wideEyeNeutralRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideNeutralLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                to: 0, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'wideEyesNeutral, wideEyeNeutralLeft'});
        
        // Look directions
        CONTEXT_AF.el.setAttribute('animation__eyesLookUp', {   property: 'gltf-morph__eyesLookUp.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyesLookUp'});
        CONTEXT_AF.el.setAttribute('animation__eyesLookUpNeutral', {   property: 'gltf-morph__eyesLookUp.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyesLookUpNeutral'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpRight', {   property: 'gltf-morph__eyeLookUpRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookUpRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpNeutralRight', {   property: 'gltf-morph__eyeLookUpRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookUpNeutralRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpLeft', {   property: 'gltf-morph__eyeLookUpLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookUpLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookUpNeutralLeft', {   property: 'gltf-morph__eyeLookUpLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookUpNeutralLeft'});

        CONTEXT_AF.el.setAttribute('animation__eyesLookDown', {   property: 'gltf-morph__eyesLookDown.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyesLookDown'});
        CONTEXT_AF.el.setAttribute('animation__eyesLookDownNeutral', {   property: 'gltf-morph__eyesLookDown.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyesLookDownNeutral'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownRight', {   property: 'gltf-morph__eyeLookDownRight.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookDownRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownNeutralRight', {   property: 'gltf-morph__eyeLookDownRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookDownNeutralRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownLeft', {   property: 'gltf-morph__eyeLookDownLeft.value', 
                                                                to: 1, loop: false, dur: 500, autoplay: false,
                                                                startEvents: 'eyeLookDownLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeLookDownNeutralLeft', {   property: 'gltf-morph__eyeLookDownLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false,
                                                                startEvents: 'eyeLookDownNeutralLeft'});
        
        // mouth animations
        CONTEXT_AF.el.setAttribute('animation__mouthSmile', {   property: 'gltf-morph__mouthSmile.value',
                                                                to: 1, loop: false, dur: 500, autoplay: false, 
                                                                startEvents: 'fullSmile'});
        CONTEXT_AF.el.setAttribute('animation__relaxSmile', {   property: 'gltf-morph__mouthSmile.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxSmile'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressRight', {   property: 'gltf-morph__mouthPressRight.value',
                                                                to: 1, loop: false, dur: 500, autoplay: false, 
                                                                startEvents: 'mouthPress, mouthPressRight'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressRelaxRight', {   property: 'gltf-morph__mouthPressRight.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxMouthPress, relaxMouthPressRight'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressLeft', {   property: 'gltf-morph__mouthPressLeft.value',
                                                                to: 1, loop: false, dur: 500, autoplay: false, 
                                                                startEvents: 'mouthPress, mouthPressLeft'});
        CONTEXT_AF.el.setAttribute('animation__mouthPressRelaxLeft', {   property: 'gltf-morph__mouthPressLeft.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxMouthPress, relaxMouthPressLeft'});


        CONTEXT_AF.el.addEventListener('moveEyes', function(evt){

            switch(evt.detail.value){

                case 'neutralize':
                    CONTEXT_AF.neutralizeEyes();

                    break;

                case 'blink':
                    CONTEXT_AF.closeEyes(evt.detail.side, evt.detail.dur);

                    break;

                case 'roll':
                    CONTEXT_AF.rollEyes(evt.detail.side, evt.detail.dur);

                    break;

                default:
                    console.log('*Unknown Eye Movement*');
            }
        });

        CONTEXT_AF.el.addEventListener('moveMouth', function(evt){

            switch(evt.detail.value){

                case 'neutralize':
                    CONTEXT_AF.neutralizeMouth();

                    break;

                case 'fullSmile':
                    CONTEXT_AF.fullSmile();

                    break;

                case 'pressSmile':
                    CONTEXT_AF.pressSmile(evt.detail.side, evt.detail.dur);

                    break;

                default:
                    console.log('*Unknown Eye Movement*');
            }
        });
    },

    update: function(oldData){
        const CONTEXT_AF  = this;
        const data        = this.data;
        
        if(oldData.morph_eyesClosed !== data.morph_eyesClosed){
            document.getElementById('baseFace').setAttribute('gltf-morph__eyesClosed', { value: data.morph_eyesClosed});

            console.log('eyesClosed updated');
        }
        
    },

    neutralizeEyes: async function (){
        this.el.emit('wideEyesNeutral');
        this.el.emit('openEyes');
        this.el.emit('openEyeRight');
        this.el.emit('openEyeLeft');
        this.el.emit('relaxSquintEyes');
        this.el.emit('eyesLookUpNeutral');
        this.el.emit('eyeLookUpNeutralRight');
        this.el.emit('eyeLookUpNeutralLeft');
        this.el.emit('eyesLookDownNeutral');
        this.el.emit('eyeLookDownNeutralRight');
        this.el.emit('eyeLookDownNeutralLeft');
        
        console.log('Neutral eyes');
    },

    neutralizeMouth: async function (){
        this.el.emit('relaxSmile');
        this.el.emit('relaxMouthPress');
        this.el.emit('relaxMouthPressRight');
        this.el.emit('relaxMouthPressLeft');
        this.el.emit('relaxSquintCheeks');
        this.el.emit('relaxSquintCheekRight');
        this.el.emit('relaxSquintCheekLeft');
        
        console.log('Neutral mouth');
    },

    closeEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            console.log('closeEyes Dur = ' + dur);
        }

        if(side == 'both'){
            this.neutralizeEyes();
            await delay(300);
            this.el.emit('closeEyes');
            await delay(400 * dur);
            this.neutralizeEyes();
            console.log('Blink eyes');

        }else if(side == 'right'){
            this.neutralizeEyes();
            await delay(300);
            this.el.emit('blinkEyeRight');
            await delay(400 * dur);
            this.el.emit('openEyeRight');
            console.log('Blink right eye');

        }else if(side == 'left'){
            this.neutralizeEyes();
            await delay(300);
            this.el.emit('blinkEyeLeft');
            await delay(400 * dur);
            this.el.emit('openEyeLeft');
            console.log('Blink left eye');

        }
        
    },

    rollEyes: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            console.log('rollEyes Dur = ' + dur);
        }

        if(side == 'both'){
            this.neutralizeEyes();
            await delay(300);
            this.el.emit('eyesLookUp');
            await delay(500);
            this.el.emit('eyesLookDown');
            await delay(200 * dur);
            this.el.emit('eyesLookUpNeutral');
            await delay((200 * dur)+ 300);
            this.el.emit('eyesLookDownNeutral');
            console.log('Roll eyes');

        }else if(side == 'right'){
            this.neutralizeEyes();
            await delay(300);
            this.el.emit('eyeLookUpRight');
            await delay(500);
            this.el.emit('eyeLookDownRight');
            await delay(200 * dur);
            this.el.emit('eyeLookUpNeutralRight');
            await delay((200 * dur)+ 300);
            this.el.emit('eyeLookDownNeutralRight');
            console.log('Roll right eye');

        }else if(side == 'left'){
            this.neutralizeEyes();
            await delay(300);
            this.el.emit('eyeLookUpLeft');
            await delay(500);
            this.el.emit('eyeLookDownLeft');
            await delay(200 * dur);
            this.el.emit('eyeLookUpNeutralLeft');
            await delay((200 * dur)+ 300);
            this.el.emit('eyeLookDownNeutralLeft');
            console.log('Roll left eye');

        }
        
    },

    fullSmile: async function (){
        this.neutralizeMouth();
        await delay(200);
        this.el.emit('fullSmile');
        await delay(400);
        this.neutralizeMouth();
        console.log('Blink eyes');
    },

    pressSmile: async function (side, dur){
        if(dur == null){
            dur = 1;
        }else{
            console.log('rollEyes Dur = ' + dur);
        }

        if(side == 'both'){
            this.neutralizeMouth();
            await delay(200);
            this.el.emit('mouthPress');
            this.el.emit('squintCheeks');
            await delay(600 * dur);
            this.neutralizeMouth();
            console.log('Press smile');

        }else if(side == 'right'){
            this.el.emit('relaxMouthPressRight');
            this.el.emit('relaxSquintCheekRight');
            await delay(200);
            this.el.emit('mouthPressRight');
            this.el.emit('squintCheekRight');
            await delay(600 * dur);
            this.el.emit('relaxMouthPressRight');
            this.el.emit('relaxSquintCheekRight');
            console.log('Press smile right');

        }else if(side == 'left'){
            this.el.emit('relaxMouthPressLeft');
            this.el.emit('relaxSquintCheekLeft');
            await delay(200);
            this.el.emit('mouthPressLeft');
            this.el.emit('squintCheekLeft');
            await delay(600 * dur);
            this.el.emit('relaxMouthPressLeft');
            this.el.emit('relaxSquintCheekLeft');
            console.log('Press smile left');

        }
        
    },
});