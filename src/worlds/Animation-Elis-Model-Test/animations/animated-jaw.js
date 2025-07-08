AFRAME.registerComponent('animated-jaw', {
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
                //console.log('*Unknown ActiveState*');
        }
    },

    createMorphTargets: async function (context){
        // jaw morph targets
        context.el.setAttribute('gltf-morph__jawForward', {morphtarget: 'JawFwd', value: 0});
        context.el.setAttribute('gltf-morph__jawOpen', {morphtarget: 'JawOpen', value: 0});
        context.el.setAttribute('gltf-morph__jawRight', {morphtarget: 'JawRight', value: 0});
        context.el.setAttribute('gltf-morph__jawLeft', {morphtarget: 'JawLeft', value: 0});

        console.log("jaw morph targets created");
    },

    createAnimations: async function (context){
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
    },

});