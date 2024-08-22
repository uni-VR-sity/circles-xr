'use strict';

// Component
AFRAME.registerComponent('circles-data-collection', 
{
    schema: 
    {
        startEvent: {type:'string', default:'startDataCollection'},
        endEvent: {type:'string', default:'endDataCollection'},
        dataToCollect : {type:'array'},
        taskEvents : {type:'array'},
        restart : {type:'boolean', default:true},
    },
    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        this.startCollection = this.startCollection.bind(this);
        this.taskCompleted = this.taskCompleted.bind(this);
        this.endCollection = this.endCollection.bind(this);

        this.collectedData = {};

        // Getting current circle
        // url: http://domain/w/circle
        // split result array: {'http', '', 'domain', 'w', 'circle'}
        this.collectedData.circle = window.location.href.split('/')[4];

        // Listening for event to start collecting data
        element.addEventListener(schema.startEvent, this.startCollection);
    },
    startCollection: function()
    {
        console.log('start data collection');

        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // Removing event listener to start collecting data
        element.removeEventListener(schema.startEvent, this.startCollection);

        // Checking what data to collect
        var currentDate = new Date();

        // Date (YYYY-MM-DD)
        if (schema.dataToCollect.includes('date'))
        {
            var year = currentDate.getFullYear();
            var month = ('00' + (currentDate.getMonth() + 1)).slice(-2);
            var day = ('00' + currentDate.getDate()).slice(-2);

            this.collectedData.date = year + '-' + month + '-' + day;
        }

        // Time (HH:MM:SS)
        if (schema.dataToCollect.includes('time'))
        {
            var hour = ('00' + currentDate.getHours()).slice(-2);
            var minute = ('00' + currentDate.getMinutes()).slice(-2);
            var second = ('00' + currentDate.getSeconds()).slice(-2);

            this.collectedData.time = hour + ':' + minute + ':' + second;
        }

        // Total time
        if (schema.dataToCollect.includes('totalTime'))
        {
            this.startTime = currentDate;
        }

        // Time per task
        // If time per task data is collected, listen for event that current task was completed
        // Otherwise listen for event to stop collecting data
        if (schema.dataToCollect.includes('timePerTask') && schema.taskEvents.length > 0)
        {
            this.currentTask = 0;
            this.collectedData.timePerTask = [];

            this.collectedData.timePerTask[this.currentTask] = currentDate;

            element.addEventListener(schema.taskEvents[this.currentTask], this.taskCompleted);
        }
        else
        {
            element.addEventListener(schema.endEvent, this.endCollection);
        }
    },
    taskCompleted: function()
    {
        console.log('task ' + this.currentTask + ' completed');

        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // Removing event listener for completed task
        element.removeEventListener(schema.taskEvents[this.currentTask], this.taskCompleted);

        // Calculating time taken to complete current task
        var currentDate = new Date();

        this.collectedData.timePerTask[this.currentTask] = currentDate - this.collectedData.timePerTask[this.currentTask];

        // Moving on to the next task
        this.currentTask++;
        this.collectedData.timePerTask[this.currentTask] = currentDate;

        // If this is the last task, listening for task completion to end collecting data
        // Otherwise, listening for task completion to move on to the next task
        if (this.currentTask + 1 == schema.taskEvents.length)
        {
            element.addEventListener(schema.taskEvents[this.currentTask], this.endCollection);
        }
        else
        {
            element.addEventListener(schema.taskEvents[this.currentTask], this.taskCompleted);
        }
    },
    endCollection: function()
    {
        console.log('end data collection');

        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // Removing event listener to end collecting data
        element.removeEventListener(schema.endEvent, this.endCollection);
        element.removeEventListener(schema.taskEvents[this.currentTask], this.endCollection);

        // Checking what data to collect
        var currentDate = new Date();

        // Total time
        if (schema.dataToCollect.includes('totalTime'))
        {
            this.collectedData.totalTime = currentDate - this.startTime;
        }

        // Time per task
        if (schema.dataToCollect.includes('timePerTask') && schema.taskEvents.length > 0)
        {
            this.collectedData.timePerTask[this.currentTask] = currentDate - this.collectedData.timePerTask[this.currentTask];
        }

        // User
        if (schema.dataToCollect.includes('user'))
        {
            // Setting user to true to signal to get current user when creating log on server side
            this.collectedData.user = true;
        }

        // Sending data to save as log
        var request = new XMLHttpRequest();
        request.open('POST', '/save-collected-data');
        request.setRequestHeader('Content-Type', 'application/json');

        request.onload = function() 
        {
        }

        request.send(JSON.stringify(this.collectedData));

        // Restarting data collection
        if (schema.restart)
        {
            element.addEventListener(schema.startEvent, this.startCollection);
        }
    },
});