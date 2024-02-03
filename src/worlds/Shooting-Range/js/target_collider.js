// Deals with when a bullet collides with a target (component is added to target when it has been hit)
// - Deletes target element
// - Update the hit counter by 1

'user strict'

// Functions

// Component
AFRAME.registerComponent('target_collider', 
{
    init : function() 
    {
        const CONTEXT_AF = this;

        var element = CONTEXT_AF.el;

        element.parentNode.removeChild(element);
    }
});