AFRAME.registerComponent('animated-visemes', {
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
        
        // We don't need to create new morph targets since the mouth component already makes them

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

    createAnimations: async function (context){
        // Viseme animations
        context.el.setAttribute('animation__sil-1', { property: 'morph-targets__BMP.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-2', { property: 'morph-targets__FF.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-3', { property: 'morph-targets__TH.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-4', { property: 'morph-targets__TLDN.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-5', { property: 'morph-targets__KK.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-6', { property: 'morph-targets__CH.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-7', { property: 'morph-targets__SS.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-8', { property: 'morph-targets__RR.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-9', { property: 'morph-targets__AA.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-10', { property: 'morph-targets__E.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-11', { property: 'morph-targets__I.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-12', { property: 'morph-targets__O.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-13', { property: 'morph-targets__U.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});

        context.el.setAttribute('animation__BMP', { property: 'morph-targets__BMP.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-BMP'});

        context.el.setAttribute('animation__FF', { property: 'morph-targets__FF.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});

        context.el.setAttribute('animation__TH', { property: 'morph-targets__TH.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TH'});

        context.el.setAttribute('animation__TLDN', { property: 'morph-targets__TLDN.value', to: 0.75, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-TLDN'});

        context.el.setAttribute('animation__KK', { property: 'morph-targets__KK.value', to: 0.75, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-KK'});

        context.el.setAttribute('animation__CH', { property: 'morph-targets__CH.value', to: 0.75, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-CH'});
        
        context.el.setAttribute('animation__SS', { property: 'morph-targets__SS.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});

        context.el.setAttribute('animation__RR', { property: 'morph-targets__RR.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-RR'});
        
        context.el.setAttribute('animation__AA', { property: 'morph-targets__AA.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-AA'});

        context.el.setAttribute('animation__E', { property: 'morph-targets__E.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-E'});

        context.el.setAttribute('animation__I', { property: 'morph-targets__I.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-I'});
        
        context.el.setAttribute('animation__O', { property: 'morph-targets__O.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-O'});
        
        context.el.setAttribute('animation__U', { property: 'morph-targets__U.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-U'});
        
        //console.log('Finished creating mouth animations');
    },
});