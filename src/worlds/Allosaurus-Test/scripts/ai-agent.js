'use strict';

AFRAME.registerComponent('circles-ai-agent', 
{
    schema: 
    {
        inputEvent: {type: 'string', default: 'text-ready'},
        responseTarget: {type: 'string'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.inputListener = this.inputListener.bind(this);

        this.response = '';
        this.audioBlob = null;

        // Listening for input
        element.addEventListener(schema.inputEvent, this.inputListener); 
    },

    // Listening for input to respond to
    inputListener: function(event)
    {
        if (event.detail.text)
        {
            this.processInput(event.detail.text);
        }
        else
        {
            console.log('circles-facial-animator: ' + event.type + ' event did not include text variable');
        }
    },

    // Sending input to be processed by AI
    processInput: async function(input)
    {
        const element = this.el;
        const schema = this.data;

        // Getting response to input
        console.log('circles-ai-agent: Getting response');
        
        try 
        {
            const inputResponse = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({inputText: input}),
            });

            const data = await inputResponse.json();
            this.response = data.responseText;
            
            console.log('circles-ai-agent: ' + this.response);
        } 
        catch (error) 
        {
            console.log('circles-ai-agent: Unable to connect to server to process input');
            return;
        }

        // Getting audio for response
        console.log('circles-ai-agent: Creating audio clip from response');

        try 
        {
            const audioResponse = await fetch('http://127.0.0.1:5000/speech', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({inputText: this.response}),
            });

            if (!audioResponse.ok) 
            {
                console.log('circles-ai-agent: HTTP error: ' + audioResponse.status);
            }

            this.audioBlob = await audioResponse.blob();

            // Emitting event with audio path
            // If a target element was specified, emitting event to target
            // Otherwise emitting event to itself
            var targetElement = document.getElementById(schema.responseTarget);

            if (targetElement)
            {
                targetElement.emit('response-ready', {audioBlob: this.audioBlob});
            }
            else
            {
                element.emit('response-ready', {audioBlob: this.audioBlob});
            };
        } 
        catch (error) 
        {
            console.log('circles-ai-agent: Unable to connect to server to get audio response');
        }
    },

    // Getting AI response
    getResponseText: function()
    {
        return this.response;
    },

    // Getting AI reponse audio blob
    getAudioBlob: function()
    {
        return this.audioBlob;
    },

    // Getting AI reponse audio clip
    getAudioClip: function()
    {
        return URL.createObjectURL(this.audioBlob);
    },
});