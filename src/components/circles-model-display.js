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
            // If model is already loaded, displaying it
            if (this.modelElement.components['circles-model'].isComplete())
            {
                this.displayModel();
            }

            // Adding event listener to display model when loaded (even if it is already loaded in case it is updated)
            this.modelElement.addEventListener('model-loaded', this.displayModel);
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

        // If mesh loaded successfully, displaying it
        var model = this.modelElement.components['circles-model'].getModel();

        if (model != null)
        {
            // Getting model details
            var format = this.modelElement.components['circles-model'].getFormat();
            var modelDetails = null;

            if (format == 'gltf')
            {
                var modelDetails = model.scene || model.scenes[0];
                modelDetails.animations = model.animations;
            }
            else if (format == 'fbx')
            {
                var modelDetails = model;
            }

            // Removing old mesh
            element.removeObject3D('mesh');
            
            // Displaying model
            if (model.animations.length > 0)
            {
                element.setObject3D('mesh', modelDetails);
            }
            else
            {
                element.setObject3D('mesh', modelDetails.clone());
            }
        }
        else
        {
            console.log('circles-model: ' + schema + ' failed to load');
        }
    }
});