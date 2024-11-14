'use strict';

AFRAME.registerComponent('animated-face', {
    schema: {
        name:              {type:'string',     default:'no_name_set'},
    },
    init: function(){
        const CONTEXT_AF  = this;
        const data        = this.data;

        //animation-timeline__1="timeline: #myTimeline"

        //document.getElementById('scene').setAttribute('animation-timeline__1', {timeline: '#myTimeLine'});
        // Add the morph targets attached to the model 
        // *The model must have all the required shape keys for this to work*
        CONTEXT_AF.el.setAttribute('gltf-morph__eyesClosed', {morphtarget: 'eyesClosed', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeSquintRight', {morphtarget: 'eyeSquint_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeSquintLeft', {morphtarget: 'eyeSquint_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeWideRight', {morphtarget: 'eyeWide_right', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__eyeWideLeft', {morphtarget: 'eyeWide_left', value: 0});
        CONTEXT_AF.el.setAttribute('gltf-morph__mouthSmile', {morphtarget: 'mouthSmile', value: 0});

        // Add the animations to trigger the morphtargets
        CONTEXT_AF.el.setAttribute('animation__eyesClosed', {   property: 'gltf-morph__eyesClosed.value', 
                                                                from: 0, to: 1, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'closeEyes'});
        CONTEXT_AF.el.setAttribute('animation__eyesOpen', {   property: 'gltf-morph__eyesClosed.value', 
                                                                from: 1, to: 0, loop: false, dur: 300, autoplay: false, 
                                                                startEvents: 'openEyes'});
        CONTEXT_AF.el.setAttribute('animation__mouthSmile', {   property: 'gltf-morph__mouthSmile.value',
                                                                from: 0, to: 1, loop: false, dur: 1000, autoplay: false, 
                                                                startEvents: 'fullSmile'});
        CONTEXT_AF.el.setAttribute('animation__relaxSmile', {   property: 'gltf-morph__mouthSmile.value', 
                                                                from: 1, to: 0, loop: false, dur: 1000, autoplay: false, 
                                                                startEvents: 'relaxSmile'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintRight', {   property: 'gltf-morph__eyeSquintRight.value', 
                                                                from: 0, to: 1, loop: false, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeSquintLeft', {   property: 'gltf-morph__eyeSquintLeft.value', 
                                                                from: 0, to: 1, loop: false, autoplay: false,
                                                                startEvents: 'squintEyes, squintEyeLeft'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideRight', {   property: 'gltf-morph__eyeWideRight.value', 
                                                                from: 0, to: 1, loop: false, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeRight'});
        CONTEXT_AF.el.setAttribute('animation__eyeWideLeft', {   property: 'gltf-morph__eyeWideLeft.value', 
                                                                from: 0, to: 1, loop: false, autoplay: false,
                                                                startEvents: 'wideEyes, wideEyeLeft'});
    },
})