'use strict';

AFRAME.registerComponent('queue2-circles-ai-agent', 
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

        this.inputQueue = [];
        this.currentInput = { processed: true };

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

    // Adding input to queue to be processed
    processInput: function(input)
    {
        var newInput = {
            input: input,
            response: null,
            sentences: [],
            processed: false,
        };

        this.inputQueue.push(newInput);

        // If this is the only input to process, calling getResponse() to start processing
        if (this.inputQueue.length == 1 && this.currentInput.processed)
        {
            this.getResponse();
        }
    },

    // Sending next input to AI API to get a response
    getResponse: async function()
    {
        const element = this.el;
        const schema = this.data;

        // Getting next input
        this.currentInput = this.inputQueue.shift();

        if (this.currentInput)
        {
            // Getting response to input
            try 
            {
                const inputResponse = await fetch('http://127.0.0.1:5000/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({inputText: this.currentInput.input}),
                });

                const data = await inputResponse.json();
                this.currentInput.response = data.responseText /* "Hello! I'm just a program, so I don't have feelings, but I'm here and ready to help you. How can I assist you today?" */;
                
                console.log('circles-ai-agent: ' + this.currentInput.response);

                // Emitting event with text response
                // If a target element was specified, emitting event to target
                // Otherwise emitting event to itself
                var targetElement = document.getElementById(schema.responseTarget);

                if (targetElement)
                {
                    targetElement.emit('response-text-ready', {text: this.currentInput.response});
                }
                else
                {
                    element.emit('response-text-ready', {text: this.currentInput.response});
                };

                // Splitting response into sentences
                var workingSentence = '';
                
                for (var i = 0; i < this.currentInput.response.length; i++)
                {
                    workingSentence += this.currentInput.response[i];

                    if (this.currentInput.response[i] == '.' || this.currentInput.response[i] == '!' || this.currentInput.response[i] == '?'|| this.currentInput.response[i] == ',')
                    {
                        // If sentence is not long enough, combining it with the next sentence
                        if (workingSentence.length >= 15)
                        {
                            this.currentInput.sentences.push(workingSentence);
                            workingSentence = '';
                            i++;
                        }
                    }
                    // In case response does not end with punctuation
                    else if (i == this.currentInput.response.length)
                    {
                        this.currentInput.sentences.push(workingSentence);
                    }
                }

                // (reverse to use pop())
                this.currentInput.sentences.reverse();

                console.log(this.currentInput.sentences);

                // Converting sentences to audio clips
                this.textToSpeech();
            } 
            catch (error) 
            {
                this.currentInput.processed = true;

                console.log('circles-ai-agent: Unable to connect to server to process input');

                return;
            }
        }
    },

    // Converting current response to an audio clip
    textToSpeech: async function()
    {
        const element = this.el;
        const schema = this.data;

        var sentence = this.currentInput.sentences.pop();

        // Getting audio for sentence
        try 
        {
            console.log('circles-ai-agent: Creating audio clip for: ' + sentence);

            const audioResponse = await fetch('http://127.0.0.1:5000/speech', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({inputText: sentence}),
            });

            if (!audioResponse.ok) 
            {
                console.log('circles-ai-agent: HTTP error: ' + audioResponse.status);
            }

            console.log('circles-ai-agent: Audio clip created for: ' + sentence);

            var audioBlob = await audioResponse.blob();

            // Emitting event with audio path
            // If a target element was specified, emitting event to target
            // Otherwise emitting event to itself
            var targetElement = document.getElementById(schema.responseTarget);

            if (targetElement)
            {
                targetElement.emit('response-audio-ready', {audioBlob: audioBlob, transcription: sentence});
            }
            else
            {
                element.emit('response-audio-ready', {audioBlob: audioBlob, transcription: sentence});
            };
        } 
        catch (error) 
        {
            console.log('circles-ai-agent: Unable to connect to server to get audio response');
        }

        // If there are more sentences, processing next sentence
        // Otherwise, process next input (if there is one)
        if (this.currentInput.sentences.length > 0)
        {
            this.textToSpeech();
        }
        else
        {
            this.currentInput.processed = true;

            if (this.inputQueue.length > 0)
            {
                this.getResponse();
            }
        }
    },

    // Getting most recent response
    getResponseText: function()
    {
        return this.currentInput.response;
    },
});