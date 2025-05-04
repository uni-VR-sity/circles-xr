'use strict';

AFRAME.registerComponent('circles-transition', 
{
    sceneOnly: true,

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.fade = this.fade.bind(this);

        this.enterFunction = null;

        this.fadePlane = null;
        this.fadeOpacity = 0;
        this.fadeDirection = 0;
        this.fadeInterval = null;

        this.transitionReady = false;

        this.serverReady = false;
        this.modelsReady = false;

        // If circle is viewed in VR, fade user in when circle is ready
        // Otherwise show enter UI
        if (/*AFRAME.utils.device.checkHeadsetConnected()*/ true)
        {
            // Creating fade plane on camera element
            this.fadePlane = document.createElement('a-entity');
            this.fadePlane.setAttribute('id', 'fade-plane');
            this.fadePlane.setAttribute('geometry', {primitive: 'plane'});
            this.fadePlane.setAttribute('position', {x: 0, y: 0, z: -0.05});
            this.fadePlane.setAttribute('scale', {x: 0.2, y: 0.2, z: 1});
            this.fadePlane.setAttribute('material', {color: '#000000', roughness: 1, opacity: 1});

            document.querySelector('[camera]').appendChild(this.fadePlane);

            // Specifying the function to enter the circle
            this.enterFunction = this.fadeIn;
        }
        else
        {
            // Showing enter UI
            document.getElementById('user-gesture-overlay').style.display='block';

            // Specifying the function to enter the circle
            this.enterFunction = this.enableEnterButton;
        }
    },
    // Indicating server is ready
    setServerReady: function()
    {
        this.serverReady = true;

        // If models are also ready, entering circle
        if (this.modelsReady)
        {
            this.enterFunction();
        }
    },
    // Indicating models are loaded
    setModelsReady: function()
    {
        this.modelsReady = true;

        // If server is also ready, entering circle
        if (this.serverReady)
        {
            this.enterFunction();
        }
    },
    // Enabling enter button on enter UI
    enableEnterButton: function()
    {
        // (From circles_end_scripts.part.html)
        document.querySelector('#loading-animation-enter').style.display='none';
        
        document.querySelectorAll('.user-gesture-button').forEach((elem) => 
        {
            //if entering the wardrobe world no need to show "enter wardrobe button"
            if (window.location.pathname.match(/wardrobe/i)) {
            if (elem.id !== 'wardrobe-enter') {
                elem.style.display='block';
            }
            }
            else {
            elem.style.display='block';
            }
        });

        if (CIRCLES.CONSTANTS.CIRCLES_WEBRTC_ENABLED && CIRCLES.CONSTANTS.CIRCLES_MIC_ENABLED) 
        {
            NAF.connection.adapter.enableMicrophone(false);
        }
    },
    // Fading circle in/ fading fade screen out
    fadeIn: function()
    {
        // Making sure fade screen is not currently fading
        if (this.fadeInterval != null)
        {
            clearInterval(this.fadeInterval);
        }

        // Setting up fade attributes to fade in
        this.fadeOpacity = this.fadePlane.getAttribute('material').opacity;
        this.fadeDirection = -1;

        // Fading fade screen
        this.fadeInterval = setInterval(this.fade, 10);
    },
    // Fading circle out/ fading fade screen in
    fadeOut: function()
    {
        // Making sure fade screen is not currently fading
        if (this.fadeInterval != null)
        {
            clearInterval(this.fadeInterval);
        }

        // Setting up fade attributes to fade out
        this.fadeOpacity = this.fadePlane.getAttribute('material').opacity;
        this.fadeDirection = 1;

        // Fading fade screen
        this.fadeInterval = setInterval(this.fade, 10);
    },
    // Fading fade screen in specified direction
    fade: function()
    {
        // Increasing or decreasing opacity depending on fade step
        this.fadeOpacity += 0.01 * this.fadeDirection;
        this.fadePlane.setAttribute('material', {opacity: this.fadeOpacity});
        
        // Checking if fade is done
        if (this.fadeOpacity <= 0)
        {
            this.fadePlane.setAttribute('material', {opacity: 0});
            
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
        else if (this.fadeOpacity >= 1)
        {
            this.fadePlane.setAttribute('material', {opacity: 1});
            
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;

            this.transitionReady = true;
        }
    },
    // Setting up transition to next circle
    nextCircle: function()
    {
        // If circle is viewed in VR, fade user out
        if (/*AFRAME.utils.device.checkHeadsetConnected()*/ true)
        {
            this.fadeOut();
        }
    },
    // Returns if circle is ready for transition
    isTransitionReady: function()
    {
        return this.transitionReady;
    }
});