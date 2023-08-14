'use strict';

// Generates and controls whiteboard

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Uploading assets for whiteboard into world
const uploadAssets = function()
{
    // Getting Asset Management System
    let assetManager = document.getElementsByTagName('a-assets')[0];

    // Upload symbol
    let upload = document.createElement('img');
    upload.setAttribute('id', 'upload_symbol');
    upload.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/arrow-up-from-bracket-solid.svg');

    assetManager.appendChild(upload);

    // Draw symbol
    let draw = document.createElement('img');
    draw.setAttribute('id', 'draw_symbol');
    draw.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/pencil-solid.svg');

    assetManager.appendChild(draw);

    // Message symbol
    let message = document.createElement('img');
    message.setAttribute('id', 'message_symbol');
    message.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/comments-solid.svg');

    assetManager.appendChild(message);

    // Trash symbol
    let trash = document.createElement('img');
    trash.setAttribute('id', 'trash_symbol');
    trash.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/trash-solid.svg');

    assetManager.appendChild(trash);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating upload button at the top of controller base
// Takes the controller base (parentElement), and its dimensions
const generateUpload = function(whiteboardElement, parentElement, height, width, depth)
{
    var uploadButton = document.createElement('a-entity');
    uploadButton.setAttribute('class', 'upload-button interactive');

    // Position: Base is split into 3 sections (for 3 symbols)
    //           Upload symbol is at the top
    //           Therefore it is a section height up from the middle

    uploadButton.setAttribute('position', {
        x: 0,
        y: height / 3,
        z: - ((depth / 2) + 0.001),
    });

    uploadButton.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0,
    }); 

    // Dimensions: Symbols are 0.3 times the width of the base
    uploadButton.setAttribute('geometry', {
        primitive: 'plane',
        height: width / 3,
        width: width / 3,
    }); 

    uploadButton.setAttribute('material', {
        src: '#upload_symbol',
        transparent: true,
    }); 

    parentElement.appendChild(uploadButton); 

    // Adding effect when hovered
    uploadButton.setAttribute('circles-interactive-object', {type:'scale', hover_scale: 1.15});

    // When clicked, activate 'circles-upload-file' for the current whiteboard
    uploadButton.addEventListener('click', function()
    {
        document.querySelector('[circles-upload-ui]').setAttribute('circles-upload-ui', 'active:true; whiteboardID:' + whiteboardElement.getAttribute('id'));
    });
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
        z: - ((depth / 2) + 0.001),
    });

    messageButton.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0,
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
        z: - ((depth / 2) + 0.001),
    });

    drawButton.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0,
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
const generateTrash = function(parentElement, height, width, depth, whiteboard)
{
    var trashButton = document.createElement('a-entity');
    trashButton.setAttribute('class', 'trash-button interactive');

    // Position: Base is split into 3 sections (for 3 symbols)
    //           Trash symbol is at the bottom
    //           Therefore it is a section height down from the middle

    trashButton.setAttribute('position', {
        x: 0,
        y: - (height / 3),
        z: - ((depth / 2) + 0.001),
    });

    trashButton.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0,
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
        // Getting selected file
        var file = document.getElementsByClassName('selected-file')[0];
        
        // Getting file name
        // id: asset_fileName
        // split result array: {asset', 'fileName'}
        var fileName = file.getAttribute('circles-whiteboard-file').asset.split('_')[1];
        
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

        request.send('file=' + fileName + '&whiteboardID='+ whiteboard.getAttribute('id') + '&world=' + world);
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Generating default controller base
const generateDefaultController = function(whiteboard, preferences)
{
    // Checking if the base doesn't already exist
    if (!whiteboard.querySelector('.default-controller'))
    {
        var controllerBase = whiteboard.querySelector('.board-controller');

        var controllerWidth = preferences.width * 0.2;

        var defaultController = document.createElement('a-entity');
        defaultController.setAttribute('class', 'default-controller');

        generateUpload(whiteboard, defaultController, preferences.height, controllerWidth, preferences.depth);
        generateMessage(defaultController, preferences.height, controllerWidth, preferences.depth);
        generateDraw(defaultController, preferences.height, controllerWidth, preferences.depth);

        controllerBase.appendChild(defaultController);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Generating default controller base
const generateFileSelectedController = function(whiteboard, preferences)
{
    if (!whiteboard.querySelector('.file-selected-controller'))
    {
        var controllerBase = whiteboard.querySelector('.board-controller');

        var controllerWidth = preferences.width * 0.2;

        var fileSelectedController = document.createElement('a-entity');
        fileSelectedController.setAttribute('class', 'file-selected-controller');

        generateTrash(fileSelectedController, preferences.height, controllerWidth, preferences.depth, whiteboard);

        controllerBase.appendChild(fileSelectedController);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating whiteboard element
const generateWhiteboard = function(parentElement, preferences)
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

    // File Container
    var fileContainer = document.createElement('a-entity');
    fileContainer.setAttribute('class', 'board-files');

    fileContainer.setAttribute('position', {
        x: 0,
        y: 0,
        z: - ((preferences.depth / 2) + 0.001),
    });

    fileContainer.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0,
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
        x: - ((preferences.width / 2) + (controllerWidth / 2)),
        y: 0,
        z: 0,
    });

    parentElement.appendChild(boardControls);

    // Default controller base
    generateDefaultController(parentElement, preferences);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding the file asset to world
const addFileAsset = function(name, category)
{
    // Getting Asset Management System
    let assetManager = document.getElementsByTagName('a-assets')[0];

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

            asset.setAttribute('src', '/uploads/' + name);
        }
        else if (category === 'video')
        {
            asset = document.createElement('video');

            asset.setAttribute('preload', 'auto');
            asset.setAttribute('autoplay', '');
            asset.setAttribute('muted', '');
            asset.setAttribute('loop', '');

            asset.setAttribute('src', '/uploads/' + name);
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
const getFiles = function(whiteboard)
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
                fileID: file._id,
                originalHeight: file.height,
                originalWidth: file.width,
                boardHeight: whiteboard.getAttribute('circles-whiteboard').height,
                boardWidth: whiteboard.getAttribute('circles-whiteboard').width,
                position: {
                    x: file.position[0],
                    y: file.position[1],
                    z: file.position[2],
                },
            });

            container.appendChild(fileObject);
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

        fileSelected: {type: 'boolean', default: false},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        CONTEXT_AF.data.fileSelected = false;

        // Making sure this is the first circles-whiteboard component to the run
        // If it is, running what only needs to be run once
        if (document.querySelectorAll('[circles-whiteboard]')[0].getAttribute('id') === element.getAttribute('id'))
        {
            // Uploading assets needed for whiteboard
            uploadAssets();

            // Creating element for uploading files (there should only be 1 that all whiteboards use)
            element.setAttribute('circles-upload-ui', '');
        }

        // Generating whiteboard
        generateWhiteboard(element, CONTEXT_AF.data);

        // Adding previously inserted files
        getFiles(element);
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

            generateFileSelectedController(element, CONTEXT_AF.data);
        }
        else if (CONTEXT_AF.data.fileSelected === false)
        {
            if (element.querySelector('.file-selected-controller'))
            {
                var controllerToDelete = element.querySelector('.file-selected-controller');
            
                controllerToDelete.parentNode.removeChild(controllerToDelete);
            }

            generateDefaultController(element, CONTEXT_AF.data);
        }
    }
});