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
        
        // Creating phone animation table
        for (const phone of phoneAnimationList)
        {
            // Adding phone and associated animation to table
            this.phoneAnimationTable.set(phone.phone, phone.animation);
        }

        // Listening for animate event to play facial animation
        element.addEventListener(schema.animateEvent, this.animateEventListener);
    },

    // Listening for animate event to play animation
    animateEventListener: async function(event)
    {
        if (event.detail.audioClip)
        {
            console.log('circles-facial-animator: Getting phones from audio clip');

            await this.getPhonesFromAudio(event.detail.audioClip);
            this.playAnimation(event.detail.audioClip);
        }
        else if (event.detail.audioBlob)
        {
            console.log('circles-facial-animator: Getting phones from audio blob');
            
            await this.getPhonesFromBlob(event.detail.audioBlob);
            this.playAnimation(URL.createObjectURL(event.detail.audioBlob));
        }
        else
        {
            console.log('circles-facial-animator: ' + event.type + ' event did not include audioClip or audioBlob variable');
        }
    },

    // Playing facial animation for specified audio clip
    playAnimation: async function(audioClip)
    {
        const element = this.el;
        const schema = this.data;

        // If phones were returned successfully, playing facial animation
        if (this.currentAudioPhones)
        {
            console.log('circles-facial-animator: Playing ' + audioClip);

            // Clearing any playing animations and sounds
            for (const timeout of this.currentAnimationTimeouts)
            {
                clearTimeout(timeout);
            }

            element.components.sound.stopSound();

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
    getPhonesFromAudio: async function(audioClip)
    {
        await fetch('/get-phones-from-audio', {method: 'POST', body: new URLSearchParams({ audio: audioClip })})
        .then(response => response.json())
        .then(data => 
        {
            if (data.status == 'success')
            {
                this.currentAudioPhones = data.phones;

                // Adding neutral phone to the end to close mouth when done talking
                this.currentAudioPhones.push(
                {
                    start: this.currentAudioPhones[this.currentAudioPhones.length - 1].start + this.currentAudioPhones[this.currentAudioPhones.length - 1].duration,
                    duration: this.currentAudioPhones[this.currentAudioPhones.length - 1].duration,
                    phone: 'neutral'
                });
                
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

    // Getting phones and timestamps from blob
    getPhonesFromBlob: async function(audioBlob)
    {
        await fetch('/get-phones-from-blob', {method: 'POST', headers: {'Content-Type': 'audio/wav'}, body: audioBlob})
        .then(response => response.json())
        .then(data => 
        {
            if (data.status == 'success')
            {
                this.currentAudioPhones = data.phones;
                
                // Adding neutral phone to the end to close mouth when done talking
                this.currentAudioPhones.push(
                {
                    start: (Number(this.currentAudioPhones[this.currentAudioPhones.length - 1].start) + 0.35).toString(),
                    duration: '',
                    phone: 'neutral'
                });
                
                this.currentAudioPhones.reverse();

                return;
            }
            else
            {
                console.log('circles-facial-animator: Error getting phone set for "' + audioBlob + '"');
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
            element.emit('viseme-sil');
            element.emit(animation);
        }
        else if (animation != '')
        {
            console.log('circles-facial-animation: Animation missing for ' + currentPhone.phone + ' phone');
        }
        
        this.currentPhone++;
    }
});