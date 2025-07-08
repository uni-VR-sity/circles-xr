AFRAME.registerComponent('animated-cheeks', {
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

        //console.log("cheeks created!");

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

    // NOTE: we might try using transverse to try and make this shorter and look for morph targets and targetNames
    // here's an example: https://github.com/elbobo/aframe-gltf-morph-component/blob/master/dist/aframe-gltf-morph-component.js
    createMorphTargets: async function (context) {
        // cheek morph targets
        context.el.setAttribute('gltf-morph__cheekSquintRight', {morphtarget: 'cheekSquint_right', value: 0});
        context.el.setAttribute('gltf-morph__cheekSquintLeft', {morphtarget: 'cheekSquint_left', value: 0});
        context.el.setAttribute('gltf-morph__cheekPuff', {morphtarget: 'cheekPuff', value: 0});
        
        console.log("cheek morph targets created");
    },

    createAnimations: async function (context){
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
        context.el.setAttribute('animation__cheekPuff', {   property: 'gltf-morph__cheekPuff.value', 
                                                                to: 1, loop: false, dur: 300, autoplay: false,
                                                                startEvents: 'cheekPuff'});
        context.el.setAttribute('animation__relaxPuff', {   property: 'gltf-morph__cheekPuff.value', 
                                                                to: 0, loop: false, dur: 200, autoplay: false, 
                                                                startEvents: 'relaxPuff, mouthNeutral'});
        //console.log('cheek animations created');
    },
});