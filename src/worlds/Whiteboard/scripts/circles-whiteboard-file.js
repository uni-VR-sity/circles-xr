'use strict';

// Controls file inserted into whiteboard

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Displaying image
const displayImage = function(fileInfo, fileElement, desiredWidth, numFiles)
{
    // Getting image aspect ratio (w/h)
    var aspectRatio = fileInfo.originalWidth / fileInfo.originalHeight;

    // Calculating height of file to maintain its aspect ratio
    var desiredHeight = desiredWidth / aspectRatio;

    // Setting file element attributes to display it
    fileElement.setAttribute('geometry', {
        primitive: 'plane',
        width: desiredWidth,
        height: desiredHeight,
    });

    fileElement.setAttribute('material', {
        src: '#' + fileInfo.id,
        shader: 'flat',
    });

    fileElement.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0.001 * numFiles,
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-whiteboard-file', 
{
    schema: 
    {
        category: {type: 'string'},
        id: {type: 'string'},
        originalHeight: {type: 'number'},
        originalWidth: {type: 'number'},
        boardHeight: {type: 'number'},
        boardWidth: {type: 'number'},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // Calculating desired width of file (1/6 of the whiteboard width)
        var desiredWidth = CONTEXT_AF.data.boardWidth / 6;

        // Getting number of files already displayed on the whiteboard (to calculate the overlap of files)
        var numFiles = element.parentElement.children.length;

        // Displaying file on whiteboard depending on the category of file
        if (CONTEXT_AF.data.category === 'image')
        {
            displayImage(CONTEXT_AF.data, element, desiredWidth, numFiles);
        }
    }
});