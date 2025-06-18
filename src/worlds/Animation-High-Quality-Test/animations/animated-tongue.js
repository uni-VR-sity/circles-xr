AFRAME.registerComponent('animated-tongue', {
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
        // tongue morph targets
        context.el.setAttribute('gltf-morph__tongueOut', {morphtarget: 'tongueOut', value: 0});
    },

    createAnimations: async function (context){
        // tongue animations
        context.el.setAttribute('animation__tongueOut', {   property: 'gltf-morph__tongueOut.value',
                                                                to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'tongueOut'});
        context.el.setAttribute('animation__tongueIn', {   property: 'gltf-morph__tongueOut.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'tongueIn, mouthClose'});
        //console.log('Finished creating tongue animations');
    },
    
});