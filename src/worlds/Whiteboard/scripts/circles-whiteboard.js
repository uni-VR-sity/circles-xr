'use strict';

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
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// When button is hovered, it gets slightly bigger
const buttonHover = function(button, height, width)
{
    button.addEventListener('mouseenter', function()
    {
        button.setAttribute('geometry', {
            height: height * 1.2,
            width: width * 1.2,
        }); 
    });

    button.addEventListener('mouseleave', function()
    {
        button.setAttribute('geometry', {
            height: height,
            width: width,
        });
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating upload button at the top of controller base
// Takes the controller base (parentElement), and its dimensions
const generateUpload = function(parentElement, height, width, depth)
{
    var uploadButton = document.createElement('a-entity');
    uploadButton.setAttribute('id', 'upload');
    uploadButton.setAttribute('class', 'interactive');

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
    buttonHover(uploadButton, width / 3, width / 3);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating message button in the middle of controller base
// Takes the controller base (parentElement), and its dimensions
const generateMessage = function(parentElement, height, width, depth)
{
    var messageButton = document.createElement('a-entity');
    messageButton.setAttribute('id', 'message');
    messageButton.setAttribute('class', 'interactive');

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
    buttonHover(messageButton, width / 3, width / 3);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating draw button at the bottom of controller base
// Takes the controller base (parentElement), and its dimensions
const generateDraw = function(parentElement, height, width, depth)
{
    var drawButton = document.createElement('a-entity');
    drawButton.setAttribute('id', 'draw');
    drawButton.setAttribute('class', 'interactive');

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
    buttonHover(drawButton, width / 3, width / 3);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating whiteboard element
const generateWhiteboard = function(parentElement, preferences)
{
    // Base
    var boardBase = document.createElement('a-entity');
    boardBase.setAttribute('id', 'board_base');

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

    // Controller base
    var boardControls = document.createElement('a-entity');
    boardControls.setAttribute('id', 'board_controller');

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

    // Buttons on controller base
    generateUpload(boardControls, preferences.height, controllerWidth, preferences.depth);
    generateMessage(boardControls, preferences.height, controllerWidth, preferences.depth);
    generateDraw(boardControls, preferences.height, controllerWidth, preferences.depth);
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
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // Uploading assets needed for whiteboard
        uploadAssets();

        // Generating whiteboard
        generateWhiteboard(element, CONTEXT_AF.data);
    }
});