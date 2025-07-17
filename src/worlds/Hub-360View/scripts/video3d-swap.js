AFRAME.registerComponent('video3d-swap', {
    init: function () {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');
        
        let mainVideo = document.querySelector('#video3D_main');
        let miniVideo = CONTEXT_AF.el.getAttribute('src');
        
        // Note: remember to not have capital letters in component names!
        //console.log("vidoe3d swap is registered");

        // when we click on the mini video sphere, it replaces the main big video with the video in the mini sphere
        this.el.addEventListener('click', function () {
            //console.log(miniVideo);
            mainVideo.setAttribute('src', miniVideo);
        });
    }
})