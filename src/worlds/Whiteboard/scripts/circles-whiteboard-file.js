'use strict';

// Controls file inserted into whiteboard

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Displaying image or video
const displayMedia = function(fileInfo, fileElement, desiredWidth, orderPosition)
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
        z: 0.001 * orderPosition,
    });

    return desiredHeight;
}

// Displaying PDF
// Resources: 
// - https://mozilla.github.io/pdf.js/examples/
// - https://webdesign.tutsplus.com/how-to-create-a-pdf-viewer-in-javascript--cms-32505t
// - https://medium.com/geekculture/how-to-use-pdf-js-and-how-to-create-a-simple-pdf-viewer-for-your-web-in-javascript-5cff608a3a10
const displayPDF = function(fileInfo, fileElement, desiredWidth, orderPosition)
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
                z: 0.001 * orderPosition,
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

// To show file is clicked (enable is true), increase its scale, put to front, and decrease other files' opacity
// When enable is false, reverse effects
const fileClickEffect = function(file, originalPos, enable)
{
    var whiteboard = file.parentElement.parentElement.parentElement;
    var fileContainer = file.parentElement;

    // File selected
    if (enable && !file.classList.contains('selected-file'))
    {
        console.log('selected');
        // Disabling hover effect
        file.setAttribute('circles-interactive-object', {type:'none'});

        // Increasing scale
        file.setAttribute('scale', {
            x: 1.05,
            y: 1.05,
            z: 1.05,
        });

        // Getting number of files already displayed on the whiteboard (to calculate the overlap of files)
        var numFiles = file.parentElement.children.length;

        // Positioning file in front of all others on whiteboard
        file.setAttribute('position', {
            x: 0,
            y: 0,
            z: 0.001 * (numFiles + 2),
        });

        // Adding overlay to decrease opacity of other files
        var overlay = document.createElement('a-entity');
        overlay.setAttribute('id', 'selected-file-overlay');
        overlay.setAttribute('class', 'interactive');

        overlay.setAttribute('position', {
            x: 0,
            y: 0,
            z: 0.001 * (numFiles + 1),
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
        console.log('remove');
        // Returning scale
        file.setAttribute('scale', {
            x: 1,
            y: 1,
            z: 1,
        });

        // Positioning file back in the position it was
        file.setAttribute('position', {
            x: 0,
            y: 0,
            z: 0.001 * originalPos,
        });

        // Removing overlay
        var overlay = fileContainer.querySelector('#selected-file-overlay');
        overlay.parentNode.removeChild(overlay);

        // Enabling hover effect
        file.setAttribute('circles-interactive-object', {type:'scale'});

        // Removing selected label
        file.classList.remove('selected-file');
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// When file is clicked:
// - Activate view on whiteboard
// - Allow file to be dragged on whiteboard
const fileClick = function(file, originalPos)
{
    var whiteboard = file.parentElement.parentElement.parentElement;

    file.addEventListener('click', function()
    {
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

        // (to calculate the overlap of files)
        var orderPosition = Array.prototype.indexOf.call(element.parentElement.children, element);

        // Displaying file on whiteboard depending on the category of file
        if (CONTEXT_AF.data.category === 'image' || CONTEXT_AF.data.category === 'video')
        {
            dimensions.height = displayMedia(CONTEXT_AF.data, element, dimensions.width, orderPosition);
        }
        else
        {
            dimensions.height = displayPDF(CONTEXT_AF.data, element, dimensions.width, orderPosition);
        }

        // Hover effect
        element.classList.add('interactive');

        element.setAttribute('circles-interactive-object', {
            type:'scale', 
            hover_scale: 1.05, 
            click_scale: 1.05,
        });

        // Onclick effect
        fileClick(element, orderPosition);
    }
});