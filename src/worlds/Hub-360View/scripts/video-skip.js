AFRAME.registerComponent('video-skip', {
    init: function () {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');
        
        // we need to use CONTEXT_AF so that these variables can be used in the other functions (ex. switchVideo)
        // by doing this, it makes it a component property and therfore making it accessible to other methods
        CONTEXT_AF.fadeSphere = document.querySelector('#fadeSphere');
        CONTEXT_AF.videoSphere = document.querySelector('#video3D_main');
        CONTEXT_AF.videoSrc = CONTEXT_AF.videoSphere.getAttribute('src');
        //for some reason we need to do a document querySelector to pause the vidoe, we can't just used the src directly
        CONTEXT_AF.video = document.querySelector(CONTEXT_AF.videoSrc);
        CONTEXT_AF.videoNum = 0;

        // Note: remember to not have capital letters in component names!
        //console.log("vidoe3d swap is registered");

        // when we click on the mini video sphere, it replaces the main big video with the video in the mini sphere
        this.el.addEventListener('click', function () {
            console.log(fadeSphere);
            //get the new video id if it changes
            CONTEXT_AF.videoSrc = CONTEXT_AF.videoSphere.getAttribute('src');
            CONTEXT_AF.video = document.querySelector(CONTEXT_AF.videoSrc);
            
            // Configure the animation
            CONTEXT_AF.fadeSphere.setAttribute('animation__fadeIn', {   property: 'material.opacity', from: 0, to: 1, loop: false, dur: 500, autoplay: false, startEvents: 'fadein'});
            CONTEXT_AF.fadeSphere.setAttribute('animation__fadeOut', {   property: 'material.opacity', from: 1, to: 0, loop: false, dur: 500, autoplay: false, startEvents: 'fadeout'});
            //trigger animation
            if (CONTEXT_AF.fadeSphere.getAttribute('material').opacity == 0) {
                CONTEXT_AF.video.pause();
                CONTEXT_AF.fadeSphere.emit('fadein');
            } else {
                CONTEXT_AF.fadeSphere.emit('fadeout');
                // switch the video
                CONTEXT_AF.videoNum = (CONTEXT_AF.videoNum + 1) % 2;
                CONTEXT_AF.switchVideo(CONTEXT_AF.videoNum);
            }
        });
    },
    switchVideo: function (videoIndex) {
        const videoClips = ['#video3D', '#video3D_2'];
        const clip = videoClips[videoIndex];
        if (clip) {
            this.videoSphere.setAttribute('src', clip);
        } else {
            console.log("Clip index out of range");
        }
            CONTEXT_AF.video = document.querySelector(CONTEXT_AF.videoSrc);
    }

})