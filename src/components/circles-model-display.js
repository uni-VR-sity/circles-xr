'use strict';

AFRAME.registerComponent('circles-model-display', 
{
    schema: { type: 'string' },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.displayModel = this.displayModel.bind(this);

        // Getting model element
        this.modelElement = document.getElementById(schema);

        // Checking if model element was found
        if (this.modelElement && this.modelElement.components && this.modelElement.components['circles-model'])
        {
            // Displaying model when it has loaded (checking every 500 milliseconds)
            this.modelDisplayInterval = setInterval(this.displayModel, 500);
        }
        else
        {
            console.log('circles-model-display: #' + schema + ' not found');
        }
    },

    // Displaying model when it has loaded
    displayModel: function()
    {
        const element = this.el;
        const schema = this.data;

        if (this.modelElement.components['circles-model'].isComplete())
        {
            // If mesh loaded successfully, displaying it
            if (this.modelElement.components['circles-model'].getMesh() != null)
            {
                this.el.setObject3D('mesh', this.modelElement.components['circles-model'].getMesh().clone());
            }
            else
            {
                console.log('circles-model: ' + schema + ' failed to load');
            }

            // Clearing interval
            clearInterval(this.modelDisplayInterval);
        }
    }
});