AFRAME.registerComponent('animated-brows', {
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


        CONTEXT_AF.el.addEventListener('moveEyes', function(evt){

            switch(evt.detail.value){

                case 'angry':
                    CONTEXT_AF.browsAngry(evt.detail.side, evt.detail.dur);

                    break;

                case 'scared':
                    CONTEXT_AF.browsScared(evt.detail.dur);

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

    createMorphTargets: async function (context) {
        // brow morph targets
        context.el.setAttribute('gltf-morph__browInnerUp', {morphtarget: 'browInnerUp', value: 0});
        context.el.setAttribute('gltf-morph__browDownRight', {morphtarget: 'browDown_right', value: 0});
        context.el.setAttribute('gltf-morph__browDownLeft', {morphtarget: 'browDown_left', value: 0});
        context.el.setAttribute('gltf-morph__browOuterUpRight', {morphtarget: 'browOuterUp_right', value: 0});
        context.el.setAttribute('gltf-morph__browOuterUpLeft', {morphtarget: 'browOuterUp_left', value: 0});
        // QUESTION: do we want browDown + browOuterUp too?
        
        console.log("eye morph targets created");
    },

    createAnimations: async function (context){                                                                
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
        //console.log('Finished creating brow animations');
        console.log('finished creating brow animations! - in eyes');
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
});