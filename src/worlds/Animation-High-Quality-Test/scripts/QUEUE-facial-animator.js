'use strict';

AFRAME.registerComponent('queue-circles-facial-animator', 
{
    schema: 
    {
        animateEvent: {type: 'string', default: 'response-audio-ready'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.animateEventListener = this.animateEventListener.bind(this);
        this.playSentence = this.playSentence.bind(this);
        this.playPhone = this.playPhone.bind(this);
        this.closeMouth = this.closeMouth.bind(this);

        this.phoneAnimationTable = new Map();

        this.sentenceQueue = [];
        this.currentSentence = { processed: true };
        this.currentPhones = 0;

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

            this.getPhones(event.detail.audioClip, 'audio');
        }
        else if (event.detail.audioBlob)
        {
            console.log('circles-facial-animator: Getting phones from audio blob');

            this.getPhones(event.detail.audioBlob, 'blob');
        }
        else
        {
            console.log('circles-facial-animator: ' + event.type + ' event did not include audioClip or audioBlob variable');
        }
    },

    // Getting phones from audio
    getPhones: async function(audio, type)
    {
        var newSentence = {
            audio: null,
            phones: null,
            timeouts: [],
            processed: false,
        };

        // Getting phones from new sentence audio depending on audio type
        if (type == 'audio')
        {
            newSentence.audio = audio;
            newSentence.phones = await this.getPhonesFromAudio(audio);
        }
        else if ('blob')
        {
            newSentence.audio = URL.createObjectURL(audio);
            newSentence.phones = await this.getPhonesFromBlob(audio);
        }

        // If getting phones was successful, adding new sentence to queue from animating
        if (newSentence.phones)
        {
            this.sentenceQueue.push(newSentence);

            // If this is the only sentence to animate, calling playSentence() to start animating
            if (this.sentenceQueue.length == 1 && this.currentSentence.processed)
            {
                this.playSentence();
            }
        }
    },

    // Getting phones and timestamps from specified audio clip
    getPhonesFromAudio: async function(audioClip)
    {
        const response = await fetch('/get-phones-from-audio', {method: 'POST', body: new URLSearchParams({ audio: audioClip })});

        const data = await response.json();

        if (data.status == 'success')
        {
            return data.phones;
        }
        else
        {
            console.log('circles-facial-animator: Error getting phone set for "' + audioClip + '"');

            return null;
        }
    },

    // Getting phones and timestamps from blob
    getPhonesFromBlob: async function(audioBlob)
    {
        const response = await fetch('/get-phones-from-blob', {method: 'POST', headers: {'Content-Type': 'audio/wav'}, body: audioBlob});

        const data = await response.json();

        if (data.status == 'success')
        {
            return data.phones;
        }
        else
        {
            console.log('circles-facial-animator: Error getting phone set for "' + audioBlob + '"');

            return null;
        }
    },

    // Setting up animations for next sentence in queue
    playSentence: function()
    {
        const element = this.el;
        const schema = this.data;

        this.currentSentence = this.sentenceQueue.shift();

        console.log('circles-facial-animator: Playing ' + this.currentSentence.audio);

        // Playing audio clip
        element.setAttribute('sound', {src: this.currentSentence.audio});
        element.components.sound.playSound();

        // Setting timeouts to play each animation phone
        this.currentPhone = 0;

        for (const phone of this.currentSentence.phones)
        {
            this.currentSentence.timeouts.push(setTimeout(this.playPhone, phone.start * 1000));
        }
    },

    // Playing animation for current phone
    playPhone: function()
    {
        const element = this.el;
        const schema = this.data;

        // Getting animation for current phone
        var animation = this.phoneAnimationTable.get(this.currentSentence.phones[this.currentPhone].phone);

        // Playing animation
        if (animation)
        {
            console.log(this.currentSentence.phones[this.currentPhone].phone);

            element.emit('viseme-sil');
            element.emit(animation);
        }
        else
        {
            console.log('circles-facial-animation: Animation missing for ' + this.currentSentence.phones[this.currentPhone].phone + ' phone');
        }

        // Increasing phone count
        this.currentPhone++;

        // If this was the last phone in the sentence,
        if (this.currentPhone == this.currentSentence.phones.length)
        {
            console.log('circles-facial-animation: Queue: ' + this.sentenceQueue.length);
            // If there are no more sentences to play, closing mouth
            // Otherwise, playing next sentence after small delay (for natural pause)
            if (this.sentenceQueue.length == 0)
            {
                console.log('circles-facial-animator: Closing mouth');

                setTimeout(this.closeMouth, 500);
            }
            else
            {
                this.currentSentence.processed = true

                setTimeout(this.playSentence, 500);
            }
        }
    },

    // Playing animation to close mouth
    closeMouth: function()
    {
        const element = this.el;
        const schema = this.data;

        this.currentSentence.processed = true;

        // Double checking there is not more sentences to play before closing mouth
        if (this.sentenceQueue.length == 0)
        {
            element.emit('viseme-sil');
        }
        else
        {
            this.playSentence();
        }
    },
});