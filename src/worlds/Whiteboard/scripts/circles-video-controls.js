'use strict';

// Generates video controls

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Uploading assets for video controller
const uploadVideoAssets = function()
{
    // Getting Asset Management System
    var assetManager = document.getElementsByTagName('a-assets')[0];

    // Pause symbol
    var pause = document.createElement('img');
    pause.setAttribute('id', 'pause_symbol');
    pause.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/pause.svg');

    assetManager.appendChild(pause);

    // Play symbol
    var play = document.createElement('img');
    play.setAttribute('id', 'play_symbol');
    play.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/play.svg');

    assetManager.appendChild(play);

    // Fast forward symbol
    var forward = document.createElement('img');
    forward.setAttribute('id', 'fast-forward_symbol');
    forward.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/forward-step.svg');

    assetManager.appendChild(forward);

    // Rewind symbol
    var rewind = document.createElement('img');
    rewind.setAttribute('id', 'rewind_symbol');
    rewind.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/backward-step.svg');

    assetManager.appendChild(rewind);

    // Sound on symbol
    var soundOn = document.createElement('img');
    soundOn.setAttribute('id', 'sound-on_symbol');
    soundOn.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/volume-off.svg');

    assetManager.appendChild(soundOn);

    // Sound off symbol
    var soundOff = document.createElement('img');
    soundOff.setAttribute('id', 'sound-off_symbol');
    soundOff.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/volume-xmark.svg');

    assetManager.appendChild(soundOff);

    // Sound muted symbol
    var soundMuted = document.createElement('img');
    soundMuted.setAttribute('id', 'sound-muted_symbol');
    soundMuted.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/volume-high.svg');

    assetManager.appendChild(soundMuted);
}

// Creating button
const createButton = function(type, controllerWidth, controllerHeight, controlsDisplayed, controllerComponent)
{
    // Getting button height, width and position depending on type
    var height = controllerWidth / 6;
    var width = controllerWidth / 8;
    var position = {x:0, y:0};

        // Setting button y position depending on video dimensions (should be just above the bar)
        var y;

        // Landscape video
        if (controllerWidth > controllerHeight)
        {
            y = 0 - ((controllerHeight / 3.2) - height); 
        }
        // Square or square-like video
        else if ((controllerWidth * 1.5) > controllerHeight)
        {
            y = 0 - ((controllerHeight / 2.75) - height); 
        }
        // Portrait video
        else
        {
            y = 0 - ((controllerHeight / 2.5) - height); 
        }

    switch(type)
    {
        case 'play':
        case 'pause':
            // Have buttons at the bottom (a bit above the progress bar)
            // X position is at 0
            position.y = y;
            break;

        case 'fast-forward':
            // Dimensions are default
            position.x = controllerWidth / 3.5;
            position.y = y;
            break;

        case 'rewind':
            // Dimensions are default
            position.x = - (controllerWidth / 3.5);
            position.y = y;
            break;

        case 'sound-on':
        case 'sound-off':
        case 'sound-muted':
            height = controllerWidth / 5;
            width = controllerWidth / 6;
            position.x = 0;
            position.y = 0;
            break;
    }

    var button = document.createElement('a-entity');
    button.setAttribute('class', 'video-controller-button ' + type + '-button');

    button.setAttribute('position', {
        x: position.x,
        y: position.y,
        z: 0.001,
    });

    button.setAttribute('geometry', {
        primitive: 'plane',
        height: height,
        width: width,
    }); 

    button.setAttribute('material', {
        src: '#' + type + '_symbol',
        transparent: true,
        alphaTest: 0.1,
        shader: 'flat',
    }); 

    // If it is not the mute button, add interactivity
    // If it is, greying it out
    if (type !== 'sound-muted')
    {
        // Hover effect
        button.setAttribute('circles-interactive-object', {
            type:'scale', 
            hover_scale: 1.1, 
            click_scale: 1.1,
        });

        // Click effect
        button.addEventListener('click', function()
        {
            // If controls are displayed onhover, resetting the countdown for inactivity
            if (controlsDisplayed === 'onhover')
            {
                controllerComponent.deactivationCountdown();
            }

            // Adding functionality depending on the type of button
            switch(type)
            {
                case 'play':
                    controllerComponent.playVideo();
                    break;

                case 'pause':
                    controllerComponent.pauseVideo();
                    break;

                case 'fast-forward':
                    controllerComponent.fastForwardVideo();
                    break;

                case 'rewind':
                    controllerComponent.rewindVideo();
                    break;

                case 'sound-on':
                    controllerComponent.soundOn();
                    break;

                case 'sound-off':
                    controllerComponent.soundOff();
                    break;
            }
        });
    }
    else
    {
        button.setAttribute('material', {
            color: '#9c9c9c',
        }); 
    }

    return button;
}

// Creating control element
const createControls = function(parentElement, controlsDisplayed, hasSound)
{
    var controllerComponent = parentElement.components['circles-video-controls'];

    var videoAsset = parentElement.getAttribute('material').src;

    var controllerHeight = parentElement.getAttribute('geometry').height;
    var controllerWidth = parentElement.getAttribute('geometry').width;

    // Controller background
    var background = document.createElement('a-entity');
    background.classList.add('video-controller');

    background.setAttribute('geometry', {
        primitive: 'plane',
        height: parentElement.getAttribute('geometry').height,
        width: parentElement.getAttribute('geometry').width,
    });

    background.setAttribute('material', {
        color: '#000000',
        opacity: 0.3,
        shader: 'flat',
    });

    background.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0.001,
    });

        // If video is currently paused, creating play button
        // Otherwise, creating paused button
        if (videoAsset.paused)
        {
            var playButton = createButton('play', controllerWidth, controllerHeight, controlsDisplayed, controllerComponent);
            background.appendChild(playButton);
        }
        else
        {
            var pauseButton = createButton('pause', controllerWidth, controllerHeight, controlsDisplayed, controllerComponent);
            background.appendChild(pauseButton);
        }

        // Fast forward button
        var fastForwardButton = createButton('fast-forward', controllerWidth, controllerHeight, controlsDisplayed, controllerComponent);
        background.appendChild(fastForwardButton);

        // Rewind button
        var rewindButton = createButton('rewind', controllerWidth, controllerHeight, controlsDisplayed, controllerComponent);
        background.appendChild(rewindButton);

        // If video has sound, displaying sound button
        // Otherwise, diplaying muted button
        if (hasSound)
        {
            // If video sound is currently on, creating sound on button
            // Otherwise, creating sound off
            if (videoAsset.volume > 0.0)
            {
                
            }
            else
            {
                
            }
        }
        else
        {
            
        }

        // Progress bar background
        var progressBackground = document.createElement('a-entity');
        progressBackground.setAttribute('class', 'video-progress-background');

        // Setting bar height and y position depending on video dimensions (bar should be at the bottom of the video)
        var barWidth = (controllerWidth / 1.2);
        var barHeight;
        var barY;

        // Landscape video
        if (controllerWidth > controllerHeight)
        {
            barHeight = controllerHeight / 14;
            barY = 0 - (controllerHeight / 3); 
        }
        // Square or square-like video
        else if ((controllerWidth * 1.5) > controllerHeight)
        {
            barHeight = controllerHeight / 18;
            barY = 0 - (controllerHeight / 2.55); 
        }
        // Portrait video
        else
        {
            barHeight = controllerHeight / 25;
            barY = 0 - (controllerHeight / 2.3); 
        }

        progressBackground.setAttribute('position', {
            x: 0,
            y: barY,
            z: 0.001,
        });

        progressBackground.setAttribute('geometry', {
            primitive: 'plane',
            height: barHeight,
            width: barWidth,
        }); 

        progressBackground.setAttribute('material', {
            shader: 'flat',
            color: '#000000',
            opacity: 0.5,
        }); 

            // Progress bar
            var progressBar = document.createElement('a-entity');
            progressBar.setAttribute('class', 'video-progress-bar');

            progressBar.setAttribute('position', {
                x: 0,
                y: 0,
                z: 0.001,
            });

            progressBar.setAttribute('geometry', {
                primitive: 'plane',
                height: barHeight,
            }); 
    
            progressBar.setAttribute('material', {
                shader: 'flat',
                color: '#FFFFFF',
            }); 

            var updatingInterval = null;

            // Updating progress bar length (and position) according to video current time
            function updateProgress()
            {
                var percentProgress = videoAsset.currentTime / videoAsset.duration;
                var remainingProgress = 1.0 - percentProgress;

                // If the controller is up, update progress bar
                // Otherwise clear interval
                if (parentElement.classList.contains('video-controls-active'))
                {
                    progressBar.setAttribute('geometry', {
                        width: barWidth * percentProgress,
                    }); 

                    progressBar.setAttribute('position', {
                        x: 0 - ((remainingProgress * barWidth) / 2),
                        y: 0,
                        z: 0.001,
                    }); 
                }
                else
                {
                    clearInterval(updatingInterval);
                }
            }

            updateProgress();

            // Updating progress bar every 0.05 of a second to match video
            updatingInterval = setInterval(updateProgress, 50);

            progressBackground.appendChild(progressBar);

        background.appendChild(progressBackground);

    parentElement.appendChild(background);
}

// Displaying video controls over video
const displayControls = function(event)
{
    var element = event.srcElement;

    // Making sure the srcElement is the video element (has circles-video-controls component)
    if (element.hasAttribute('circles-video-controls'))
    {
        // Making sure video controls are not already active
        // If it does and the controls are displayed onhover, resetting the countdown for inactivity
        if (!element.classList.contains('video-controls-active'))
        {
            element.classList.add('video-controls-active');

            // Creating control element
            createControls(element, element.controlsDisplayed, element.soundAvailable);

            // Calling function to hide UI
            function hide(e)
            {   
                // Only hiding if anything but the video element (or its buttons) was clicked
                if (e.target !== element && !e.target.classList.contains('video-controller-button'))
                {
                    hideControls(element);
                    document.getElementById(element.parentElementID).removeEventListener('click', hide);
                }
            }

            // If controls are displayed onclick, adding event listener to close controller
            // Otherwise, setting up the countdown to close controller after a period of inactivity
            if (element.controlsDisplayed === 'onclick')
            {
                setTimeout(function()
                {
                    document.getElementById(element.parentElementID).addEventListener('click', hide);

                }, 100);
            }
            else
            {
                element.components['circles-video-controls'].deactivationCountdown();
            }
        }
        else if (element.controlsDisplayed === 'onhover')
        {
            element.components['circles-video-controls'].deactivationCountdown();
        }
    }
}

// Hiding video controls
const hideControls = function(element)
{   
    element.classList.remove('video-controls-active');

    // Deleting video controller
    var controller = element.querySelector('.video-controller');

    if (controller)
    {
        controller.remove();
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-video-controls', 
{
    schema: 
    {
        controls: {type: 'boolean', default: true},
        controlsDisplayed: {type: 'string', default:'onhover', oneOf:['onhover','onclick']},
        parentElementID: {type: 'string'},
        skipSeconds: {type: 'number', default: -1},
        autoplay: {type: 'boolean', default: false},
        loop: {type: 'boolean', default: false},
        soundAvailable: {type: 'boolean', default: false},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        // Making sure this is the first circles-video-controls component to the run
        // If it is, running what only needs to be run once
        if (document.querySelectorAll('[circles-video-controls')[0] === element)
        {
            // Uploading assets needed for video controller
            uploadVideoAssets();
        }

        // If sound is avaliable, turning the sound off
        // Otherwise, muting the video
        if (CONTEXT_AF.data.soundAvailable)
        {
            CONTEXT_AF.soundOff();
        }
        else
        {
            videoAsset.muted = true;
        }

        // Setting up video loop
        if (CONTEXT_AF.data.loop)
        {
            videoAsset.setAttribute('loop', '');
        }

        // If the video has controls, activating them
        if (CONTEXT_AF.data.controls === true)
        {
            // Making sure element is interactive
            element.classList.add('interactive');

            // Putting event listener on video element to display controls
            if (CONTEXT_AF.data.controlsDisplayed === 'onhover' && !AFRAME.utils.device.isMobile())
            {
                element.controlsDisplayed = CONTEXT_AF.data.controlsDisplayed;
                element.soundAvailable = CONTEXT_AF.data.soundAvailable;
                element.addEventListener('mouseenter', displayControls);
            }
            else (CONTEXT_AF.data.UIdisplayed === 'onclick')
            {
                element.controlsDisplayed = CONTEXT_AF.data.controlsDisplayed;
                element.soundAvailable = CONTEXT_AF.data.soundAvailable;
                element.parentElementID = CONTEXT_AF.data.parentElementID;
                element.addEventListener('click', displayControls);
            }
        }

        // If skipSeconds was set to a negative number, setting it to be a 5th of the video's length (when video has loaded)
        if (CONTEXT_AF.data.skipSeconds < 0)
        {
            if (videoAsset.readyState >= 2)
            {
                CONTEXT_AF.data.skipSeconds = videoAsset.duration / 5;
            }
            else
            {
                videoAsset.addEventListener('loadeddata', function()
                {
                    CONTEXT_AF.calculatedSkipSeconds = videoAsset.duration / 5;
                });
            }
        }
    },
    update: function(oldData) 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        // Making sure page has loaded before running any updates
        if (document.readyState === 'complete')
        {
            // If controls variable was updated...
            if (CONTEXT_AF.data.controls !== oldData.controls)
            {
                
            }

            // If controlsDisplayed variable was updated...
            if (CONTEXT_AF.data.controlsDisplayed !== oldData.controlsDisplayed)
            {
                
            }

            // If parentElementID variable was updated...
            if (CONTEXT_AF.data.parentElementID !== oldData.parentElementID)
            {
                
            }

            // If loop variable was updated...
            if (CONTEXT_AF.data.loop !== oldData.loop)
            {
                if (CONTEXT_AF.data.loop)
                {
                    videoAsset.setAttribute('loop', '');
                    
                    if (videoAsset.paused)
                    {
                        videoAsset.currentTime = 0;
                        videoAsset.play();
                    }
                }
                else
                {
                    videoAsset.removeAttribute('loop');
                }
            }

            // If soundAvailable variable was updated...
            if (CONTEXT_AF.data.soundAvailable !== oldData.soundAvailable)
            {
                
            }
        }
    },
    // Setting countdown of inactivity to hide controller (only used when controller is displayed onhover)
    deactivationCountdown: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // Setting up countdown for 2 seconds
        // When time is up, hiding video controller
        function setUpCountdown()
        {
            CONTEXT_AF.countdown = setTimeout(function() 
            {
                // Removing and adding back event listener so that if the mouse was on a controller button, the IU is not displayed right away again
                element.removeEventListener('mouseenter', displayControls);

                setTimeout(function()
                {
                    element.addEventListener('mouseenter', displayControls);

                }, 100);

                hideControls(element);
                CONTEXT_AF.countdown = null;

            }, 2000);
        }

        // If there already is a countdown, reset it
        // Otherwise start a countdown
        if (CONTEXT_AF.countdown)
        {
            clearTimeout(CONTEXT_AF.countdown);
            setUpCountdown();
        }
        else
        {
            setUpCountdown();
        }
    },
    // Fast forwards video
    fastForwardVideo: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        videoAsset.currentTime += CONTEXT_AF.calculatedSkipSeconds;
    },
    // Rewinds video
    rewindVideo: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        videoAsset.currentTime -= CONTEXT_AF.calculatedSkipSeconds;
    },
    // Pauses video
    pauseVideo: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        videoAsset.pause();

        // If the video controller is display, deleted pause button and create play button
        if (element.classList.contains('video-controls-active'))
        {
            var controller = element.querySelector('.video-controller');

            var pauseButton = controller.querySelector('.pause-button');
            pauseButton.remove();

            var playButton = createButton('play', element.getAttribute('geometry').width, element.getAttribute('geometry').height, CONTEXT_AF.data.controlsDisplayed, element.components['circles-video-controls']);
            controller.appendChild(playButton);
        }
    },
    // Plays video
    playVideo: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        videoAsset.play();

        // If the video controller is display, deleted pause button and create play button
        if (element.classList.contains('video-controls-active'))
        {
            var controller = element.querySelector('.video-controller');

            var playButton = controller.querySelector('.play-button');
            playButton.remove();

            var pauseButton = createButton('pause', element.getAttribute('geometry').width, element.getAttribute('geometry').height, CONTEXT_AF.data.controlsDisplayed, element.components['circles-video-controls']);
            controller.appendChild(pauseButton);
        }
    },
    // Turns video sound on
    soundOn: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        console.log('sound on');
    },
    // Turns video sound off
    soundOff: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const videoAsset = element.getAttribute('material').src;

        console.log('sound off');
    },
});