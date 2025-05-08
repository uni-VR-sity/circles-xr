AFRAME.registerComponent('play-pause', {
    init: function () {
        // get the 360 video and the play-pause element from the scene
        let myVideo = document.querySelector('#video3D');
        let videoControls = document.querySelector('#videoControls');
        //console.log("registered play-pause");
        
        // if we click on the play-pause button the image changes based what state you wnat to turn the video to 
        // (ex. plaing video shows pause image to pause, paused vidoe shows play image to play)
        this.el.addEventListener('click', function () {
            //console.log("we clicked on the play button");
            if (myVideo.paused) {
                myVideo.play();
                videoControls.setAttribute('src', '#pause');
            } else {
                myVideo.pause();
                videoControls.setAttribute('src', '#play');
            }
        });
    }
})