'use strict';

// Controls file inserted into whiteboard

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Displaying image or video
const displayMedia = function(fileInfo, fileElement, desiredWidth)
{
    // Getting image aspect ratio (r = w/h)
    var aspectRatio = fileInfo.originalWidth / fileInfo.originalHeight;

    // Calculating height of file to maintain its aspect ratio (h = w/r)
    var desiredHeight = desiredWidth / aspectRatio;

    // Setting file element attributes to display it
    fileElement.setAttribute('geometry', {
        primitive: 'plane',
        width: desiredWidth,
        height: desiredHeight,
    });

    fileElement.setAttribute('material', {
        src: '#' + fileInfo.asset,
        shader: 'flat',
        transparent: true,
    });

    fileElement.setAttribute('position', {
        x: fileInfo.position.x,
        y: fileInfo.position.y,
        z: fileInfo.position.z,
    });

    return desiredHeight;
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// To show file is clicked (enable is true), put to front, and decrease other files' opacity
// When enable is false, reverse effects
const fileClickEffect = function(file, originalPos, enable)
{
    var whiteboard = file.parentElement.parentElement.parentElement;
    var fileContainer = file.parentElement;

    // File selected
    if (enable && !file.classList.contains('selected-file'))
    {
        // Getting the highest z value of files (to calculate the overlap of files)
        var files = file.parentElement.children;
        var maxZ = 0;

        for (const file of files)
        {
            if (file.getAttribute('position').z >= maxZ)
            {
                maxZ = file.getAttribute('position').z + 0.001;
            }
        }

        // Positioning file in front of all others on whiteboard
        file.setAttribute('position', {
            x: file.getAttribute('position').x,
            y: file.getAttribute('position').y,
            z: maxZ + 0.001,
        });

        // Adding overlay to decrease opacity of other files
        var overlay = document.createElement('a-entity');
        overlay.setAttribute('id', 'selected-file-overlay');
        overlay.setAttribute('class', 'interactive');

        overlay.setAttribute('position', {
            x: 0,
            y: 0,
            z: maxZ,
        });

        overlay.setAttribute('geometry', {
            primitive: 'plane',
            height: whiteboard.getAttribute('circles-whiteboard').height,
            width: whiteboard.getAttribute('circles-whiteboard').width,
        }); 

        overlay.setAttribute('material', {
            color: whiteboard.getAttribute('circles-whiteboard').boardColor,
            emissive: whiteboard.getAttribute('circles-whiteboard').boardColor,
            emissiveIntensity: 0.5,
            roughness: 0.5,
            opacity: 0.5,
        }); 

        fileContainer.appendChild(overlay); 

        // Labeling file as selected
        file.classList.add('selected-file');
    }
    // File unselected
    else if (enable === false && file.classList.contains('selected-file'))
    {
        // Positioning file back in the position it was
        file.setAttribute('position', {
            x: file.getAttribute('position').x,
            y: file.getAttribute('position').y,
            z: originalPos,
        });

        // Removing overlay
        var overlay = fileContainer.querySelector('#selected-file-overlay');
        overlay.parentNode.removeChild(overlay);

        // Removing selected label
        file.classList.remove('selected-file');
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// When file is clicked:
// - Activate view on whiteboard
// - Allow file to be dragged on whiteboard
const fileClick = function(file, originalPos, CONTEXT_AF)
{
    const user = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID).getAttribute('circles-visiblename');

    var whiteboard = file.parentElement.parentElement.parentElement;

    var filePosition = {
        x: null,
        y: null,
    };

    // Making sure the file wasn't being dragged
    // If it was, don't select

    file.addEventListener('mousedown', function()
    {
        // (NETWORKING) Emiting that file has been selected to update for all users
        CONTEXT_AF.socket.emit(CONTEXT_AF.fileSelectedEvent, {elementID:CONTEXT_AF.elementID, user:user, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

        filePosition.x = file.getAttribute('position').x;
        filePosition.y = file.getAttribute('position').y;

        // Disabling hover effect
        file.setAttribute('circles-interactive-object', {type:'none'});

        file.setAttribute('scale', {
            x: 1,
            y: 1,
            z: 1,
        });
    });

    file.addEventListener('mouseup', function()
    {
        if (file.getAttribute('position').x === filePosition.x && file.getAttribute('position').y === filePosition.y)
        {
            // (NETWORKING) Emiting that file has been selected to update for all users
            CONTEXT_AF.socket.emit(CONTEXT_AF.fileSelectedEvent, {elementID:CONTEXT_AF.elementID, user:user, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

            fileClickEffect(file, originalPos, true);

            // Activating file selected view on whiteboard
            whiteboard.setAttribute('circles-whiteboard', {fileSelected: true});

            var trash = whiteboard.querySelector('.trash-button');

            // Putting event listener on the whiteboard
            // When anything but the file is clicked, unselect file and default view is set back on whiteboard
            const fileUnselected = function(event)
            {
                if (event.target !== file)
                {
                    if (event.target !== trash)
                    {
                        // Enabling hover effect
                        file.setAttribute('circles-interactive-object', {type:'scale'});

                        fileClickEffect(file, originalPos, false);

                        whiteboard.setAttribute('circles-whiteboard', {fileSelected: false});
                        whiteboard.removeEventListener('click', fileUnselected);
                    }
                    else
                    {
                        // Removing overlay
                        var overlay = whiteboard.querySelector('#selected-file-overlay');
                        overlay.parentNode.removeChild(overlay);

                        whiteboard.setAttribute('circles-whiteboard', {fileSelected: false});
                        whiteboard.removeEventListener('click', fileUnselected);
                    }

                    // (NETWORKING) Emiting that file has been unselected to update for all users
                    // Delayed to give time for database to update
                    setTimeout(function()
                    {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.fileUnselectedEvent, {elementID:CONTEXT_AF.elementID, user:user, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                    }, CONTEXT_AF.fileUnselectedDelay);
                }
            }

            whiteboard.addEventListener('click', fileUnselected);
        }
        else if (!file.classList.contains('selected-file'))
        {
            // Enabling hover effect
            file.setAttribute('circles-interactive-object', {type:'scale'});

            // (NETWORKING) Emiting that file has been unselected to update for all users
            // Delayed to give time for database to update
            setTimeout(function()
            {
                CONTEXT_AF.socket.emit(CONTEXT_AF.fileUnselectedEvent, {elementID:CONTEXT_AF.elementID, user:user, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, CONTEXT_AF.fileUnselectedDelay);
        }
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-whiteboard-file', 
{
    schema: 
    {
        category: {type: 'string'},
        asset: {type: 'string'},
        whiteboardID: {type: 'string'},
        fileID: {type: 'string'},
        originalHeight: {type: 'number'},
        originalWidth: {type: 'number'},
        boardHeight: {type: 'number'},
        boardWidth: {type: 'number'},
        position: {type: 'vec3'},
        editable: {type: 'boolean'},

        selectedBy: {type: 'string'},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // Setting element ID
        CONTEXT_AF.elementID = 'whiteboardFile_' + CONTEXT_AF.data.fileID;

        element.setAttribute('id', CONTEXT_AF.elementID);

        CONTEXT_AF.networkMove = false;
        CONTEXT_AF.networkSelected = false;

        CONTEXT_AF.positionDatabaseDelay = 500
        CONTEXT_AF.fileUnselectedDelay = CONTEXT_AF.positionDatabaseDelay + 200;

        // Setting up networking
        if (CIRCLES.isCirclesWebsocketReady()) 
        {
            CONTEXT_AF.setUpNetworking();
        }
        else 
        {
            const wsReadyFunc = function() 
            {
                CONTEXT_AF.setUpNetworking();

                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            }

            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }

        var dimensions = {
            width: 0, 
            height: 0,
        };

        // Calculating desired width of file (1/6 of the whiteboard width)
        dimensions.width = CONTEXT_AF.data.boardWidth / 6;

        // Displaying file on whiteboard
        dimensions.height = displayMedia(CONTEXT_AF.data, element, dimensions.width);

        // Adding interactivity if current user can edit files
        if (CONTEXT_AF.data.editable)
        {
            // Hover effect
            element.setAttribute('circles-interactive-object', {
                type:'scale', 
                hover_scale: 1.05, 
                click_scale: 1.05,
            });

             // Onclick effect
            fileClick(element, CONTEXT_AF.data.position.z, this);

            // Making file draggable

            // Dragging boundries
            var maxX = -1 * ((CONTEXT_AF.data.boardWidth / 2) - (dimensions.width / 2));
            var maxY = (CONTEXT_AF.data.boardHeight / 2) - (dimensions.height / 2);
            var minX = (CONTEXT_AF.data.boardWidth / 2) - (dimensions.width / 2);
            var minY = -1 * ((CONTEXT_AF.data.boardHeight / 2) - (dimensions.height / 2));

            element.setAttribute('circles-drag-object', {
                maxCoordinate: {x: maxX, y: maxY},
                minCoordinate: {x: minX, y: minY},
            });

            // Updating elements position when it is changed to update the database
            // Using timeouts so that updates only occur when element stops moving

            var timeout;
            var timeoutStarted = false;

            function updatePos()
            {
                timeout = false;

                var elementPos = element.getAttribute('position');
                var oldPosition = element.getAttribute('circles-whiteboard-file').position;

                // Only updating if the x or y position have been changed (if only z position changed, the file was selected, not moved)
                if (elementPos.x !== oldPosition.x || elementPos.y !== oldPosition.y)
                {
                    var newPos = {
                        x: elementPos.x,
                        y: elementPos.y,
                        z: oldPosition.z,
                    }
        
                    element.setAttribute('circles-whiteboard-file', {position: newPos});

                    // (NETWORKING) Emiting that file has been moved to update for all users
                    CONTEXT_AF.socket.emit(CONTEXT_AF.fileMoveEvent, {elementID:CONTEXT_AF.elementID, newPos:element.getAttribute('position'), room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            }

            element.addEventListener('componentchanged', function(event) 
            {
                if (event.detail.name === 'position' && CONTEXT_AF.networkMove === false)
                {
                    if (timeoutStarted === false)
                    {
                        timeoutStarted = true;

                        timeout = setTimeout(updatePos, CONTEXT_AF.positionDatabaseDelay);
                    }
                    else
                    {
                        clearTimeout(timeout);
                        timeout = setTimeout(updatePos, CONTEXT_AF.positionDatabaseDelay);
                    }
                }
            });
        }

    },
    update: function(oldData) 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // If the file can be edited by the current user
        // When file is moved by the current user
        // Sending data to updated position of file in world database array

        if (CONTEXT_AF.data.editable)
        {
            if (CONTEXT_AF.data.position !== oldData.position && CONTEXT_AF.networkMove === false)
            {
                if (CONTEXT_AF.data.position && oldData.position)
                {
                    // Getting current world
                    // url: http://domain/w/World
                    // split result array: {'http', '', 'domain', 'w', 'World'}
                    var world = window.location.href.split('/')[4];

                    var request = new XMLHttpRequest();
                    request.open('POST', '/update-whiteboard-file-position');
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    request.send('file=' + CONTEXT_AF.data.fileID + '&world=' + world + '&newX=' + CONTEXT_AF.data.position.x + '&newY=' + CONTEXT_AF.data.position.y);
                }
            }
        }
    },
    setUpNetworking: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

        // Always showed:
        //    - Moved: File position is updated

        // Only showed if current user can edit files:
        //    - Selected: Shown that file is selected by another user and other users can not select it
        //    - Unselected: Normal view of file returns and other users can select it

        CONTEXT_AF.fileMoveEvent = 'whiteboard_file_move_event';
        CONTEXT_AF.fileSelectedEvent = 'whiteboard_file_selected_event';
        CONTEXT_AF.fileUnselectedEvent = 'whiteboard_file_unselected_event';
            
        // Listening for networking events to move files
        CONTEXT_AF.socket.on(CONTEXT_AF.fileMoveEvent, function(data) 
        {
            if (data.elementID === CONTEXT_AF.elementID)
            {
                // Signaling that the file is moving from a different user to not send an update to the database
                CONTEXT_AF.networkMove = true;

                var newPos = {
                    x: data.newPos.x,
                    y: data.newPos.y,
                    z: data.newPos.z,
                }
    
                element.setAttribute('circles-whiteboard-file', {position: newPos});

                element.setAttribute('position', newPos);

                setTimeout(function()
                {
                    CONTEXT_AF.networkMove = false;
                }, 100);
            }
        });

        if (CONTEXT_AF.data.editable)
        {
            // Listening for networking events to select files
            // If file is selected, other users can not interact with it
            CONTEXT_AF.socket.on(CONTEXT_AF.fileSelectedEvent, function(data)
            {
                if (data.elementID === CONTEXT_AF.elementID && !element.querySelector('#selected-by-user'))
                {
                    CONTEXT_AF.networkSelected = true;

                    // Visual indication that file is selected
                    element.setAttribute('material', {color: '#949494'});

                    var selectedText = document.createElement('a-entity');
                    selectedText.setAttribute('id', 'selected-by-user');

                    selectedText.setAttribute('text', {
                        value: 'Selected by ' + data.user,
                        align: 'center',
                        wrapCount: 10,
                        lineHeight: 60,
                    });

                    selectedText.setAttribute('scale', {
                        x: 0.6,
                        y: 0.6,
                        z: 0.6,
                    });

                    element.appendChild(selectedText);

                    // Disabling interaction
                    element.setAttribute('circles-interactive-object', {enabled: false});
                }

            });

            // Listening for networking events to select files
            CONTEXT_AF.socket.on(CONTEXT_AF.fileUnselectedEvent, function(data) 
            {
                if (data.elementID === CONTEXT_AF.elementID)
                {
                    // Removing visuals of selection
                    CONTEXT_AF.networkSelected = false;

                    element.setAttribute('material', {color: '#FFFFFF'});

                    var selectedText = element.querySelector('#selected-by-user');

                    selectedText.parentNode.removeChild(selectedText);

                    // Enabling interaction
                    element.setAttribute('circles-interactive-object', {enabled: true});;
                }

            });
        }
    },
});