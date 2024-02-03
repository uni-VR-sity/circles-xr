// Bullet moves every frame along its direction vector

'user strict'

// Component
AFRAME.registerComponent('move_bullet', 
{
    schema: 
    {
        // The direction vector the bullet is moving ins
        vectorX : {type: 'number', default: 0},
        vectorY : {type: 'number', default: 0},
        vectorZ : {type: 'number', default: 0}
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        var element = CONTEXT_AF.el;

        // Creating the movement vector for the bullet and normalizing it
        var movementVector = new THREE.Vector3(CONTEXT_AF.data.vectorX, CONTEXT_AF.data.vectorY, CONTEXT_AF.data.vectorZ);
        movementVector.normalize();
    
        // Moving the bullet by 0.1 times the movement vector each time
        movementVector.multiplyScalar(0.1);

        // Moving bullet every millisecond
        setInterval(function()
        {
            // Getting vector of bullet's position
            var bulletPos = new THREE.Vector3();
            element.object3D.getWorldPosition(bulletPos);

            var newPos = new THREE.Vector3();
            newPos.addVectors(bulletPos, movementVector);

            element.setAttribute('position', {
                x: newPos['x'],
                y: newPos['y'],
                z: newPos['z']
            });

        }, 1);
    }
});