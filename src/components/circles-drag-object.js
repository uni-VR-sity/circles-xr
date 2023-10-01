'use strict';

// Allows user to drag object vertically and horizontally

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Moves object specified amount if it is within bounderies
const moveObject = function (object, newX, newY, max, min)
{
    // Ensuring object does not go over bounderies
    if (newX > max.x && newX < min.x && newY < max.y && newY > min.y)
    {
        object.setAttribute('position', {
            x: newX, 
            y: newY,
            z: object.getAttribute('position').z,
        });
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

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

        moveObject(object, objectX, objectY, max, min);

        prevX = event.clientX;
        prevY = event.clientY;
    }

    object.addEventListener('mousedown', function(event)
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

// Creating and displaying arrow UI elements
const arrowUI = function()
{
    // Container for UI
    var container = document.createElement('div');
    container.setAttribute('id', 'arrow-ui-container');

        // Container for arrows
        var arrowContainer = document.createElement('div');
        arrowContainer.setAttribute('id', 'arrow-container');

            // Up arrow container
            var upContainer = document.createElement('div');
            upContainer.setAttribute('class', 'vertical-arrow');

                // Up arrow
                var upArrow = document.createElement('i');
                upArrow.setAttribute('class', 'fa-solid fa-circle-up up-arrow');
                upArrow.setAttribute('id', 'up-arrow');

                upContainer.appendChild(upArrow);

            arrowContainer.appendChild(upContainer);

            // Horizontal arrows container
            var horizontalContainer = document.createElement('div');
            horizontalContainer.setAttribute('class', 'clearfix');

                // Left arrow container
                var leftContainer = document.createElement('div');
                leftContainer.setAttribute('class', 'horizontal-arrow');

                    // Left arrow
                    var leftArrow = document.createElement('i');
                    leftArrow.setAttribute('class', 'fa-solid fa-circle-left left-arrow');
                    leftArrow.setAttribute('id', 'left-arrow');

                    leftContainer.appendChild(leftArrow);

                horizontalContainer.appendChild(leftContainer);

                // Right arrow container
                var rightContainer = document.createElement('div');
                rightContainer.setAttribute('class', 'horizontal-arrow');

                    // Right arrow
                    var rightArrow = document.createElement('i');
                    rightArrow.setAttribute('class', 'fa-solid fa-circle-right right-arrow');
                    rightArrow.setAttribute('id', 'right-arrow');

                    rightContainer.appendChild(rightArrow);

                horizontalContainer.appendChild(rightContainer);

            arrowContainer.appendChild(horizontalContainer);

            // Down arrow container
            var downContainer = document.createElement('div');
            downContainer.setAttribute('class', 'vertical-arrow');

                // Down arrow
                var downArrow = document.createElement('i');
                downArrow.setAttribute('class', 'fa-solid fa-circle-down down-arrow');
                downArrow.setAttribute('id', 'down-arrow');

                downContainer.appendChild(downArrow);

            arrowContainer.appendChild(downContainer);

        container.appendChild(arrowContainer);

    document.getElementsByTagName('body')[0].appendChild(container);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding event listeners to arrows to move object within specified boundries
// Returns event listeners to clear
const arrowFunctionality = function(object, max, min)
{
    function move(direction)
    {
        const moveBy = 0.01;

        var newX = object.getAttribute('position').x;
        var newY = object.getAttribute('position').y;

        if (direction === 'up')
        {
            newY += moveBy;
        }
        else if (direction === 'left')
        {
            newX -= moveBy;
        }
        else if (direction === 'right')
        {
            newX += moveBy;
        }
        else if (direction === 'down')
        {
            newY -= moveBy;
        }

        moveObject(object, newX, newY, max, min);
    }

    var arrows = {
        up: document.getElementById('up-arrow'),
        left: document.getElementById('left-arrow'),
        right: document.getElementById('right-arrow'),
        down: document.getElementById('down-arrow'),
    };

    function addListeners(mobileVersion, arrowDirection, arrowElement)
    {
        var moveInterval;
        var pressEvent;
        var releaseEvent;

        if (mobileVersion)
        {
            pressEvent = 'touchstart';
            releaseEvent = 'touchend';
        }
        else
        {
            pressEvent = 'mousedown';
            releaseEvent = 'mouseup';
        }

        // When button is held, move object every 25 milliseconds
        arrowElement.addEventListener(pressEvent, function()
        {
            move(arrowDirection);

            moveInterval = setInterval(function() 
            {
                move(arrowDirection);

            }, 25);
        });

        // When button is released, stop moving object
        arrowElement.addEventListener(releaseEvent, function()
        {
            clearInterval(moveInterval);
        });
    }

    // Adding event listeners to each arrow
    // 'arrow'            = direction (key)
    // 'arrows[arrow]'    = element (value)
    for (const arrow in arrows)
    {
        // Detecting button holds are different on mobile and computer so adding event listeners for both

        // Computer
        addListeners(false, arrow, arrows[arrow]);

        // Mobile
        addListeners(true, arrow, arrows[arrow]);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Moving object with arrow UI when selected
const arrowMove = function(object, max, min)
{
    var objectPosition = {
        x: null,
        y: null,
    };

    // Making sure the object wasn't being dragged
    // If it was, don't select to appear UI
    object.addEventListener('mousedown', function()
    {
        objectPosition.x = object.getAttribute('position').x;
        objectPosition.y = object.getAttribute('position').y;
    });

    object.addEventListener('mouseup', function()
    {
        if (object.getAttribute('position').x === objectPosition.x && object.getAttribute('position').y === objectPosition.y)
        {
            // Displaying arrow UI
            arrowUI();

            // Adding arrow functionality
            arrowFunctionality(object, max, min);

            // Removing arrow UI when anything else is clicked (has to be removed to remove all event listeners for current object)
            function hideUI(event)
            {
                var container = document.getElementById('arrow-ui-container');

                if (event.target !== document.getElementById('up-arrow') && event.target !== document.getElementById('left-arrow') && event.target !== document.getElementById('right-arrow') && event.target !== document.getElementById('down-arrow'))
                {
                    function clearChildren(parent)
                    {
                        while (parent.children.length > 0)
                        {
                            if (parent.firstChild.children > 0);
                            {
                                clearChildren(parent.firstChild);
                            }

                            parent.removeChild(parent.firstChild);
                        }
                    }

                    clearChildren(container);

                    container.remove();
                    
                    window.removeEventListener('click', hideUI);
                }
            }

            // To not be triggered right away
            setTimeout(function()
            {
                // Adding event listener for when anywhere else is clicked, arrow UI is hidden
                window.addEventListener('click', hideUI);

            }, 100);
        }
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Moving object with joystick when selected
const joystickMove = function(object, max, min)
{
    // Getting controller and camera
    var controller = document.querySelector(['[raycaster], [hand-controls], [laser-controls]']);
    var camera = document.querySelector('[circles-snap-turning]');

    // Moving object when user moves joystick
    function move(event)
    {
        const moveBy = 0.01;

        var newX = object.getAttribute('position').x;
        var newY = object.getAttribute('position').y;

        // (0.2 for less sensitivity)
        if (event.detail.y < -0.2)
        {
            newY += moveBy;
        }
        else if (event.detail.y > 0.2)
        {
            newY -= moveBy;
        }

        if (event.detail.x < -0.2)
        {
            newX -= moveBy;
        }
        else if (event.detail.x > 0.2)
        {
            newX += moveBy;
        }

        moveObject(object, newX, newY, max, min);
    }

    // Disabling object movement
    function disableMove(event)
    {
        controller.removeEventListener('thumbstickmoved', move);

        camera.setAttribute('circles-snap-turning', {enabled: true});
        //camera.setAttribute('gamepad-controls', {enabled: true});

        window.removeEventListener('click', disableMove);
    }

    // Getting when object is clicked
    object.addEventListener('click', function()
    {
        // Putting event listener on controller joystick
        controller.addEventListener('thumbstickmoved', move);

        camera.setAttribute('circles-snap-turning', {enabled: false});
        //camera.setAttribute('gamepad-controls', {enabled: false});

        // To not be triggered right away
        setTimeout(function()
        {
            // Adding event listener for when anywhere else is clicked, joystick is disabled
            window.addEventListener('click', disableMove);

        }, 100);;
    });
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
        //    - Moving object with joystick when selected

        // Mobile
        if (AFRAME.utils.device.isMobile() === true)
        {
            arrowMove(element, CONTEXT_AF.data.maxCoordinate, CONTEXT_AF.data.minCoordinate);
        }
        // Headset
        else if (AFRAME.utils.device.checkHeadsetConnected() === true)
        {
            joystickMove(element, CONTEXT_AF.data.maxCoordinate, CONTEXT_AF.data.minCoordinate);
        }
        // Computer
        else
        {
            dragMove(element, CONTEXT_AF.data.maxCoordinate, CONTEXT_AF.data.minCoordinate);
            arrowMove(element, CONTEXT_AF.data.maxCoordinate, CONTEXT_AF.data.minCoordinate);
        }
    }
});