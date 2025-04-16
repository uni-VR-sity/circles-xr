// Highlights the gun when hovered over
// (Requires component as model is made out of seperate elements)

'user strict'

// Component
AFRAME.registerComponent('highlight_gun', 
{
    schema: 
    {
        // As there are 3 different guns, the entered id will be used to highlight the correct gun
        id : {type: 'string', default:''}
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        // Getting the gun element's children elements
        const gun_parts = document.querySelector('#' + CONTEXT_AF.data.id).children;
        const parts_num = gun_parts.length;

        // If gun is entered, increase the emissiveIntensity on all its parts
        CONTEXT_AF.el.addEventListener('mouseenter', function()
        {
            for (let i = 0; i < parts_num; i++)
            {
                gun_parts[i].setAttribute('material', {
                    emissiveIntensity: 0.7   
                });
            }
        });

        // If gun is left, decrease the emissiveIntensity on all its parts
        CONTEXT_AF.el.addEventListener('mouseleave', function()
        {
            for (let i = 0; i < parts_num; i++)
            {
                gun_parts[i].setAttribute('material', {
                    emissiveIntensity: 0.5   
                });
            }
        });
    }
});