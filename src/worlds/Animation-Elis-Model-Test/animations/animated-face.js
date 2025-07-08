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
        CONTEXT_AF.el.setAttribute('animated-brows', {});
        CONTEXT_AF.el.setAttribute('animated-cheeks', {});
        CONTEXT_AF.el.setAttribute('animated-nose', {});
        CONTEXT_AF.el.setAttribute('animated-mouth', {});
        CONTEXT_AF.el.setAttribute('animated-jaw', {});
        CONTEXT_AF.el.setAttribute('animated-tongue', {});
        CONTEXT_AF.el.setAttribute('animated-visemes', {});
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