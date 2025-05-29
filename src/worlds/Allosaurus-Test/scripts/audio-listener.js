'use strict';

AFRAME.registerComponent('circles-audio-listener', 
{
    schema: 
    {
        startEvent: {type: 'string', default: 'start-listening'},
        endEvent: {type: 'string', default: 'stop-listening'},
        outputTarget: {type: 'string'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.startListening = this.startListening.bind(this);
        this.stopListening = this.stopListening.bind(this);

        this.stream;
        this.mediaRecorder;
        this.audioChunks = [];
        
        this.transcription = '';
        this.listening = false;

        // Listening to start and stop audio listener
        element.addEventListener(schema.startEvent, this.startListening);
        element.addEventListener(schema.endEvent, this.stopListening);
    },

    // Starting audio listener
    startListening: async function()
    {
        const element = this.el;
        const schema = this.data;

        if (!this.listening)
        {
            console.log('circles-audio-listener: Listening started');

            this.listening = true;

            // Requesting microphone access
            if (!this.stream) 
            {
                this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            this.mediaRecorder = new MediaRecorder(this.stream);

            this.mediaRecorder.ondataavailable = event => 
            {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = async() => 
            {
                // Creating blob from the audio chunks
                const audioBlob = new Blob(this.audioChunks, { type:'audio/webm' });
                
                // Clearing audio chunks for next recording
                this.audioChunks = [];

                // Sending blob to Flask server to transcribe
                const formData = new FormData();
                formData.append('audioFile', audioBlob, 'recording.webm');

                try 
                {
                    const response = await fetch('http://localhost:5000/transcribe', {method: 'POST', body: formData});
                    
                    const data = await response.json();
                    this.transcription = data.responseText;
                    console.log(this.transcription);

                    // Emitting event with transcription
                    // If a target element was specified, emitting event to target
                    // Otherwise emitting event to itself
                    var targetElement = document.getElementById(schema.outputTarget);

                    if (targetElement)
                    {
                        targetElement.emit('text-ready', {text: this.transcription});
                    }
                    else
                    {
                        element.emit('text-ready', {text: this.transcription});
                    };
                } 
                catch (error) 
                {
                    console.log('circles-audio-listener: Error transcribing audio: ' + error);
                }
            }

            // Starting to listen
            this.mediaRecorder.start();
        }
    },

    // Stopping audio listener
    stopListening: function()
    {
        console.log('circles-audio-listener: Listening stopped');

        this.mediaRecorder.stop();
        this.listening = false;
    },

    // Getting most recent transcription
    getTranscription: function()
    {
        return this.transcription;
    },
});