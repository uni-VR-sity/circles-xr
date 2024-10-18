'use strict';

// Component
AFRAME.registerComponent('circles-data-collector', 
{
    schema:
    {
        dataToCollect: {type:'array'},
    },
    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        this.count = 0;

        // Getting current circle
        // url: http://domain/w/circle
        // split result array: {'http', '', 'domain', 'w', 'circle'}
        this.currentCircle = window.location.href.split('/')[4];
    },
    createLog: function(data)
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        var logData = {};

        // Storing current circle
        logData.circle = this.currentCircle;

        // Checking what data to collect
        var currentDate = new Date();

        // Date (YYYY-MM-DD)
        if (schema.dataToCollect.includes('date'))
        {
            var year = currentDate.getFullYear();
            var month = ('00' + (currentDate.getMonth() + 1)).slice(-2);
            var day = ('00' + currentDate.getDate()).slice(-2);

            logData.date = year + '-' + month + '-' + day;
        }

        // Time (HH:MM:SS)
        if (schema.dataToCollect.includes('time'))
        {
            var hour = ('00' + currentDate.getHours()).slice(-2);
            var minute = ('00' + currentDate.getMinutes()).slice(-2);
            var second = ('00' + currentDate.getSeconds()).slice(-2);

            logData.time = hour + ':' + minute + ':' + second;
        }

        // User
        if (schema.dataToCollect.includes('user'))
        {
            // Setting user to true to signal to get current user when creating log on server side
            logData.user = true;
        }

        // Player position
        if (schema.dataToCollect.includes('position'))
        {
            logData.position = data.position;
        }

        // Name
        if (schema.dataToCollect.includes('name'))
        {
            logData.name = data.name;
        }

        // Description
        if (schema.dataToCollect.includes('description'))
        {
            logData.description = data.description;
        }

        // Sending data to save as log
        var request = new XMLHttpRequest();
        request.open('POST', '/save-collected-data');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(logData));
    },
});