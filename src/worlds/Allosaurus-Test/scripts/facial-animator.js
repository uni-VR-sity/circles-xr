'use strict';

AFRAME.registerComponent('circles-facial-animator', 
{
    schema: 
    {
        animateEvent: {type: 'string', default: 'response-ready'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.playPhone = this.playPhone.bind(this);
        this.animateEventListener = this.animateEventListener.bind(this);

        this.phoneAnimationTable = new Map();
        
        this.currentAudioPhones = null;
        this.currentAnimationTimeouts = [];

        // Attaching sound component to element
        element.setAttribute('sound', {});
        
        // Setting up phone animations
        this.setUpAnimations();

        // Listening for animate event to play facial animation
        element.addEventListener(schema.animateEvent, this.animateEventListener);
    },

    // Setting up phone animations from phones/phone-animation-list.js in world folder
    setUpAnimations: function()
    {
        const element = this.el;
        const schema = this.data;

        for (const phone of phoneAnimationList)
        {
            // Adding phone and associated animation to table
            this.phoneAnimationTable.set(phone.phone, phone.animation);

            // Adding animation component to element
            element.setAttribute('animation__' + phone.animation.substring(1), {
                property: 'components.material.material.color',
                type: 'color',
                to: phone.animation,
                startEvents: phone.animation,
                autoplay: false,
                easing: 'linear',
                dur: 0.045,
            });
        }
    },

    // Listening for animate event to play animation
    animateEventListener: function(event)
    {
        if (event.detail.audioClip)
        {
            this.playAnimation(event.detail.audioClip);
        }
        else
        {
            console.log('circles-facial-animator: ' + event.type + ' event did not include audioClip variable');
        }
    },

    // Playing facial animation for specified audio clip
    playAnimation: async function(audioClip)
    {
        console.log('playing ' + audioClip);
        
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

        // If phones were returned successfully, playing facial animation
        if (this.currentAudioPhones)
        {
            // Playing audio clip
            element.setAttribute('sound', {src: audioClip});
            element.components.sound.playSound();

            // Setting timeouts to play each animation phone
            this.currentPhone = 0;

            for (const phone of this.currentAudioPhones)
            {
                this.currentAnimationTimeouts.push(setTimeout(this.playPhone, phone.start * 1000));
            }
        }
    },

    // Getting phones and timestamps from specified audio clip
    getPhones: async function(audioClip)
    {
        await fetch('/get-phones', {method: 'POST', body: new URLSearchParams({ audio: audioClip })})
        .then(response => response.json())
        .then(data => 
        {
            if (data.status == 'success')
            {
                this.currentAudioPhones = data.phones;
                this.currentAudioPhones.reverse();

                return;
            }
            else
            {
                console.log('circles-facial-animator: Error getting phone set for "' + audioClip + '"');
                this.currentAudioPhones = null;

                return;
            }
        });
    },

    // Playing animation for current phone
    playPhone: function()
    {
        const element = this.el;
        const schema = this.data;

        var currentPhone = this.currentAudioPhones.pop();
        var animation = this.phoneAnimationTable.get(currentPhone.phone);

        if (animation)
        {
            console.log(currentPhone.phone);
            element.emit(animation);
        }
        
        this.currentPhone++;
    }
});