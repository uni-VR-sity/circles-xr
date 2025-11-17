'use strict';

AFRAME.registerComponent('circles-autoplay-media', {
    init: function() {
        // Listening for user to enter the experience
        document.addEventListener(CIRCLES.EVENTS.EXPERIENCE_ENTERED, function() {
            
            // Start all autoplay music
            const autoplaySounds = document.querySelectorAll('.autoplay-sound');
            autoplaySounds.forEach(function(soundEntity) {
                if (soundEntity.components['circle-sound']) {
                    soundEntity.setAttribute('circles-sound', {state:'play'});
                }
                else if (soundEntity.components['sound']) {
                    soundEntity.components['sound'].playSound();
                }
            });

            // Start all autoplay videos
            const autoplayVideos = document.querySelectorAll('.autoplay-video');
            autoplayVideos.forEach(function(videoEntity) {
                document.querySelector(videoEntity.getAttribute('src')).play();
            });
        });
    }
});