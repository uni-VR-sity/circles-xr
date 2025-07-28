AFRAME.registerComponent('play-pause', {
    init: function () {
        const CONTEXT_AF = this;
        // get the 360 video and the play-pause element from the scene
        
        let videoSphere = document.querySelector('#video3D_main');
        let myVideoSrc = videoSphere.getAttribute('src');
        let myVideo = document.querySelector(myVideoSrc);

        //let myAudio = document.querySelector('#video3D_snd');
        let videoControls = document.querySelector('#videoControls');
        //console.log("registered play-pause");
        
        // if we click on the play-pause button the image changes based what state you wnat to turn the video to 
        // (ex. plaing video shows pause image to pause, paused vidoe shows play image to play)
        this.el.addEventListener('click', function () {
            //get the new video id if it changes
            myVideoSrc = videoSphere.getAttribute('src');
            myVideo = document.querySelector(myVideoSrc);
            
            //console.log("we clicked on the play button");
            if (myVideo.paused) {
                myVideo.play();
                //myAudio.play();
                videoControls.setAttribute('src', '#pause');
            } else {
                myVideo.pause();
                //myAudio.pause();
                videoControls.setAttribute('src', '#play');
            }
        });
    }
})