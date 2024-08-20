'use strict';

// Component
AFRAME.registerComponent('circles-data-collection', 
{
    schema: 
    {
        startEvent: {type:'string', default:''},
        endEvent: {type:'string', default:''},
    },
    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        this.startCollection = this.startCollection.bind(this);
        this.stopCollection = this.stopCollection.bind(this);

        // Assessment variables
        this.startTime;
        this.endTime;
        this.totalTime;

        // Listening for event to stop collecting data
        element.addEventListener(schema.endEvent, this.stopCollection);
    },
    startCollection: function()
    {

    },
    stopCollection: function()
    {
        // Getting current circle
        // url: http://domain/w/circle
        // split result array: {'http', '', 'domain', 'w', 'circle'}
        var circle = window.location.href.split('/')[4];

        // Sending data to save
        var request = new XMLHttpRequest();
        request.open('POST', '/save-collected-data');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onload = function() 
        {
        }

        request.send('circle=' + circle + '&user=tester&totalTime=100');
    },
});