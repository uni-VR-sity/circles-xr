'use strict';

// Controls file inserted into whiteboard

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Displaying image or video
const displayMedia = function(fileInfo, fileElement, desiredWidth, numFiles)
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
        src: '#' + fileInfo.id,
        shader: 'flat',
    });

    fileElement.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0.001 * numFiles,
    });

    return desiredHeight;
}

// Displaying PDF
// Resources: 
// - https://mozilla.github.io/pdf.js/examples/
// - https://webdesign.tutsplus.com/how-to-create-a-pdf-viewer-in-javascript--cms-32505t
// - https://medium.com/geekculture/how-to-use-pdf-js-and-how-to-create-a-simple-pdf-viewer-for-your-web-in-javascript-5cff608a3a10
const displayPDF = function(fileInfo, fileElement, desiredWidth, numFiles)
{
    // Attaching canvas updater to render the PDF
    fileElement.setAttribute('circles-canvas-updater','');

    // Getting PDF name
    // id: asset_fileName
    // split result array: {asset', 'fileName'}
    var fileName = fileInfo.id.split('_')[1];

    // Loading PDF in
    pdfjsLib.getDocument('/uploads/' + fileName).promise.then(function(pdf)
    {
        // Getting first page
        pdf.getPage(1).then(function(page) 
        {
            var canvas = document.getElementById(fileInfo.id);
            var ctx = canvas.getContext('2d');
            var viewport = page.getViewport({scale: 1.0});

            // Aspect ratio of PDF (r = w/h)
            var aspectRatio = viewport.width / viewport.height;

            // Calculating height of file to maintain its aspect ratio (h = w/r)
            var desiredHeight = desiredWidth / aspectRatio;

            // Setting file canvas container attributes to display it
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
                z: 0.002 * numFiles,
            });

            // Canvas and PDF dimensions are in pixels
            // All other dimensions are in meters
            // Conversion (from own calculation): 1m = 150px

            // Resolution (the higher, the slower the world)
            // Resolving blurry PDF: https://stackoverflow.com/questions/49426385/pdf-js-displays-pdf-documents-in-really-low-resolution-blurry-almost-is-this-h
            var resolution = 1;

            // Adjusting canvas dimensions (conversion to pixels)
            canvas.width =  resolution * viewport.width;
            canvas.height = resolution * viewport.height;

            canvas.style.height = desiredHeight * 150;
            canvas.style.width = desiredWidth * 150;

            // Rendering PDF
            page.render(
            {
                canvasContext: ctx,
                viewport: viewport,
                transform: [resolution, 0, 0, resolution, 0, 0],
            });

            return desiredHeight;
        });
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// When file is clicked:
// - Activate view on whiteboard
// - Allow file to be dragged on whiteboard
const fileClick = function(file)
{
    var whiteboard = file.parentElement.parentElement.parentElement;

    file.addEventListener('click', function()
    {
        file.classList.add('selected-file');

        // Activating file selected view on whiteboard
        whiteboard.setAttribute('circles-whiteboard', {fileSelected: true});

        // Putting event listener on the whiteboard
        // When anything but the file is clicked, default view is set back on whiteboard
        const fileUnselected = function(event)
        {
            if (event.target !== file)
            {
                file.classList.remove('selected-file');
                whiteboard.setAttribute('circles-whiteboard', {fileSelected: false});
                whiteboard.removeEventListener('click', fileUnselected);
            }
        }

        whiteboard.addEventListener('click', fileUnselected);
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

        var dimensions = {
            width: 0, 
            height: 0,
        };

        // Calculating desired width of file (1/6 of the whiteboard width)
        dimensions.width = CONTEXT_AF.data.boardWidth / 6;

        // Getting number of files already displayed on the whiteboard (to calculate the overlap of files)
        var numFiles = element.parentElement.children.length;

        // Displaying file on whiteboard depending on the category of file
        if (CONTEXT_AF.data.category === 'image' || CONTEXT_AF.data.category === 'video')
        {
            dimensions.height = displayMedia(CONTEXT_AF.data, element, dimensions.width, numFiles);
        }
        else
        {
            dimensions.height = displayPDF(CONTEXT_AF.data, element, dimensions.width, numFiles);
        }

        // Hover effect
        element.classList.add('interactive');

        element.setAttribute('circles-interactive-object',{type:'scale', hover_scale: 1.05});

        // Onclick effect
        fileClick(element);
    }
});