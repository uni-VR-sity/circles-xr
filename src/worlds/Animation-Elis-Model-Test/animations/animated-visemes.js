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
        context.el.setAttribute('animation__sil-1', { property: 'morph-targets__aa02.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-2', { property: 'morph-targets__aa_ah_ax_01.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-3', { property: 'morph-targets__ao_03.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-4', { property: 'morph-targets__aw_09.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-5', { property: 'morph-targets__ay_11.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-6', { property: 'morph-targets__d_t_n_19.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-7', { property: 'morph-targets__er_05.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-8', { property: 'morph-targets__ey_eh_uh_04.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-9', { property: 'morph-targets__f_v_18.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-10', { property: 'morph-targets__h_12.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-11', { property: 'morph-targets__k_g_ng_20.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-12', { property: 'morph-targets__l_14.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-13', { property: 'morph-targets__ow_08.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-14', { property: 'morph-targets__oy_10.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-15', { property: 'morph-targets__p_b_m_21.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-16', { property: 'morph-targets__r_13.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-17', { property: 'morph-targets__s_z_15.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-18', { property: 'morph-targets__sh_ch_jh_zh_16.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-19', { property: 'morph-targets__th_dh_17.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-20', { property: 'morph-targets__w_uw_07.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});
        context.el.setAttribute('animation__sil-21', { property: 'morph-targets__y_iy_ih_ix_06.value', to: 0, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-sil'});


        context.el.setAttribute('animation__BMP-1', { property: 'morph-targets__p_b_m_21.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-BMP'});

        context.el.setAttribute('animation__FF-1', { property: 'morph-targets__f_v_18.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-FF'});

        context.el.setAttribute('animation__TH-1', { property: 'morph-targets__th_dh_17.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-TH'});

        context.el.setAttribute('animation__TLDN-1', { property: 'morph-targets__d_t_n_19.value', to: 1, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-TLDN'});
        
        context.el.setAttribute('animation__KK-1', { property: 'morph-targets__k_g_ng_20.value', to: 1, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-KK'});
       
        context.el.setAttribute('animation__CH-1', { property: 'morph-targets__sh_ch_jh_zh_16.value', to: 1, loop: false, dur: 300, autoplay: false, startEvents: 'viseme-CH'});
        
        context.el.setAttribute('animation__SS-1', { property: 'morph-targets__s_z_15.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-SS'});

        context.el.setAttribute('animation__RR-1', { property: 'morph-targets__r_13.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-RR'});
        
        context.el.setAttribute('animation__AA-1', { property: 'morph-targets__aa02.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-AA'});

        context.el.setAttribute('animation__E-1', { property: 'morph-targets__ey_eh_uh_04.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-E'});

        context.el.setAttribute('animation__I-1', { property: 'morph-targets__y_iy_ih_ix_06.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-I'});
        
        context.el.setAttribute('animation__O-1', { property: 'morph-targets__ow_08.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-O'});
        
        context.el.setAttribute('animation__U-1', { property: 'morph-targets__w_uw_07.value', to: 1, loop: false, dur: 100, autoplay: false, startEvents: 'viseme-U'});
        
        //console.log('Finished creating mouth animations');
    },
});