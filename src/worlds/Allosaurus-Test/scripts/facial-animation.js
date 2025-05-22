'use strict';

AFRAME.registerComponent('facial-animation', 
{
    schema: {},

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.playAnimation = this.playAnimation.bind(this);

        this.phoneAnimationSet = new Map();
        
        this.currentPhoneSet = null;
        this.currentPhone;
        this.currentAnimationTimeouts = [];

        // Attaching sound component to element
        element.setAttribute('sound', {});
    },

    // Adding specified phone and animation to phone animation set
    setUpAnimation: function(phone, animation)
    {
        this.phoneAnimationSet.set(phone, animation);
    },

    // Playing facial animation for specified audio clip
    play: async function(audioClip)
    {
        const element = this.el;
        const schema = this.data;

        // Clearing any playing animations and sounds
        for (const timeout of this.currentAnimationTimeouts)
        {
            clearTimeout(timeout);
        }

        element.components.sound.stopSound();

        // Getting phones and timestamps from audio clip
        await this.getPhones(audioClip);

        if (this.currentPhoneSet)
        {
            // Playing audio clip
            element.setAttribute('sound', {src: audioClip});
            element.components.sound.playSound();

            // Setting timeouts to play each animation phone
            this.currentPhone = 0;

            for (const phone of this.currentPhoneSet)
            {
                this.currentAnimationTimeouts.push(setTimeout(this.playAnimation, phone.start * 1000));
            }
        }
    },

    // Getting phones and timestamps from specified audio clip
    getPhones: async function(audioClip)
    {
        await fetch('/get-phones', {method: 'POST', body: JSON.stringify({ audio: audioClip })})
        .then(response => response.json())
        .then(data => 
        {
            if (data.status == 'success')
            {
                this.currentPhoneSet = data.phones;

                return;
            }
            else
            {
                console.log('facial-animation: Error getting phone set for "' + audioClip + '"');
                this.currentPhoneSet = null;

                return;
            }
        });
    },

    // Playing animation for current phone
    playAnimation: function()
    {
        const element = this.el;
        const schema = this.data;

        var animation = this.phoneAnimationSet.get(this.currentPhoneSet[this.currentPhone].phone);

        if (animation)
        {
            console.log(this.currentPhoneSet[this.currentPhone].phone);
            element.emit(animation);
        }
        
        this.currentPhone++;
    }
});