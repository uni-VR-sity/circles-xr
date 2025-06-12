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
        context.el.setAttribute('animation__sil-1', { property: 'gltf-morph__mouthSmile.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-2', { property: 'gltf-morph__mouthPressRight.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-3', { property: 'gltf-morph__mouthPressLeft.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-4', { property: 'gltf-morph__mouthFrownRight.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-5', { property: 'gltf-morph__mouthFrownLeft.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-6', { property: 'gltf-morph__mouthLeft.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-7', { property: 'gltf-morph__mouthRight.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-8', { property: 'gltf-morph__mouthPucker.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-9', { property: 'gltf-morph__mouthFunnel.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-10', { property: 'gltf-morph__mouthStretchRight.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-11', { property: 'gltf-morph__mouthStretchLeft.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-12', { property: 'gltf-morph__mouthUpperUpRight.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-13', { property: 'gltf-morph__mouthUpperUpLeft.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-14', { property: 'gltf-morph__mouthRollUpper.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-15', { property: 'gltf-morph__mouthShrugUpper.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'}); 
        context.el.setAttribute('animation__sil-16', { property: 'gltf-morph__mouthLowerDownRight.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-17', { property: 'gltf-morph__mouthLowerDownLeft.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-18', { property: 'gltf-morph__mouthRollLower.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-19', { property: 'gltf-morph__mouthShrugLower.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-20', { property: 'gltf-morph__mouthOpen.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-21', { property: 'gltf-morph__mouthClose.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});

        context.el.setAttribute('animation__BMP-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-BMP'});
        context.el.setAttribute('animation__BMP-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-BMP'});                     
        context.el.setAttribute('animation__BMP-3', { property: 'gltf-morph__mouthRollUpper.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-BMP'});
        context.el.setAttribute('animation__BMP-4', { property: 'gltf-morph__mouthRollLower.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-BMP'});

        context.el.setAttribute('animation__FF-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});
        context.el.setAttribute('animation__FF-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});
        context.el.setAttribute('animation__FF-3', { property: 'gltf-morph__mouthUpperUpRight.value', to: 0.15, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});
        context.el.setAttribute('animation__FF-4', { property: 'gltf-morph__mouthUpperUpLeft.value', to: 0.15, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});
        context.el.setAttribute('animation__FF-5', { property: 'gltf-morph__mouthRollLower.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});
        context.el.setAttribute('animation__FF-6', { property: 'gltf-morph__mouthOpen.value', to: 0.15, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});

        context.el.setAttribute('animation__TH-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TH'});
        context.el.setAttribute('animation__TH-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TH'});                     
        context.el.setAttribute('animation__TH-3', { property: 'gltf-morph__mouthOpen.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TH'});
        context.el.setAttribute('animation__TH-4', { property: 'gltf-morph__mouthPucker.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TH'});

        context.el.setAttribute('animation__TLDN-1', { property: 'gltf-morph__mouthFunnel.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-TLDN'});
        context.el.setAttribute('animation__TLDN-2', { property: 'gltf-morph__mouthLowerDownRight.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-TLDN'});
        context.el.setAttribute('animation__TLDN-3', { property: 'gltf-morph__mouthLowerDownLeft.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-TLDN'});
        context.el.setAttribute('animation__TLDN-4', { property: 'gltf-morph__mouthOpen.value', to: 0.20, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TLDN'});

        context.el.setAttribute('animation__KK-1', { property: 'gltf-morph__mouthFunnel.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-KK'});
        context.el.setAttribute('animation__KK-2', { property: 'gltf-morph__mouthLowerDownRight.value', to: 0.6, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-KK'});
        context.el.setAttribute('animation__KK-3', { property: 'gltf-morph__mouthLowerDownLeft.value', to: 0.6, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-KK'});

        context.el.setAttribute('animation__CH-1', { property: 'gltf-morph__mouthFunnel.value', to: 0.75, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-CH'});
        context.el.setAttribute('animation__CH-2', { property: 'gltf-morph__mouthLowerDownRight.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-CH'});
        context.el.setAttribute('animation__CH-3', { property: 'gltf-morph__mouthLowerDownLeft.value', to: 0.5, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-CH'});
        
        context.el.setAttribute('animation__SS-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-3', { property: 'gltf-morph__mouthUpperUpRight.value', to: 0.15, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-4', { property: 'gltf-morph__mouthUpperUpLeft.value', to: 0.15, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-5', { property: 'gltf-morph__mouthLowerDownRight.value', to: 0.15, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-6', { property: 'gltf-morph__mouthLowerDownLeft.value', to: 0.15, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-7', { property: 'gltf-morph__mouthRollUpper.value', to: 0.2, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-8', { property: 'gltf-morph__mouthRollLower.value', to: 0.2, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});
        context.el.setAttribute('animation__SS-9', { property: 'gltf-morph__mouthOpen.value', to: 0.20, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});


        context.el.setAttribute('animation__RR-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-RR'});
        context.el.setAttribute('animation__RR-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-RR'});
        context.el.setAttribute('animation__RR-3', { property: 'gltf-morph__mouthOpen.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-RR'});
        
        context.el.setAttribute('animation__AA-1', { property: 'gltf-morph__mouthOpen.value', to: 0.75, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-AA'});

        context.el.setAttribute('animation__E-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-E'});
        context.el.setAttribute('animation__E-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.25, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-E'});
        context.el.setAttribute('animation__E-3', { property: 'gltf-morph__mouthOpen.value', to: 0.6, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-E'});

        context.el.setAttribute('animation__I-1', { property: 'gltf-morph__mouthPressLeft.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-I'});
        context.el.setAttribute('animation__I-2', { property: 'gltf-morph__mouthPressRight.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-I'});
        context.el.setAttribute('animation__I-3', { property: 'gltf-morph__mouthOpen.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-I'});
        
        context.el.setAttribute('animation__O-1', { property: 'gltf-morph__mouthOpen.value', to: 0.6, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-O'});
        context.el.setAttribute('animation__O-2', { property: 'gltf-morph__mouthPucker.value', to: 0.5, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-O'});
        
        context.el.setAttribute('animation__U-1', { property: 'gltf-morph__mouthOpen.value', to: 0.3, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-U'});
        context.el.setAttribute('animation__U-2', { property: 'gltf-morph__mouthPucker.value', to: 0.7, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-U'});
        
        //console.log('Finished creating mouth animations');
    },
});