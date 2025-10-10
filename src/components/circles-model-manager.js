'use strict';

AFRAME.registerComponent('circles-model-manager', 
{
    sceneOnly: true,
    
    init: async function()
    {
        const element = this.el;
        const schema = this.data;

        this.setSceneReady = this.setSceneReady.bind(this);
        this.increaseModelQuality = this.increaseModelQuality.bind(this);
        this.checkModels = this.checkModels.bind(this);

        this.models = [];
        this.loadingModels = [];
        this.currentQuality = 0;
        this.maxQuality = 0;
        this.sceneReady = false;
        this.modelCheckInterval = null;

        // Getting all elements with the circle-model component
        this.models = Array.from(element.sceneEl.querySelectorAll('[circles-model]'));

        // Getting the max model quality availiable
        for (const model of this.models)
        {
            if (model.components['circles-model'].getMaxQuality() > this.maxQuality)
            {
                this.maxQuality = model.components['circles-model'].getMaxQuality();
            }
        }

        // Adding event listener to check if all models have finished loading to their max quality if scene has performance optimizer
        // Otherwise, start checking if all models have finished loading right away
        if (element.sceneEl.components['circles-performance-optimizer'])
        {
            element.sceneEl.addEventListener('target-quality-reached', this.setSceneReady);

            // Adding event listener to check if model should increase quality
            element.sceneEl.addEventListener('increase-model-quality', this.increaseModelQuality);

            this.startModelCheck();
        }
        else
        {
            this.setSceneReady();
        }
    },

    // Setting scene to be ready to check if all models have finished loading
    setSceneReady: function()
    {
        this.sceneReady = true;
        this.startModelCheck();
    },

    // Setting interval to check if all models have loaded every 500 milliseconds
    startModelCheck: function()
    {
        this.loadingModels = [...this.models];
        this.modelCheckInterval = setInterval(this.checkModels, 500);
    },

    // Checking if all models have loaded
    checkModels: function()
    {
        const element = this.el;
        const schema = this.data;

        // Removing models that have loaded
        this.loadingModels = this.loadingModels.filter(function(model)
        {
            return !model.components['circles-model'].isComplete();
        });

        // Checking if all models have loaded
        if (this.loadingModels.length == 0)
        {
            // Clearing interval
            clearInterval(this.modelCheckInterval);

            // If scene is ready, calling function in end scripts to indicate all models have loaded
            // Otherwise, emitting event to check scene
            if (this.sceneReady)
            {
                onModelLoad();
            }
            else
            {
                element.emit('check-scene');
            }
        }
    },

    // Emitting event to increase model quality
    increaseModelQuality: function()
    {
        const element = this.el;
        const schema = this.data;

        this.currentQuality++;

        // Emitting event if max quality has been reached
        // Otherwise start check for when higher quality models have finished loading
        if (this.currentQuality >= this.maxQuality)
        {
            element.emit('max-quality-reached');

            this.setSceneReady();
        }
        else
        {
            this.startModelCheck();
        }
    },
});