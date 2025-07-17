AFRAME.registerComponent('play-pause', {
    init: function () {
        const CONTEXT_AF = this;
        // get the 360 video and the play-pause element from the scene
        let videoShpere = document.querySelector('#video3D_main');
        let video = CONTEXT_AF.el.getAttribute('src');

        //let myAudio = document.querySelector('#video3D_snd');
        let videoControls = document.querySelector('#videoControls');
        //console.log("registered play-pause");
        
        // if we click on the play-pause button the image changes based what state you wnat to turn the video to 
        // (ex. plaing video shows pause image to pause, paused vidoe shows play image to play)
        this.el.addEventListener('click', function () {
            console.log("are we paused: " + video);
            if (videoShpere.paused) {
                videoShpere.play();
                //myAudio.play();
                videoControls.setAttribute('src', '#pause');
            } else {
                videoShpere.pause();
                //myAudio.pause();
                videoControls.setAttribute('src', '#play');
            }
        });
    }
})