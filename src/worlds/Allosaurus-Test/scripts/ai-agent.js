'use strict';

AFRAME.registerComponent('circles-ai-agent', 
{
    schema: 
    {
        inputEvent: {type: 'string', default: 'text-ready'},
        responseFileLocation: {type: 'string', default: ''},
        responseTarget: {type: 'string'},
    },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.inputListener = this.inputListener.bind(this);

        this.response = '';

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
        // Getting response to input
        try 
        {
            const inputResponse = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({inputText: input}),
            });

            const data = await inputResponse.json();
            this.response = data.responseText;
            console.log(this.response);
        } 
        catch (error) 
        {
            console.log('circles-ai-agent: Unable to connect to server to process input');
            return;
        }

        // Getting audio for response
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

            const blob = await audioResponse.blob();
            var audioUrl = URL.createObjectURL(blob);

            console.log(audioUrl); // MAKE SURE AUDIO IS SAVED IN PROPER SPOT

            // EMIT EVENT
        } 
        catch (error) 
        {
            console.log('circles-ai-agent: Unable to connect to server to get audio response');
        }
    },

    // Getting AI response
    getResponseText: function()
    {
        return this.response
    }
});