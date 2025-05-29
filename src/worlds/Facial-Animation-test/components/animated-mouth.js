AFRAME.registerComponent('animated-mouth', {
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
        //document.getElementById('scene').setAttribute('animation-timeline__1', {timeline: '#myTimeLine'});
        // Add the morph targets attached to the model 
        // *The model must have all the required shape keys for this to work*
        CONTEXT_AF.createMorphTargets(CONTEXT_AF);

        // Add the animations to trigger the morphtargets
        CONTEXT_AF.createAnimations(CONTEXT_AF);

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

      createMorphTargets: async function (context){
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
    },

    createAnimations: async function (context){
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
});