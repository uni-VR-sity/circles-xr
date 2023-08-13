'use strict';

// Allows user to drag object vertically and horizontally

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Allowing object to be dragged when clicked and held
// When object is clicked down on, look controls are disabled. When object is released, look controls are enabled again
const dragMove = function(object, max, min)
{
    var prevX;
    var prevY;

    var camera = document.querySelector('[camera]');

    // Function to drag object everytime the mouse moves
    function drag(event)
    {
        var moveX = (prevX - event.clientX) / 200;
        var moveY = (prevY - event.clientY) / 200;

        var objectX = object.getAttribute('position').x - moveX;
        var objectY = object.getAttribute('position').y + moveY;

        // Ensuring object does not go over bounderies
        if (objectX > max.x && objectX < min.x && objectY < max.y && objectY > min.y)
        {
            object.setAttribute('position', {
                x: objectX, 
                y: objectY,
                z: object.getAttribute('position').z,
            });
        }

        prevX = event.clientX;
        prevY = event.clientY;
    }

    object.addEventListener('mousedown', (event) =>
    {
        // Disabling look controls on camera
        camera.setAttribute('look-controls', {enabled: false});

        prevX = event.detail.mouseEvent.clientX;
        prevY = event.detail.mouseEvent.clientY;

        document.addEventListener('mousemove', drag);
    });

    object.addEventListener('mouseup', function()
    {
        // Enabling look controls on camera
        camera.setAttribute('look-controls', {enabled: true});

        // Removing mouse check
        document.removeEventListener('mousemove', drag);
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Moving object with UI when selected
const arrowUI = function()
{
    
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Moving object with joystick when clicked and held
// When object is clicked down on, look controls are disabled. When object is released, look controls are enabled again
const joystickMove = function()
{
    
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-drag-object', 
{
    schema: 
    {
        maxCoordinate: {type: 'vec2'},
        minCoordinate: {type: 'vec2'},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // The way the user can move the object depends on the type of device
        // Computer:
        //    - Draggable when object is clicked and held
        //    - Arrow UI when object is selected
        // Mobile:
        //    - Arrow UI when object is selected
        // Headset:
        //    - Draggable when object is clicked and held
        //    - Moveable with joystick when object is clicked and held

        // Mobile
        if (AFRAME.utils.device.isMobile() === true)
        {
            arrowUI();
        }
        // Headset
        else if (AFRAME.utils.device.checkHeadsetConnected() === true)
        {
            dragMove(element, CONTEXT_AF.data.maxCoordinate, CONTEXT_AF.data.minCoordinate);
            joystickMove();
        }
        // Computer
        else
        {
            dragMove(element, CONTEXT_AF.data.maxCoordinate, CONTEXT_AF.data.minCoordinate);
            arrowUI();
        }
    }
});