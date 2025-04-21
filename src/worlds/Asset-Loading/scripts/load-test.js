'use strict';

AFRAME.registerComponent('load-test', 
{
    schema: { type: 'string' },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        setTimeout(function()
        {
            element.setAttribute('circles-model-display', schema);

        }, 3000);
        
    },
});