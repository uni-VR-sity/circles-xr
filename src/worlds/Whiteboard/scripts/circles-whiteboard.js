'use strict';

// Generates and controls whiteboard

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Getting information on current user
const getUserRestrictions = function(uploadingRestrictions, editingRestrictions, customUploading, customEditing)
{
    var userRestrictions = {
        canUpload: false,
        canEdit: false,
    }

    // Getting user information
    const userElement = document.getElementsByClassName('user_cam_rig')[0];

    const userInfo = {
        username: userElement.getAttribute('circles-username'),
        usertype: userElement.getAttribute('circles-usertype').toLowerCase(),
    }

    // Filtering uploading restrictions to all be lowercase
    for (var i = 0; i < uploadingRestrictions.length; i++)
    {
        uploadingRestrictions[i] = uploadingRestrictions[i].toLowerCase();
    }

    // Filtering editing restrictions to all be lowercase
    for (var i = 0; i < editingRestrictions.length; i++)
    {
        editingRestrictions[i] = editingRestrictions[i].toLowerCase();
    }

    // Configuring uploading restrictions
    if (uploadingRestrictions.includes('all'))
    {
        userRestrictions.canUpload = true;
    }
    else if (uploadingRestrictions.includes(userInfo.usertype))
    {
        userRestrictions.canUpload = true;
    }
    else if (uploadingRestrictions.includes('custom'))
    {
        if (customUploading.includes(userInfo.username))
        {
            userRestrictions.canUpload = true;
        }
    }
    else if (uploadingRestrictions.includes('none'))
    {
        userRestrictions.canUpload = false;
    }

    // Guests can't upload files
    if (userInfo.usertype === 'guest' || userInfo.usertype === 'magic guest')
    {
        userRestrictions.canUpload = false;
    }

    // Superuser can always upload files
    if (userInfo.usertype === 'superuser')
    {
        userRestrictions.canUpload = true;
    }

    // Configuring editing restrictions
    if (editingRestrictions.includes('all'))
    {
        userRestrictions.canEdit = true;
    }
    else if (editingRestrictions.includes(userInfo.usertype))
    {
        userRestrictions.canEdit = true;
    }
    else if (uploadingRestrictions.includes('custom'))
    {
        if (customEditing.includes(userInfo.username))
        {
            userRestrictions.canEdit = true;
        }
    }
    else if (uploadingRestrictions.includes('none'))
    {
        userRestrictions.canEdit = false;
    }

    // Superuser can always edit files
    if (userInfo.usertype === 'superuser')
    {
        userRestrictions.canEdit = true;
    }

    return userRestrictions;
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Uploading assets for whiteboard into world
const uploadAssets = function()
{
    // Getting Asset Management System
    var assetManager = document.getElementsByTagName('a-assets')[0];

    // Upload symbol
    var upload = document.createElement('img');
    upload.setAttribute('id', 'upload_symbol');
    upload.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/arrow-up-from-bracket-solid.svg');

    assetManager.appendChild(upload);

    // Draw symbol
    var draw = document.createElement('img');
    draw.setAttribute('id', 'draw_symbol');
    draw.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/pencil-solid.svg');

    assetManager.appendChild(draw);

    // Message symbol
    var message = document.createElement('img');
    message.setAttribute('id', 'message_symbol');
    message.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/comments-solid.svg');

    assetManager.appendChild(message);

    // Trash symbol
    var trash = document.createElement('img');
    trash.setAttribute('id', 'trash_symbol');
    trash.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/trash-solid.svg');

    assetManager.appendChild(trash);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating upload button at the top of controller base
// Takes the controller base (parentElement), and its dimensions
const generateUpload = function(whiteboardElement, parentElement, height, width, depth, canUpload, maxUploadReached)
{
    var uploadButton = document.createElement('a-entity');
    uploadButton.setAttribute('class', 'upload-button interactive');

    // Position: Base is split into 3 sections (for 3 symbols)
    //           Upload symbol is at the top
    //           Therefore it is a section height up from the middle

    uploadButton.setAttribute('position', {
        x: 0,
        y: height / 3,
        z: (depth / 2) + 0.001,
    });

    // Dimensions: Symbols are 0.3 times the width of the base
    uploadButton.setAttribute('geometry', {
        primitive: 'plane',
        height: width / 3,
        width: width / 3,
    }); 

    // If user can't upload files then symbol is greyed out
    // If the max upload is reached then symbol is red
    if (canUpload && !maxUploadReached)
    {
        uploadButton.setAttribute('material', {
            src: '#upload_symbol',
            transparent: true,
        }); 
    }
    else if (canUpload && maxUploadReached)
    {
        uploadButton.setAttribute('material', {
            src: '#upload_symbol',
            transparent: true,
            emissive: '#bf0000',
            opacity: 0.3,
        }); 
    }
    else
    {
        uploadButton.setAttribute('material', {
            src: '#upload_symbol',
            transparent: true,
            opacity: 0.3,
        }); 
    }

    parentElement.appendChild(uploadButton); 

    // Only adding interactivity is user can upload files and the max upload has not been reached
    // If the max upload has been reached, when upload button is hovered, warning is displayed
    if (canUpload && !maxUploadReached)
    {
        // Adding effect when hovered
        uploadButton.setAttribute('circles-interactive-object', {type:'scale', hover_scale: 1.15});

        // When clicked, activate 'circles-upload-file' for the current whiteboard
        uploadButton.addEventListener('click', function()
        {
            document.querySelector('[circles-upload-whiteboard-ui]').setAttribute('circles-upload-whiteboard-ui', 'active:true; whiteboardID:' + whiteboardElement.getAttribute('id'));
        });
    }
    else if (maxUploadReached)
    {
        var warningMessage = whiteboardElement.querySelector('.warning');

        uploadButton.addEventListener('mouseenter', function()
        {
            warningMessage.setAttribute('visible', true);
        });

        uploadButton.addEventListener('mouseleave', function()
        {
            warningMessage.setAttribute('visible', false);
        });
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating message button in the middle of controller base
// Takes the controller base (parentElement), and its dimensions
const generateMessage = function(parentElement, height, width, depth)
{
    var messageButton = document.createElement('a-entity');
    messageButton.setAttribute('class', 'message-button interactive');

    // Position: Base is split into 3 sections (for 3 symbols)
    //           Message symbol is in the middle
    //           Therefore it is at (0,0)

    messageButton.setAttribute('position', {
        x: 0,
        y: 0,
        z: (depth / 2) + 0.001,
    });

    // Dimensions: Symbols are 0.3 times the width of the base
    messageButton.setAttribute('geometry', {
        primitive: 'plane',
        height: width / 3,
        width: width / 3,
    }); 

    messageButton.setAttribute('material', {
        src: '#message_symbol',
        transparent: true,
    }); 

    parentElement.appendChild(messageButton); 

    // Adding effect when hovered
    messageButton.setAttribute('circles-interactive-object', {type:'scale', hover_scale: 1.15});
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating draw button at the bottom of controller base
// Takes the controller base (parentElement), and its dimensions
const generateDraw = function(parentElement, height, width, depth)
{
    var drawButton = document.createElement('a-entity');
    drawButton.setAttribute('class', 'draw-button interactive');

    // Position: Base is split into 3 sections (for 3 symbols)
    //           Draw symbol is at the bottom
    //           Therefore it is a section height down from the middle

    drawButton.setAttribute('position', {
        x: 0,
        y: - (height / 3),
        z: (depth / 2) + 0.001,
    });

    // Dimensions: Symbols are 0.3 times the width of the base
    drawButton.setAttribute('geometry', {
        primitive: 'plane',
        height: width / 3,
        width: width / 3,
    }); 

    drawButton.setAttribute('material', {
        src: '#draw_symbol',
        transparent: true,
    }); 

    parentElement.appendChild(drawButton); 

    // Adding effect when hovered
    drawButton.setAttribute('circles-interactive-object', {type:'scale', hover_scale: 1.15});
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating trash button at the bottom of controller base
// Takes the controller base (parentElement), and its dimensions
const generateTrash = function(parentElement, height, width, depth, whiteboard, CONTEXT_AF)
{
    var trashButton = document.createElement('a-entity');
    trashButton.setAttribute('class', 'trash-button interactive');

    // Position: Base is split into 3 sections (for 3 symbols)
    //           Trash symbol is at the bottom
    //           Therefore it is a section height down from the middle

    trashButton.setAttribute('position', {
        x: 0,
        y: - (height / 3),
        z: (depth / 2) + 0.001,
    });

    // Dimensions: Symbols are 0.3 times the width of the base
    trashButton.setAttribute('geometry', {
        primitive: 'plane',
        height: width / 3,
        width: width / 3,
    }); 

    trashButton.setAttribute('material', {
        src: '#trash_symbol',
        transparent: true,
        emissive: '#c70000',
    }); 

    parentElement.appendChild(trashButton); 

    // Adding effect when hovered
    trashButton.setAttribute('circles-interactive-object', {type:'scale', hover_scale: 1.15});

    // Deleting selected file when clicked
    trashButton.addEventListener('click', function()
    {
        whiteboard.setAttribute('circles-whiteboard', {fileDeleted: true});

        // Getting selected file
        var file = whiteboard.getElementsByClassName('selected-file')[0];
        
        var fileName = file.getAttribute('circles-whiteboard-file').fileID;
        
        // Deleting file element
        file.parentNode.removeChild(file);

        // Sending data to remove selected file to world database array

        // Getting current world
        // url: http://domain/w/World
        // split result array: {'http', '', 'domain', 'w', 'World'}
        var world = window.location.href.split('/')[4];

        var request = new XMLHttpRequest();
        request.open('POST', '/remove-whiteboard-file');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.send('file=' + fileName + '&world=' + world);

        // (NETWORKING) Emiting that a file has been deleted to update for all users
        CONTEXT_AF.socket.emit(CONTEXT_AF.fileDeletedEvent, {fileID:file.getAttribute('id'), whiteboardID:whiteboard.getAttribute('id'), room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Generating default controller base
const generateDefaultController = function(whiteboard, preferences, restrictions, maxUploadReached)
{
    // Checking if the base doesn't already exist
    if (!whiteboard.querySelector('.default-controller'))
    {
        var controllerBase = whiteboard.querySelector('.board-controller');

        var controllerWidth = preferences.width * 0.2;

        var defaultController = document.createElement('a-entity');
        defaultController.setAttribute('class', 'default-controller');

        generateUpload(whiteboard, defaultController, preferences.height, controllerWidth, preferences.depth, restrictions.canUpload, maxUploadReached);
        generateMessage(defaultController, preferences.height, controllerWidth, preferences.depth);
        generateDraw(defaultController, preferences.height, controllerWidth, preferences.depth);

        controllerBase.appendChild(defaultController);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Regenerating upload button to update it status (If user can upload files or not - If file limit has been reached)
const regenerateUpload = function(whiteboard, preferences, restrictions, maxUploadReached)
{
    var defaultController = whiteboard.querySelector('.default-controller');

    var controllerWidth = preferences.width * 0.2;

    // Deleting old upload button
    var uploadButton = defaultController.querySelector('.upload-button');    
    uploadButton.parentNode.removeChild(uploadButton);

    // Generating new upload button
    generateUpload(whiteboard, defaultController, preferences.height, controllerWidth, preferences.depth, restrictions.canUpload, maxUploadReached);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Generating default controller base
const generateFileSelectedController = function(whiteboard, preferences, CONTEXT_AF)
{
    if (!whiteboard.querySelector('.file-selected-controller'))
    {
        var controllerBase = whiteboard.querySelector('.board-controller');

        var controllerWidth = preferences.width * 0.2;

        var fileSelectedController = document.createElement('a-entity');
        fileSelectedController.setAttribute('class', 'file-selected-controller');

        generateTrash(fileSelectedController, preferences.height, controllerWidth, preferences.depth, whiteboard, CONTEXT_AF);

        controllerBase.appendChild(fileSelectedController);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating whiteboard element
const generateWhiteboard = function(parentElement, preferences, restrictions)
{
    // Base
    var boardBase = document.createElement('a-entity');
    boardBase.setAttribute('class', 'board-base interactive');

    boardBase.setAttribute('geometry', {
        primitive: 'box',
        height: preferences.height,
        width: preferences.width,
        depth: preferences.depth,
    }); 

    boardBase.setAttribute('material', {
        color: preferences.boardColor,
        emissive: preferences.boardColor,
        emissiveIntensity: 0.5,
        roughness: 0.5,
    }); 

    boardBase.setAttribute('shadow', {
        cast: preferences.shadows, 
        receive: preferences.shadows,
    }); 

    parentElement.appendChild(boardBase); 

    // Warning message
    var warningMessage = document.createElement('a-entity');
    warningMessage.setAttribute('class', 'warning');

    warningMessage.setAttribute('visible', false);

    warningMessage.setAttribute('text', {
        value: 'File upload limit reached',
        color: '#bf0000',
        align: 'center',
        wrapCount: 25,
    });

    warningMessage.setAttribute('geometry', {
        primitive: 'plane',
        height: 0.4,
        width: 2,
    });

    warningMessage.setAttribute('material', {
        color: preferences.boardColor,
        emissive: preferences.boardColor,
        emissiveIntensity: 0.5,
        roughness: 0.5,
    });

    warningMessage.setAttribute('position', {
        x: 0,
        y: (preferences.height / 2) + 0.5,
        z: 0,
    });

    boardBase.appendChild(warningMessage);

    // File Container
    var fileContainer = document.createElement('a-entity');
    fileContainer.setAttribute('class', 'board-files');

    fileContainer.setAttribute('position', {
        x: 0,
        y: 0,
        z: ((preferences.depth / 2) + 0.001),
    });

    boardBase.appendChild(fileContainer);

    // Controller base
    var boardControls = document.createElement('a-entity');
    boardControls.setAttribute('class', 'board-controller interactive');

    var controllerWidth = preferences.width * 0.2;

    boardControls.setAttribute('geometry', {
        primitive: 'box',
        height: preferences.height,
        width: controllerWidth,
        depth: preferences.depth,
    });

    boardControls.setAttribute('material', {
        color: preferences.boardColor,
        emissive: '#000000',
        emissiveIntensity: 0.5,
        roughness: 0.5,
    });

    boardControls.setAttribute('shadow', {
        cast: preferences.shadows, 
        receive: preferences.shadows,
    }); 

    boardControls.setAttribute('position', {
        x: (preferences.width / 2) + (controllerWidth / 2),
        y: 0,
        z: 0,
    });

    parentElement.appendChild(boardControls);

    // Default controller base
    generateDefaultController(parentElement, preferences, restrictions, false);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding the file asset to world
const addFileAsset = function(name, category)
{
    // Getting Asset Management System
    var assetManager = document.getElementsByTagName('a-assets')[0];

    // Making sure this file doesn't already exist as an asset
    // If it doesn't, create the asset
    // If it does, just display it on the whiteboard
    if (!document.getElementById('asset_' + name))
    {
        var asset;

        // Adding asset to manager depending on the type of file it is
        if (category === 'image')
        {
            asset = document.createElement('img');

            asset.setAttribute('src', '/whiteboard-file/' + name);
        }
        else if (category === 'video')
        {
            asset = document.createElement('video');

            asset.setAttribute('preload', 'auto');
            asset.setAttribute('autoplay', '');
            asset.setAttribute('muted', '');
            asset.setAttribute('loop', '');

            asset.setAttribute('src', '/whiteboard-file/' + name);
        }
        else
        {
            asset = document.createElement('canvas');

            asset.setAttribute('crossorigin', 'anonymous');
        }

        asset.setAttribute('id', 'asset_' + name);

        assetManager.appendChild(asset);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting previously inserted files
const getFiles = function(whiteboard, CONTEXT_AF)
{
    // Getting whiteboard id
    var id = whiteboard.getAttribute('id');

    // Getting current world
    // url: http://domain/w/World
    // split result array: {'http', '', 'domain', 'w', 'World'}
    var world = window.location.href.split('/')[4];

    // Sending data to query the world database array
    // (Will be sent back information about the files on the whiteboard)
    var request = new XMLHttpRequest();
    request.open('POST', '/get-whiteboard-files');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var files = JSON.parse(request.response);

        if (files)
        {
            // Getting file container in whiteboard
            var container = whiteboard.querySelector('.board-files');

            // Displaying each file
            for (const file of files)
            {
                addFileAsset(file.name, file.category);

                // Creating file entity to insert into container

                var fileObject = document.createElement('a-entity');

                fileObject.setAttribute('circles-whiteboard-file', {
                    category: file.category,
                    asset: 'asset_' + file.name,
                    whiteboardID: whiteboard.getAttribute('id'),
                    fileID: file.name,
                    originalHeight: file.height,
                    originalWidth: file.width,
                    boardHeight: whiteboard.getAttribute('circles-whiteboard').height,
                    boardWidth: whiteboard.getAttribute('circles-whiteboard').width,
                    position: {
                        x: file.position[0],
                        y: file.position[1],
                        z: file.position[2],
                    },
                    editable: CONTEXT_AF.userRestrictions.canEdit,
                });

                container.appendChild(fileObject);
            }

            CONTEXT_AF.numFiles = files.length;
        }
        else
        {
            CONTEXT_AF.numFiles = 0;
        }

        // If the whiteboard already has the file limit, restricting uploads
        if (CONTEXT_AF.numFiles >= CONTEXT_AF.data.maxFiles)
        {
            regenerateUpload(whiteboard, CONTEXT_AF.data, CONTEXT_AF.userRestrictions, true);
        }
    }

    request.send('whiteboardID='+ id + '&world=' + world);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-whiteboard', 
{
    schema: 
    {
        height: {type: 'number', default: 3},
        width: {type: 'number', default: 5},
        depth: {type: 'number', default: 0.25},
        boardColor: {type: 'color', default: '#ffffff'},
        shadows: {type: 'boolean', default: false},
        maxFiles: {type: 'number', default: 5},
        uploadingRestrictions: {type: 'array', default: ['all']},
        editingRestrictions: {type: 'array', default: ['all']},
        customUploading: {type: 'array'},
        customEditing: {type: 'array'},

        fileSelected: {type: 'boolean', default: false},
        fileInserted: {type: 'boolean', default: false},
        fileDeleted: {type: 'boolean', default: false},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        CONTEXT_AF.data.fileSelected = false;

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

        // Getting username and type of current user
        CONTEXT_AF.userRestrictions = getUserRestrictions(CONTEXT_AF.data.uploadingRestrictions, CONTEXT_AF.data.editingRestrictions, CONTEXT_AF.data.customUploading, CONTEXT_AF.data.customEditing);

        // Making sure this is the first circles-whiteboard component to the run
        // If it is, running what only needs to be run once
        if (document.querySelectorAll('[circles-whiteboard]')[0].getAttribute('id') === element.getAttribute('id'))
        {
            // Uploading assets needed for whiteboard
            uploadAssets();

            // Creating element for uploading files (there should only be 1 that all whiteboards use)
            element.setAttribute('circles-upload-whiteboard-ui', '');
        }

        // Generating whiteboard
        generateWhiteboard(element, CONTEXT_AF.data, CONTEXT_AF.userRestrictions);

        // Adding previously inserted files
        getFiles(element, CONTEXT_AF);
    },
    update: function() 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // When file is selected or unselected

        // If selected, show appropriate view on controller
        // If unselected, show default view
        if (CONTEXT_AF.data.fileSelected === true)
        {
            if (element.querySelector('.default-controller'))
            {
                var controllerToDelete = element.querySelector('.default-controller');
            
                controllerToDelete.parentNode.removeChild(controllerToDelete);
            }

            generateFileSelectedController(element, CONTEXT_AF.data, CONTEXT_AF);
        }
        else if (CONTEXT_AF.data.fileSelected === false)
        {
            if (element.querySelector('.file-selected-controller'))
            {
                var controllerToDelete = element.querySelector('.file-selected-controller');
            
                controllerToDelete.parentNode.removeChild(controllerToDelete);
            }

            var maxUploadReached = CONTEXT_AF.numFiles === CONTEXT_AF.data.maxFiles;

            generateDefaultController(element, CONTEXT_AF.data, CONTEXT_AF.userRestrictions, maxUploadReached);
        }

        // When file is inserted

        // Updating count of files on board
        // If maximum is reached, setting warning message and disabling uploads
        if (CONTEXT_AF.data.fileInserted === true)
        {
            CONTEXT_AF.numFiles ++;

            if (CONTEXT_AF.numFiles === CONTEXT_AF.data.maxFiles)
            {
                // Checking if the default controller is activated
                // If it is, regenerate upload button to disable it
                // If it isn't, uploads will be disabled when default controller returned
                if (element.querySelector('.default-controller'))
                {
                    regenerateUpload(element, CONTEXT_AF.data, CONTEXT_AF.userRestrictions, true);
                }
            }

            element.setAttribute('circles-whiteboard', {fileInserted: false});
        }

        // When file is deleted

        // Updating count of files on board
        // If upload was at its maximum before deletion, enable uploading again 
        if (CONTEXT_AF.data.fileDeleted === true)
        {
            if (CONTEXT_AF.numFiles === CONTEXT_AF.data.maxFiles)
            {
                // Checking if the default controller is activated
                // If it is, regenerate upload button to enable it
                // If it isn't, uploads will be enabled when default controller returned
                if (element.querySelector('.default-controller'))
                {
                    regenerateUpload(element, CONTEXT_AF.data, CONTEXT_AF.userRestrictions, false);
                }
            }

            CONTEXT_AF.numFiles --;

            element.setAttribute('circles-whiteboard', {fileDeleted: false});
        }
    },
    setUpNetworking: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

        // Deleted: File is deleted from whiteboard

        CONTEXT_AF.fileDeletedEvent = 'whiteboard_file_delete_event';
            
        // Listening for networking events to delete a file
        CONTEXT_AF.socket.on(CONTEXT_AF.fileDeletedEvent, function(data)
        {
            if (element.getAttribute('id') === data.whiteboardID)
            {
                var file = document.getElementById(data.fileID);
                
                file.parentNode.removeChild(file);

                element.setAttribute('circles-whiteboard', {fileDeleted: true});
            }
        });
    },
    getUserRestrictions: function()
    {
        const CONTEXT_AF = this;

        return CONTEXT_AF.userRestrictions;
    }
});