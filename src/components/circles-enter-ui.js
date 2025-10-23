'use strict';

AFRAME.registerComponent('circles-enter-ui', 
{
    init: function() 
    {
        //we can't play sound on some browsers until we have some user interaction
        //this means we should only start playing ambient music after this button is clicked
        //moved the following code into the onConnect NAF fundtion in circles_end_scripts.js file as the mic diable/enable button doesn't work until then.

        if (CIRCLES.CONSTANTS.CIRCLES_WEBRTC_ENABLED && CIRCLES.CONSTANTS.CIRCLES_MIC_ENABLED)
        {
            let micOn = false;
            const toggleMicFunc = (enable) =>
            {
                micOn = enable;
                if (micOn)
                {
                    console.log('enabling microphone');
                    NAF.connection.adapter.enableMicrophone(true);
                    document.querySelector('#button_microphone').style.backgroundImage = "url('/global/images/microphone_on.png')";
                }
                else
                {
                    console.log('disabling microphone');
                    NAF.connection.adapter.enableMicrophone(false);
                    document.querySelector('#button_microphone').style.backgroundImage = "url('/global/images/microphone_off.png')";
                }
            }

            //add click listener for starting settings
            const switch_mic = document.querySelector('#switch_mic');
            switch_mic.addEventListener('click', function()
            {
                toggleMicFunc(switch_mic.checked);
            });

            //click listener button
            document.querySelector('#button_microphone').addEventListener('click', function()
            {
                toggleMicFunc(!micOn);
            });
        }

        //add listener to 'y' button on oculus-touch-controllers for now
        const controlElems = document.querySelectorAll('[hand-controls]');
        if (controlElems)
        {
            controlElems.forEach((controlElem) =>
            {
                controlElem.addEventListener('ybuttonup', function(e)
                {
                    toggleMicFunc(!micOn);
                });
            });
        }

        const startAmbientSounds = function()
        {            
            //start all autoplay/ambient music
            const ambientSounds = document.querySelectorAll('.autoplay-sound');
            ambientSounds.forEach(function(soundEntity)
            {
                if (soundEntity.components['circle-sound'])
                {
                    soundEntity.setAttribute('circles-sound', {state:'play'});
                }
                else if (soundEntity.components['sound'])
                {
                    soundEntity.components['sound'].playSound();
                }
            });
        };

        const startAmbientVideos = function()
        {            
            //start all autoplay/ambient videos
            const ambientVideos = document.querySelectorAll('.autoplay-video');
            ambientVideos.forEach(function(videoEntity)
            {
                document.querySelector(videoEntity.getAttribute('src')).play();
            });
        };

        //clicking on enter circles removes Ui and starts sounds (as most web browsers need a user gesture to start sound)
        document.querySelector('#user-gesture-enter').addEventListener('click', function()
        {
            document.querySelector('#user-gesture-overlay').style.display='none';   //hide user-gesture overlay
            document.querySelector('#ui_wrapper').style.display='block';            //show "extra" controls i.e. microphone toggle
            
            //start all autoplay/ambient music and videos
            startAmbientSounds();
            startAmbientVideos();

            //let everyone know that the circles experience has been entered
            CIRCLES.getCirclesManagerComp().experienceEntered();
        });

        // Simulate click on #user-gesture-enter if devmode=true in URL, after event listener is attached
        const params = new URLSearchParams(window.location.search);
        if (params.get('devmode') === 'true')
        {
            setTimeout(() =>
            {
                const enterCirclesButton = document.getElementById('user-gesture-enter');
                if (enterCirclesButton) 
                {
                    enterCirclesButton.click();

                    //start all autoplay/ambient music and videos
                    startAmbientSounds();
                    startAmbientVideos();
                }
            }, 0);
        }

        //I think we need to play sounds if on HMD VR anyhow, as the HTML UI may not be present when using portals
        if (AFRAME.utils.device.isMobileVR())
        {
            startAmbientSounds();
            startAmbientVideos();
            CIRCLES.getCirclesManagerComp().experienceEntered();
        }

        //clicking on customize avatar brings user to wardobe world
        let wardobeButton = document.querySelector('#wardrobe-enter');
        if (wardobeButton)
        {
            wardobeButton.addEventListener('click', function()
            {
                //goto url (but make sure we pass along the url params for group, avatar data etc.)
                //add last_route
                const params_orig = new URLSearchParams(window.location.search);
                if (!params_orig.has('last_route'))
                {
                    params_orig.append('last_route', window.location.pathname);
                }
                else
                {
                    params_orig.set('last_route', window.location.pathname);
                }
    
                window.location.href = '/w/Wardrobe?' + params_orig.toString();
            });
        }
    }
});