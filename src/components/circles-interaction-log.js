'use strict';

// Component
AFRAME.registerComponent('circles-interaction-log', 
{
    schema:
    {
        event: {type:'string', default:'click'},
        name: {type:'string'},
        description: {type:'string'},
    }, 
    multiple: true,
    init: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;
        const schema = CONTEXT_AF.data;

        element.addEventListener(schema.event, function()
        {
            var logData = {};

            // Storing log name
            logData.name = schema.name;

            // Storing player position as an array
            var playerPos = document.getElementById('Player1').getAttribute('position')
            logData.position = [playerPos.x.toFixed(3), playerPos.y.toFixed(3), playerPos.z.toFixed(3)];

            // Storing log description
            logData.description = schema.description;

            // Getting circles-data-collector to save the log
            document.querySelector('[circles-data-collector]').components['circles-data-collector'].createLog(logData);
        });
    },
});