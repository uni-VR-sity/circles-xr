'use strict';

AFRAME.registerComponent('circles-checkpoint', {
    schema: {
        offset:             {type:'vec3', default:{x: 0, y: 0, z: 0}},   //where the user spawns, relative to the position of the checkpoint
        useDefaultModel:    {type:'boolean', default:true},
        modelRadius:        {type:'number', default:0.5},
        modelHeight:        {type:'number', default:0.04},
        modelColor:         {type:'string', default:'rgb(57, 187, 130)'},
        modelEmissive:      {type:'string', default:'rgb(7,137,80)'},
        modelRoughness:     {type:'number', default:0.8},
        modelMetalness:     {type:'number', default:0},
        onClickSound:       {type:'string', default:''},
        soundVolume:        {type:'number', default:0.5},
    },

    init: function () {
        const CONTEXT_AF = this;

        CONTEXT_AF.interactionType = 'outline';

        if (!CONTEXT_AF.el.classList.contains('checkpoint')) {
            CONTEXT_AF.el.classList.add('checkpoint');
        }
    },
    update : function(oldData) {
        const CONTEXT_AF = this;
        const data = this.data;

        if ( (oldData.offset !== data.offset) && (data.offset !== '') ) {
            CONTEXT_AF.el.setAttribute('checkpoint', {offset:CONTEXT_AF.data.offset});
        }

        if (data.useDefaultModel == '') return;

        if (oldData.useDefaultModel !== data.useDefaultModel) {
            CONTEXT_AF.setDefaultModel(data.useDefaultModel);
        }

        if ( (oldData.onClickSound !== data.onClickSound) || (oldData.soundVolume !== data.soundVolume) ) {
            let interactionType = (data.useDefaultModel) ? ('outline') : ('none');
            CONTEXT_AF.setInteractiveObject(CONTEXT_AF.setInteractiveObject(interactionType));
        }
    },
    setDefaultModel : function(useDefaultModel) {
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;
        
        if (useDefaultModel) {
            //create default checkpoint model
            CONTEXT_AF.el.setAttribute('material', {color:data.modelColor, emissive:data.modelEmissive, roughness:data.modelRoughness, metalness:data.modelMetalness});
            CONTEXT_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:data.modelRadius, height:data.modelHeight});
            
            CONTEXT_AF.setInteractiveObject('outline');
        }
        else {
            CONTEXT_AF.el.removeAttribute('material');
            CONTEXT_AF.el.removeAttribute('geometry');
            
            CONTEXT_AF.setInteractiveObject('none');
        }
    },
    setInteractiveObject: function(interactionType) {
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;

        CONTEXT_AF.el.setAttribute('circles-interactive-object', {
            type: interactionType,
            click_sound: data.onClickSound,
            sound_volume: data.soundVolume,
        });
    }
});