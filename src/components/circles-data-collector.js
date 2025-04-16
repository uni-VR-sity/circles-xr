'use strict';

// Component
AFRAME.registerComponent('circles-data-collector', 
{
    schema:
    {
        dataToCollect: {type:'array'},
        allowLogDownload: {type:'boolean', default:false},
        downloadUIPosition: {type:'vec3', default:{x:0.0, y:0.0, z:0.0}},
        downloadUIRotation: {type:'vec3', default:{x:0.0, y:0.0, z:0.0}},
    },
    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        this.downloadAllLogs = this.downloadAllLogs.bind(this);

        // Getting current circle
        // url: http://domain/w/circle
        // split result array: {'http', '', 'domain', 'w', 'circle'}
        this.currentCircle = window.location.href.split('/')[4];

        // Getting user information
        const userElement = document.getElementsByClassName('user_cam_rig')[0];

        this.userInfo = {};
        this.userInfo.username = userElement.getAttribute('circles-username');
        //this.userInfo.usertype = userElement.getAttribute('circles-usertype');

        // If users can download logs, creating UI
        if (schema.allowLogDownload)
        {
            this.createUI();
        }
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
    createUI: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // UI background
        var ui = document.createElement('a-entity');
        ui.setAttribute('id', 'data-collection-download-ui');

        ui.setAttribute('position', schema.downloadUIPosition);

        ui.setAttribute('rotation', schema.downloadUIRotation);

        ui.setAttribute('geometry', {
            primitive: 'plane',
            height: 1.25,
            width: 1.5,
        });

        ui.setAttribute('material', {
            color: '#ffffff',
        });

            // Title
            var title = document.createElement('a-entity');

            title.setAttribute('position', {
                x: 0,
                y: 0.34,
                z: 0,
            });

            title.setAttribute('text', {
                value: 'Download Logs',
                align: 'center',
                color: '#000000',
                width: 1.5,
                wrapCount: 16,
            });

            ui.appendChild(title);

            // Description
            var description = document.createElement('a-entity');

            description.setAttribute('position', {
                x: 0,
                y: 0.055,
                z: 0,
            });

            description.setAttribute('text', {
                value: 'Download the collected data logs:',
                align: 'center',
                color: '#000000',
                lineHeight: 55,
                width: 1.1,
                wrapCount: 22,
            });

            ui.appendChild(description);

            // Download button
            var downloadButton = document.createElement('a-entity');
            downloadButton.classList.add('interactive');

            downloadButton.setAttribute('position', {
                x: 0,
                y: -0.32,
                z: 0.01,
            });

            downloadButton.setAttribute('geometry', {
                primitive: 'plane',
                height: 0.2,
                width: 0.5,
            });

            downloadButton.setAttribute('material', {
                color: '#0f68bb',
            });

            downloadButton.addEventListener('mouseenter', function()
            {
                downloadButton.setAttribute('material', {
                    color: '#0f5da7',
                });
            });

            downloadButton.addEventListener('mouseleave', function()
            {
                downloadButton.setAttribute('material', {
                    color: '#0f68bb',
                });
            });

            downloadButton.addEventListener('click', this.downloadAllLogs);

                // Download button text
                var downloadButtonText = document.createElement('a-entity');
    
                downloadButtonText.setAttribute('text', {
                    value: 'Download',
                    align: 'center',
                    width: 0.5,
                    wrapCount: 11,
                });

                downloadButton.appendChild(downloadButtonText);

            ui.appendChild(downloadButton);

            // Error message
            var errorMessage = document.createElement('a-entity');
            errorMessage.setAttribute('id', 'log-download-error');

            errorMessage.setAttribute('visible', false);

            errorMessage.setAttribute('position', {
                x: 0,
                y: -0.54,
                z: 0,
            });

            errorMessage.setAttribute('text', {
                value: 'No logs available to download',
                align: 'center',
                color: '#cb0000',
                width: 1.1,
                wrapCount: 35,
            });

            ui.appendChild(errorMessage);

            // Success message
            var successMessage = document.createElement('a-entity');
            successMessage.setAttribute('id', 'log-download-success');

            successMessage.setAttribute('visible', false);

            successMessage.setAttribute('position', {
                x: 0,
                y: -0.54,
                z: 0,
            });

            successMessage.setAttribute('text', {
                value: 'Logs downloaded successfully',
                align: 'center',
                color: '#016901',
                width: 1.1,
                wrapCount: 35,
            });

            ui.appendChild(successMessage);

        // Adding ui to scene
        document.getElementsByTagName('a-scene')[0].appendChild(ui);
    },
    downloadAllLogs: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        // Checking if any logs exist for the circle
        var request = new XMLHttpRequest();
        request.open('POST', '/check-existing-logs');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onload = function() 
        {
            var response = JSON.parse(request.response);

            // If logs exists, downloading them
            // Otherwise. displaying error message
            if (response.exists)
            {
                // Hiding error message
                document.getElementById('log-download-error').setAttribute('visible', false);

                // Displaying success message
                document.getElementById('log-download-success').setAttribute('visible', true);

                // Downloading logs
                window.location.replace(response.downloadLink);
            }
            else
            {
                // Hiding success message
                document.getElementById('log-download-success').setAttribute('visible', false);

                // Displaying error message
                document.getElementById('log-download-error').setAttribute('visible', true);
            }
        }

        request.send('circle='+ this.currentCircle + '&allLogs=true');
    }
});