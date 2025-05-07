'use strict';

AFRAME.registerComponent('circles-model-manager', 
{
    sceneOnly: true,
    
    init: async function()
    {
        const element = this.el;
        const schema = this.data;

        this.checkModels = this.checkModels.bind(this);

        this.models = [];

        // Getting all elements with the circle-model component
        this.models = Array.from(element.sceneEl.querySelectorAll('[circles-model]'));

        // Checking if all models have finished loading every 500 miliseconds
        this.modelCheckInterval = setInterval(this.checkModels, 500);
    },

    // Checking if all models have loaded
    checkModels: function()
    {
        // Removing models that have loaded
        this.models = this.models.filter(function(model)
        {
            return !model.components['circles-model'].isComplete();
        });

        // Checking if all models have loaded
        if (this.models.length == 0)
        {
            // Calling function in end scripts to indicate all models have loaded
            onModelLoad();

            // Clearing interval
            clearInterval(this.modelCheckInterval);
        }
    }
});