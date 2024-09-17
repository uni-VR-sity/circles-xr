'use strict';

// Component
AFRAME.registerComponent('circles-data-collection', 
{
    schema: 
    {
        startEvent: {type:'string', default:'startDataCollection'},
        endEvent: {type:'string', default:'endDataCollection'},
        dataToCollect: {type:'array'},
        taskEvents: {type:'array'},
        restart: {type:'boolean', default:true},

        gradeUser: {type:'boolean', default:false},
        gradeVariable: {type:'string'},
        gradingScheme: {type:'array'},

        ui: {type:'boolean', default:true},
        uiPosition: {type:'vec3', default:'0 1.4 -1.5'},
        uiTitle: {type:'string', default:'Data Collection'},
        uiInstructions: {type:'string', default:'[Some instructions...]'},
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

        /*
        // Displaying UI
        if (schema.ui)
        {
            this.displayStartUI();
        }
        */

        // Listening for event to start collecting data
        element.addEventListener(schema.startEvent, this.startCollection);
    },
    /*
    displayStartUI: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // UI holder
        var ui = document.createElement('a-entity');
        ui.setAttribute('id', 'data-collection-ui');

        ui.setAttribute('position', schema.uiPosition);

        ui.setAttribute('geometry', {
            primitive: 'plane',
            width: 1.5,
        });

        ui.setAttribute('material', {
            color: '#FFFFFF',
        });

        ui.setAttribute('circles-lookat', {
            targetElement: document.querySelector('[camera]'),
            constrainYAxis: true,
            constraintedX: 0,
            constraintedZ: 0,
            smoothingAlpha: 0.01,
        });

            // Title
            var title = document.createElement('a-entity');

            title.setAttribute('position', {
                x: 0,
                y: 0.38,
                z: 0,
            });

            title.setAttribute('text', {
                value: schema.uiTitle,
                color: '#000000',
                align: 'center',
                baseline: 'top',
                width: 1.2,
                wrapCount: 19,
            });

            ui.appendChild(title);

            // Instructions
            var instructions = document.createElement('a-entity');

            instructions.setAttribute('position', {
                x: 0,
                y: 0.19,
                z: 0,
            });

            instructions.setAttribute('text', {
                value: schema.uiInstructions,
                color: '#000000',
                baseline: 'top',
                width: 1.2,
                wrapCount: 48
            });

            ui.appendChild(instructions);

            // Start button
            var startButton = document.createElement('a-entity');
            startButton.classList.add('interactive');

            startButton.setAttribute('position', {
                x: 0,
                y: -0.34,
                z: 0.001,
            });

            startButton.setAttribute('geometry', {
                primitive: 'plane',
                height: 0.15,
                width: 0.35,
            });

            startButton.setAttribute('material', {
                color: '#0f68bb',
            });

            // Hover effect
            startButton.addEventListener('mouseenter', function()
            {
                startButton.setAttribute('material', {
                    color: '#0f5da7',
                });
            });

            startButton.addEventListener('mouseleave', function() 
            {
                startButton.setAttribute('material', {
                    color: '#0f68bb',
                });
            });

            // Click effect
            startButton.addEventListener('click', function()
            {
                // Emmiting event to start data collection
                element.emit(schema.startEvent, null, false);

                // Deleting instructions and start button from ui
                instructions.parentNode.removeChild(instructions);
                startButton.parentNode.removeChild(startButton);

                // Hiding UI
                ui.setAttribute('visible', 'false');
            });

                // Button text
                var buttonText = document.createElement('a-entity');

                buttonText.setAttribute('text', {
                    value: 'Start',
                    color: '#FFFFFF',
                    align: 'center',
                    baseline: 'center',
                    width: 0.25,
                    wrapCount: 7,
                });

                startButton.appendChild(buttonText);

            ui.append(startButton);

        document.getElementsByTagName('a-scene')[0].appendChild(ui);
    },
    displayEndUI: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // Displaying UI
        document.getElementById('data-collection-ui').setAttribute('visible', 'true');
    },
    */
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
        if (schema.dataToCollect.includes('totalTime') || schema.gradeVariable == 'totalTime')
        {
            this.startTime = currentDate;
        }

        // Time per task
        // If time per task data is collected, listen for event that current task was completed
        // Otherwise listen for event to stop collecting data
        if ((schema.dataToCollect.includes('timePerTask') || schema.gradeVariable == 'averageTimePerTask') && schema.taskEvents.length > 0)
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
        if (schema.dataToCollect.includes('totalTime') || schema.gradeVariable == 'totalTime')
        {
            this.collectedData.totalTime = currentDate - this.startTime;
        }

        // Time per task
        if ((schema.dataToCollect.includes('timePerTask') || schema.gradeVariable == 'averageTimePerTask') && schema.taskEvents.length > 0)
        {
            this.collectedData.timePerTask[this.currentTask] = currentDate - this.collectedData.timePerTask[this.currentTask];
        }

        // User
        if (schema.dataToCollect.includes('user'))
        {
            // Setting user to true to signal to get current user when creating log on server side
            this.collectedData.user = true;
        }

        /*
        // Calculating user's grade
        if (schema.gradeUser)
        {
            this.calculateGrade();
        }

        // Adding grade to collected data
        if (schema.dataToCollect.includes('grade'))
        {
            this.collectedData.grade = this.grade;
        }
        */

        // Sending data to save as log
        var request = new XMLHttpRequest();
        request.open('POST', '/save-collected-data');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(this.collectedData));

        /*
        // Displaying UI
        if (schema.ui)
        {
            this.displayEndUI();
        }
        */
        
        // Restarting data collection
        if (schema.restart)
        {
            element.addEventListener(schema.startEvent, this.startCollection);
        }
    },
    calculateGrade: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // Checking that there is a grading scheme
        if (schema.gradingScheme.length != 4)
        {
            this.grade = 'Error: Missing information (gradingScheme)';
            return;
        }

        // Getting value grade is based on
        var gradeValue;

        if (schema.gradeVariable == 'totalTime')
        {
            gradeValue = this.collectedData.totalTime;
        }
        else if (schema.gradeVariable == 'averageTimePerTask')
        {
            // If time per task array does not exist, giving error message
            if (!this.collectedData.timePerTask)
            {
                this.grade = 'Error: Missing information (taskEvents)';
                return;
            }

            // Calculating average time per task
            gradeValue = 0;

            for (var i = 0; i < this.collectedData.timePerTask.length; i++)
            {
                gradeValue += this.collectedData.timePerTask[i];
            }

            gradeValue /= this.collectedData.timePerTask.length;
        }

        // Assigning grade based on grading scheme
        if (gradeValue <= schema.gradingScheme[0])
        {
            this.grade = 'A';
        }
        else if (gradeValue <= schema.gradingScheme[1])
        {
            this.grade = 'B';
        }
        else if (gradeValue <= schema.gradingScheme[2])
        {
            this.grade = 'C';
        }
        else if (gradeValue <= schema.gradingScheme[3])
        {
            this.grade = 'D';
        }
        else
        {
            this.grade = 'F';
        }
    }
});