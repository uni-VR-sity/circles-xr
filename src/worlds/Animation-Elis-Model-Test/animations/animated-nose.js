AFRAME.registerComponent('animated-nose', {
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

        //console.log('nose-created!');

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
                //console.log('*Set null ActiveState*');

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
        // nose morph targets
        context.el.setAttribute('gltf-morph__noseSneerRight', {morphtarget: 'noseSneer_right', value: 0});
        context.el.setAttribute('gltf-morph__noseSneerLeft', {morphtarget: 'noseSneer_left', value: 0});
        
        console.log('nose morph targets created!');
    },

    createAnimations: async function (context){
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
    },
});