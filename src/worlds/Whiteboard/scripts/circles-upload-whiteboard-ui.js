'use strict';

// Generates pop up UI for inserting files onto whiteboard(s)

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Creating file asset for displaying
const createAsset = function(file)
{
    // Getting Asset Management System
    var assetManager = document.getElementsByTagName('a-assets')[0];

    // Making sure this file doesn't already exist as an asset
    // If it doesn't, create the asset
    if (!document.getElementById('asset_' + file.name))
    {
        var asset;

        // Adding asset to manager depending on the type of file it is
        if (file.category === 'image')
        {
            asset = document.createElement('img');

            asset.setAttribute('src', '/uploads/' + file.name);
        }
        else if (file.category === 'video')
        {
            asset = document.createElement('video');

            asset.setAttribute('preload', 'auto');
            asset.setAttribute('autoplay', '');
            asset.setAttribute('muted', '');
            asset.setAttribute('loop', '');

            asset.setAttribute('src', '/uploads/' + file.name);
        }

        asset.setAttribute('id', 'asset_' + file.name);

        assetManager.appendChild(asset);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating pop up element (for computer and mobile)
const generatePopUp_Computer_Mobile = function()
{
    // Container
    var container = document.createElement('div');

    container.setAttribute('id', 'upload-content-container');
    container.setAttribute('class', 'overlay');

        // Title
        var title = document.createElement('h1');

        title.innerHTML = 'Insert File';

        container.append(title);

        // Close button container
        var closeContainer = document.createElement('div');

        closeContainer.setAttribute('class', 'close-upload');

            // Close button
            var closeButton = document.createElement('i');

            closeButton.setAttribute('class', 'fa-solid fa-xmark fa-2xl');

            closeContainer.append(closeButton);

        closeContainer.addEventListener('click', function()
        {
            document.querySelector('[circles-upload-whiteboard-ui]').setAttribute('circles-upload-whiteboard-ui', 'active:false');
        });

        container.appendChild(closeContainer);

        // Line 
        var line = document.createElement('hr');
        container.appendChild(line);

    document.getElementsByTagName('body')[0].appendChild(container);

}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Uploading assets for UI (for headset)
const uploadAssets_Headset = function()
{
    // Getting Asset Management System
    var assetManager = document.getElementsByTagName('a-assets')[0];

    // X symbol
    var x = document.createElement('img');
    x.setAttribute('id', 'x_symbol');
    x.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/xmark.svg');

    assetManager.appendChild(x);

    // Left arrow symbol
    var leftArrow = document.createElement('img');
    leftArrow.setAttribute('id', 'left_arrow_symbol');
    leftArrow.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/angle-left.svg');

    assetManager.appendChild(leftArrow);

    // Right arrow symbol
    var rightArrow = document.createElement('img');
    rightArrow.setAttribute('id', 'right_arrow_symbol');
    rightArrow.setAttribute('src', '/global/assets/textures/icons/font_awesome_icons/angle-right.svg');

    assetManager.appendChild(rightArrow);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Selecting file
// Adding insert button to insert content to whiteboard (for headset)
const insertFileElement = function(event)
{
    // Getting element that was clicked
    var file = event.target;

    var CONTEXT_AF = file.CONTEXT_AF;

    file.classList.add('file-selected');

    // Removing element event listener
    file.removeEventListener('click', insertFileElement);

    // Disabling element
    file.setAttribute('circles-interactive-object', {
        enabled: false,
    });

    file.setAttribute('scale', {
        x: 1.10,
        y: 1.10,
        z: 1.10,
    });

    // Creating insert button and adding on top of the file
    var overlay = document.createElement('a-entity');

    overlay.setAttribute('geometry', {
        primitive: 'plane',
        height: 0.5,
        width: 0.5,
    });
    
    overlay.setAttribute('material', {
        shader: 'flat',
        color: '#FFFFFF',
        opacity: '0.5',
    });

    overlay.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0.005,
    });

        // Button
        var button = document.createElement('a-entity');

        button.setAttribute('geometry', {
            primitive: 'plane',
            height: 0.15,
            width: 0.3,
        });
        
        button.setAttribute('material', {
            shader: 'flat',
            color: '#0078e7',
        });
    
        button.setAttribute('position', {
            x: 0,
            y: 0,
            z: 0.005,
        });

        button.setAttribute('circles-interactive-object', {
            type:'scale', 
            hover_scale: 1.05, 
            click_scale: 1.05,
        });

        // When button is clicked, insert file to whiteboard
        button.addEventListener('click', function()
        {
            insertFile(CONTEXT_AF);

            // Closing pop up
            document.querySelector('[circles-upload-whiteboard-ui]').setAttribute('circles-upload-whiteboard-ui', 'active:false');
        });

            // Button text
            var text = document.createElement('a-entity');

            text.setAttribute('text', {
                value: 'Insert',
                color: '#FFFFFF',
                align: 'center',
            });

            text.setAttribute('scale', {
                x: 1.3,
                y: 1.3,
                z: 1.3,
            });
        
            text.setAttribute('position', {
                x: 0,
                y: 0,
                z: 0.005,
            });

            button.appendChild(text);

        overlay.appendChild(button);

    file.appendChild(overlay);

    // When anything but the insert button is clicked, unselect file
    var UI = document.getElementById('upload-content-container');

    const fileUnselected = function(event)
    {
        if (event.target !== button)
        {
            file.classList.remove('file-selected');
        }

        if (event.target !== button && event.target !== UI.querySelector('#close-pop-up'))
        {
            // Enabling element
            file.setAttribute('circles-interactive-object', {
                enabled: true,
            });
        }

        // Deleting overlay
        overlay.parentNode.removeChild(overlay);

        // Adding element event listener back
        file.CONTEXT_AF = CONTEXT_AF;
        file.addEventListener('click', insertFileElement);

        UI.removeEventListener('click', fileUnselected);
    }

    // To not be triggered right away
    setTimeout(function()
    {
        UI.addEventListener('click', fileUnselected);

    }, 100);;
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating pop up element (for headset)
const generatePopUp_Headset = function()
{
    uploadAssets_Headset();

    // Container
    var container = document.createElement('a-entity');
    container.setAttribute('id', 'upload-content-container');
    container.setAttribute('class', 'interactive');

    container.setAttribute('visible', 'false');

    container.setAttribute('circles-lookat', {
        targetElement: document.querySelector('[camera]'),
        constrainYAxis: true,
        contraintedX: -10,
        contraintedZ: 0,
        smoothingAlpha: 0.01,
    });

    container.setAttribute('geometry', {
        primitive: 'plane', 
        height: 2, 
        width: 3,
    });

    container.setAttribute('material', {
        emissive: '#d1d1d1', 
        side: 'double', 
        color: '#d1d1d1',
    });

        // Title
        var title = document.createElement('a-entity');

        title.setAttribute('text', {
            align: 'center',
            color: '#000000',
            value: 'Insert File',
        });

        title.setAttribute('position', {
            x: -1,
            y: 0.75, 
            z: 0.001,
        });

        title.setAttribute('scale', {
            x: 2.5, 
            y: 2.5,
            z: 2.5,
        });

        container.appendChild(title);

        // Page indicator
        var page = document.createElement('a-entity');
        page.setAttribute('id', 'page-indicator');

        page.setAttribute('text', {
            align: 'center',
            color: '#000000',
        });

        page.setAttribute('position', {
            x: 0,
            y: 0.75, 
            z: 0.005,
        });

        page.setAttribute('scale', {
            x: 2.5, 
            y: 2.5,
            z: 2.5,
        });

        container.appendChild(page);

        // X
        var x = document.createElement('a-entity');
        x.setAttribute('id', 'close-pop-up');

        x.setAttribute('geometry', {
            primitive: 'plane', 
            height: 0.15, 
            width: 0.125,
        });
    
        x.setAttribute('material', {
            transparent: true,
            src: '#x_symbol',
        });

        x.setAttribute('position', {
            x: 1.11,
            y: 0.75, 
            z: 0.005,
        });

        x.setAttribute('circles-interactive-object', {
            type:'scale', 
            hover_scale: 1.15, 
            click_scale: 1.15,
            enabled: false,
        });

        x.addEventListener('click', function()
        {
            document.querySelector('[circles-upload-whiteboard-ui]').setAttribute('circles-upload-whiteboard-ui', 'active:false');
        });

        container.appendChild(x);

        // Title divider
        var divider = document.createElement('a-entity');

        divider.setAttribute('geometry', {
            primitive: 'plane', 
            height: 0.006, 
            width: 2.5,
        });
    
        divider.setAttribute('material', {
            shader: 'flat',
            color: '#000000',
        });

        divider.setAttribute('position', {
            x: 0,
            y: 0.6, 
            z: 0.005,
        });

        container.appendChild(divider);

    document.getElementsByTagName('a-scene')[0].appendChild(container);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating file container with element to display files (for headset)
const createFileContainer = function(CONTEXT_AF)
{
    var UI = document.getElementById('upload-content-container');

    // File container
    var fileContainer = document.createElement('a-entity');
    fileContainer.setAttribute('id', 'file-container');

        var xPos = -0.7;
        var yPos = 0.17;

        // 6 files on a page
        for (var i = 0; i < 6; i++)
        {
            if (xPos === 0.7)
            {
                xPos = -0.7;
                yPos = -0.5;
            }
            else if (i !== 0)
            {
                xPos += 0.7;
            }

            var file = document.createElement('a-entity');
            file.setAttribute('class', 'file-element');

            file.setAttribute('geometry', {
                primitive: 'plane', 
                height: 0.5, 
                width: 0.5,
            });
        
            file.setAttribute('material', {
                shader: 'flat',
                transparent: true,
            });
    
            file.setAttribute('position', {
                x: xPos,
                y: yPos,
                z: 0.005,
            });

            file.setAttribute('circles-interactive-object', {
                type: 'scale',
                hover_scale: 1.10, 
                click_scale: 1.10,
                enabled: false,
            });

            // Adding event listener to select file
            file.CONTEXT_AF = CONTEXT_AF;
            file.addEventListener('click', insertFileElement);
    
            fileContainer.appendChild(file);
        }

        UI.appendChild(fileContainer);

        // Left arrow
        var leftArrow = document.createElement('a-entity');
        leftArrow.setAttribute('id', 'back-arrow');

        leftArrow.setAttribute('geometry', {
            primitive: 'plane', 
            height: 0.2, 
            width: 0.15,
        });

        leftArrow.setAttribute('material', {
            transparent: true,
            src: '#left_arrow_symbol',
        });

        leftArrow.setAttribute('position', {
            x: -1.25,
            y: -0.145,
            z: 0.005,
        });

        leftArrow.setAttribute('circles-interactive-object', {
            type:'scale', 
            hover_scale: 1.15, 
            click_scale: 1.15,
            enabled: false,
        });

        UI.appendChild(leftArrow);

        // Right arrow
        var rightArrow = document.createElement('a-entity');
        rightArrow.setAttribute('id', 'forward-arrow');

        rightArrow.setAttribute('geometry', {
            primitive: 'plane', 
            height: 0.2, 
            width: 0.15,
        });

        rightArrow.setAttribute('material', {
            transparent: true,
            src: '#right_arrow_symbol',
        });

        rightArrow.setAttribute('position', {
            x: 1.25,
            y: -0.145,
            z: 0.005,
        });

        rightArrow.setAttribute('circles-interactive-object', {
            type:'scale', 
            hover_scale: 1.15, 
            click_scale: 1.15,
            enabled: false,
        });

        UI.appendChild(rightArrow);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying error message to user (for computer and mobile)
const renderError_Computer_Mobile = function(message)
{
    // Getting pop up container
    var container = document.getElementById('upload-content-container');

    // Creating element to display error
    var error = document.createElement('div');

    error.setAttribute('class', 'error-message');
    error.innerHTML = message;

    container.appendChild(error);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying error message to user (for headset)
const renderError_Headset = function(message)
{
    var UI = document.getElementById('upload-content-container');

    // Error message
    var error = document.createElement('a-entity');

    error.setAttribute('text', {
        align: 'center',
        color: '#000000',
        value: message,
    });

    error.setAttribute('position', {
        x: 0,
        y: 0.3, 
        z: 0.005,
    });

    error.setAttribute('scale', {
        x: 2, 
        y: 2,
        z: 2,
    });

    UI.appendChild(error);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying file on whiteboard (for computer and mobile)
const displayFile = function(whiteboardID, fileID, fileInfo)
{
    // Getting whiteboard to display file on 
    var whiteboard = document.getElementById(whiteboardID);

    // Getting file container in whiteboard
    var container = whiteboard.querySelector('.board-files');

    // Creating file entity to insert into container
    var file = document.createElement('a-entity');
    
    file.setAttribute('circles-whiteboard-file', {
        category: fileInfo.category,
        asset: fileID,
        whiteboardID: whiteboardID,
        fileID: fileInfo._id,
        originalHeight: fileInfo.height,
        originalWidth: fileInfo.width,
        boardHeight: whiteboard.getAttribute('circles-whiteboard').height,
        boardWidth: whiteboard.getAttribute('circles-whiteboard').width,
        position: {
            x: fileInfo.position[0],
            y: fileInfo.position[1],
            z: fileInfo.position[2],
        },
    });

    container.appendChild(file);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Inserting file into world and world database
const insertFile = function(CONTEXT_AF)
{
    var UI = document.getElementById('upload-content-container');

    // Finding the file that was selected
    var fileContainer = UI.querySelector('.file-selected');
    var file = fileContainer.getAttribute('id');

    // Getting whiteboard to insert file to
    var whiteboard = document.querySelector('[circles-upload-whiteboard-ui]').getAttribute('circles-upload-whiteboard-ui').whiteboardID;

    // Getting current world
    // url: http://domain/w/World
    // split result array: {'http', '', 'domain', 'w', 'World'}
    var world = window.location.href.split('/')[4];

    // Sending data to add selected file to world database array
    // (Will be sent back information about selcted file)
    var request = new XMLHttpRequest();
    request.open('POST', '/insert-whiteboard-file');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Will be sent back information about selected file to insert the file on whiteboard
    request.onload = function() 
    {
        var fileInfo = JSON.parse(request.response);

        // Creating asset
        createAsset(fileInfo);

        // Displaying file on whiteboard
        displayFile(whiteboard, 'asset_' + fileInfo.name, fileInfo);

        // (NETWORKING) Emiting that a file has been inserted to update for all users
        CONTEXT_AF.socket.emit(CONTEXT_AF.fileInsertedEvent, {fileInfo:fileInfo, whiteboardID:whiteboard, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }

    request.send('file=' + file + '&whiteboardID='+ whiteboard + '&world=' + world);

    // Unselecting image
    fileContainer.classList.remove('file-selected');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding insert button to insert content to whiteboard (for computer and mobile)
const addButton = function(CONTEXT_AF)
{
    // Getting pop up container
    var container = document.getElementById('upload-content-container');

    var button = document.createElement('a');

    button.setAttribute('id', 'insert-button');
    button.setAttribute('class', 'button-inactive');
    button.innerHTML = 'Insert';

    // When button is clicked, if it is active, add selected file to whiteboard
    button.addEventListener('click', function() 
    {
        if (button.classList.contains('button-active'))
        {
            // Closing pop up
            document.querySelector('[circles-upload-whiteboard-ui]').setAttribute('circles-upload-whiteboard-ui', 'active:false');

            // Inserting file
            insertFile(CONTEXT_AF);
        }
    });

    container.appendChild(button);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// (for computer and mobile)
// When user presses a file, 
// - File is light up
// - Insert button is made active
const contentPress = function(contentElement)
{
    // If the file is current active, deactivate it
    // Otherwise, activate the file
    if (contentElement.classList.contains('file-selected'))
    {
        contentElement.classList.remove('file-selected');

        // Deactivating insert button
        var button = document.getElementById('insert-button');
        
        button.setAttribute('class', 'button-inactive');
    }
    else
    {
        // If another file is active, deactivate it
        var activeFiles = document.getElementsByClassName('file-selected');

        for (var file of activeFiles)
        {
            file.classList.remove('file-selected');
        }

        // Activate current file
        contentElement.classList.add('file-selected');

        // Activating insert button
        var button = document.getElementById('insert-button');

        button.setAttribute('class', 'button-active');
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying content uploaded by the user in a table on the pop up (for computer and mobile)
const displayContent = function(content)
{
    // Getting pop up container
    var container = document.getElementById('upload-content-container');

        // Creating table container
        var tableContainer = document.createElement('div');
        
        tableContainer.setAttribute('id', 'table-overflow-container');

            // Creating table to display content
            var table = document.createElement('table');

            table.setAttribute('id', 'uploads-table')

            // Content is displayed in rows of 5
            var numRows = Math.ceil(content.length / 5);

            for (var i = 0; i < numRows; i++)
            {
                var row = document.createElement('tr');

                    for (var j = 0; j < 5; j++)
                    {
                        var fileNum = (5 * i) + j;

                        // Ensuring that there is still content to display
                        if (fileNum < content.length)
                        {
                            var data = document.createElement('td');

                            data.setAttribute('class', 'file-table-section');

                                var fileContainer = document.createElement('div');

                                fileContainer.setAttribute('class', 'file-container');
                                fileContainer.setAttribute('id', content[fileNum].name);

                                    // Displaying the content in the appropriate way depending on the file type
                                    // Image files (with img tag)
                                    if (content[fileNum].category === 'image')
                                    {
                                        var image = document.createElement('img');

                                        image.setAttribute('src', '/uploads/' + content[fileNum].name);

                                        fileContainer.appendChild(image);
                                    }
                                    // Video files (with video tag)
                                    else if (content[fileNum].category === 'video')
                                    {
                                        var video = document.createElement('video');

                                        video.setAttribute('preload', 'auto');
                                        video.setAttribute('autoplay', '');
                                        video.setAttribute('muted', '');
                                        video.setAttribute('loop', '');
                                        video.setAttribute('playsinline', '');
                                        video.setAttribute('webkit-playsinline', '');

                                            var source = document.createElement('source');

                                            source.setAttribute('src', '/uploads/' + content[fileNum].name);

                                            video.appendChild(source);

                                        fileContainer.appendChild(video);
                                    }

                                data.appendChild(fileContainer);

                            row.appendChild(data);
                        }
                    }
                    
                table.appendChild(row);
            }

        tableContainer.appendChild(table);
    
    container.appendChild(tableContainer);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Getting content on pages for pop up (for headset)
const getPages = function(content)
{
    var length = content.length;
    var totalPages = Math.ceil(length / 6);

    // Getting what content will be on each page
    // (6 files per page)
    var pages = {};

    for (var i = 0; i < totalPages; i++)
    {
        // Getting files for page i
        var files = [];

        for (var j = i * 6; j < (i * 6) + 6; j++)
        {
            if (j < length)
            {
                files.push(content[j]);
            }
            else
            {
                files.push(null);
            }
        }
        
        // Adding files to pages object for page i
        pages['page_' + (i + 1)] = files;
    }

    return pages;
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying files on specified page (pageNum) (for headset)
// Returning current page being displayed
const displayPage = function(pages, pageNum)
{
    var totalPages = Object.keys(pages).length;

    // Ensuring pageNum is a valid page to display (between 1 and totalPages)
    // Otherwise not displaying anything
    if (pageNum > 0 && pageNum <= totalPages)
    {
        // Getting files for the page
        var files = pages['page_' + pageNum];

        // Getting UI and updating page indicator
        var UI = document.getElementById('upload-content-container');
        UI.querySelector('#page-indicator').setAttribute('text', {value: pageNum + ' / ' + totalPages});
        
        // Getting file display elements
        var fileElements = UI.querySelector('#file-container').children;

        // Displaying files
        for (var i = 0; i < files.length; i++)
        {
            // If there is a file to display, display it
            // Otherwise, hide element
            if (files[i])
            {
                // Getting image aspect ratio (r = w/h)
                var aspectRatio = files[i].width / files[i].height;

                // Getting proper width if height is 0.5 (w = rh)
                var width = aspectRatio * 0.5;

                // Displaying element with proper proportions
                var repeat = {x: 1, y: 1};
                var offset = {x: 0, y: 0};
                
                // Element width is 0.5
                // If the ideal width is less then 0.5 (portrait image), then the image height needs to be stretched
                // Otherwise (landscape image), the image width needs to be stretched
                if (width < 0.5)
                {
                    // Getting proper width if width is 0.5 (h = w/r)
                    var height = 0.5 / aspectRatio;

                    // Getting the amount of image that would be displayed in a height of 0.5
                    var ratioDisplayed = 0.5 / height;

                    repeat.y = ratioDisplayed;

                    offset.y = (1 - ratioDisplayed) / 2;
                }
                else if (width > 0.5)
                {
                    // Getting the amount of image that would be displayed in a width of 0.5
                    var ratioDisplayed = 0.5 / width;

                    repeat.x = ratioDisplayed;

                    offset.x = (1 - ratioDisplayed) / 2;
                }

                // Making element interactive
                fileElements[i].setAttribute('visible', true);

                fileElements[i].setAttribute('circles-interactive-object', {
                    enabled: true,
                });

                // Displaying file on element
                fileElements[i].setAttribute('material', { 
                    src: '#asset_' + files[i].name,
                    repeat: repeat,
                    offset: offset,
                });

                fileElements[i].setAttribute('id', files[i].name);
            }
            else
            {
                // Hiding element
                fileElements[i].setAttribute('circles-interactive-object', {
                    enabled: false,
                });

                fileElements[i].setAttribute('visible', false);
            }
        }

        return pageNum;
    }
    else if (!(pageNum > 0))
    {
        return 1;
    }
    else if (!(pageNum <= totalPages))
    {
        return totalPages;
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adjusting table width (for computer and mobile)
// (For when there is only 1, 2, 3, or 4 files uploaded, to still be displayed with the correct proportions)
const adjustWidth = function()
{
    // Getting the table
    var table = document.getElementById('uploads-table');

    // Getting the width of the table sections
    var width = (table.getBoundingClientRect().width) / 5;

    // Changing the table to have a max width of 100% 
    table.style.width = 'auto';
    table.style.maxWidth = '100%';

    // Getting all table sections
    var sections = table.querySelectorAll('.file-table-section');

    // Adjusting width of all table sections to be a fifth of the width of the table
    for (var section of sections)
    {
        section.style.width = width;
        
        // "Padding" between the file container and table section (the only way sections would stay of even width with padding)
        section.querySelector('.file-container').style.width = width - 40;
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-upload-whiteboard-ui', 
{
    schema: 
    {
      active: {type: 'boolean', default: false},
      whiteboardID: {type: 'string'},
    },
    init: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

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

        // Generating pop up base for displaying content

        // The way it is displayed depends on the device
        // Computer:
        //    - UI overlay
        // Mobile:
        //    - UI overlay
        // Headset:
        //    - Virtual UI

        // Headset
        if (AFRAME.utils.device.checkHeadsetConnected() === true)
        {
            generatePopUp_Headset();
        }
        // Computer and mobile
        else
        {
            generatePopUp_Computer_Mobile();
        }

        // Getting list of content uploaded by the user
        var request = new XMLHttpRequest();
        request.open('GET', '/get-user-uploaded-content');

        CONTEXT_AF.pages = {};

        request.onerror = function() 
        {
            // Generating error message

            // Headset
            if (AFRAME.utils.device.checkHeadsetConnected() === true)
            {
                renderError_Headset('An error occurred, please try again');
            }
            // Computer and mobile
            else
            {
                renderError_Computer_Mobile('An error occurred, please try again');
            }
        }

        request.onload = function() 
        {
            var content = JSON.parse(request.response);

            if (content.length > 0)
            {
                // Headset
                if (AFRAME.utils.device.checkHeadsetConnected() === true)
                {
                    // Creating content assets for displaying
                    for (var file of content)
                    {
                        createAsset(file);
                    }

                    // Creating elements to display content
                    createFileContainer(CONTEXT_AF);

                    // Organizing files into pages
                    CONTEXT_AF.pages = getPages(content);

                    // Displaying first page
                    CONTEXT_AF.currentPage = 1;

                    // Creating arrow event listeners for scrolling through pages
                    var UI = document.getElementById('upload-content-container');

                    var backArrow = UI.querySelector('#back-arrow');
                    var forwardArrow = UI.querySelector('#forward-arrow');

                        // Back arrow
                        backArrow.addEventListener('click', function()
                        {
                            CONTEXT_AF.currentPage --;
                            CONTEXT_AF.currentPage = displayPage(CONTEXT_AF.pages, CONTEXT_AF.currentPage);
                        });

                        // Forward arrow
                        forwardArrow.addEventListener('click', function()
                        {
                            CONTEXT_AF.currentPage ++;
                            CONTEXT_AF.currentPage = displayPage(CONTEXT_AF.pages, CONTEXT_AF.currentPage);
                        });
                }
                // Computer and mobile
                else
                {
                    // Displaying content the user uploaded on pop up
                    displayContent(content);

                    // Showing pop up as program can not get dimensions when elements are hidden
                    document.getElementById('upload-content-container').style.display = 'block';

                        // Adjusting table width
                        adjustWidth();

                    // Hiding pop up again
                    document.getElementById('upload-content-container').style.display = 'none';

                    // Adding upload button
                    addButton(CONTEXT_AF);

                    // Listening for when files are clicked to activate them to insert onto whiteboard

                    // Getting all file containers
                    var containers = document.getElementsByClassName('file-container');

                    // Adding event listeners to file containers
                    for (var container of containers)
                    {
                        container.addEventListener('click', function()
                        {
                            contentPress(container);
                        });
                    }
                }
            }
            else
            {
                // Headset
                if (AFRAME.utils.device.checkHeadsetConnected() === true)
                {
                    renderError_Headset('No content avaliable to insert');
                }
                // Computer and mobile
                else
                {
                    // Generating error message
                    renderError_Computer_Mobile("<b>No content avaliable to insert</b><p>Upload content <a href='/uploaded-content' target='_blank'>here</a></p>");
                }
            }
        };

        request.send();
    },
    update: function() 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // If active was set to true, display the pop up
        // If it was set to false, hide pop up

        // Headset
        if (AFRAME.utils.device.checkHeadsetConnected() === true)
        {
            if (CONTEXT_AF.data.active === true)
            {
                // Displaying UI
                CONTEXT_AF.currentPage = displayPage(CONTEXT_AF.pages, 1);

                var UI = document.getElementById('upload-content-container');
                UI.setAttribute('visible', 'true');

                // Enabling UI interaction (file element are enabled in displayPage() already)
                UI.classList.add('interactive');

                    // X element
                    UI.querySelector('#close-pop-up').setAttribute('circles-interactive-object', {
                        enabled: true,
                    });

                    // Back arrow
                    if (UI.querySelector('#back-arrow'))
                    {
                        UI.querySelector('#back-arrow').setAttribute('circles-interactive-object', {
                            enabled: true,
                        });
                    }

                    // Forward arrow
                    if (UI.querySelector('#forward-arrow'))
                    {
                        UI.querySelector('#forward-arrow').setAttribute('circles-interactive-object', {
                            enabled: true,
                        });
                    }

                // Getting information about where the user is to display pop up (for its position)
                var user = document.querySelector('[camera]');

                var position = new THREE.Vector3();
                user.querySelector('.UI-position').object3D.getWorldPosition(position);

                UI.setAttribute('position', {
                    x: position['x'],
                    y:  1.75,
                    z: position['z'],
                });
            }
            else
            {
                // Hiding UI
                var UI = document.getElementById('upload-content-container');
                UI.setAttribute('visible', 'false');

                // Disabling UI so user can't click on it when it is hidden (raycaster still picks up hidden objects)
                UI.classList.remove('interactive');

                    // File elements
                    var fileElements = UI.querySelectorAll('.file-element');

                    for (var file of fileElements)
                    {
                        file.setAttribute('circles-interactive-object', {
                            enabled: false,
                        });
                    }

                    // X element
                    UI.querySelector('#close-pop-up').setAttribute('circles-interactive-object', {
                        enabled: false,
                    });

                    // Back arrow
                    if (UI.querySelector('#back-arrow'))
                    {
                        UI.querySelector('#back-arrow').setAttribute('circles-interactive-object', {
                            enabled: false,
                        });
                    }

                    // Forward arrow
                    if (UI.querySelector('#forward-arrow'))
                    {
                        UI.querySelector('#forward-arrow').setAttribute('circles-interactive-object', {
                            enabled: false,
                        });
                    }
            }
        }
        // Computer and mobile
        else
        {
            if (CONTEXT_AF.data.active === true)
            {
                document.getElementById('upload-content-container').style.display = 'block';
            }
            else
            {
                document.getElementById('upload-content-container').style.display = 'none';
            }
        }
    },
    setUpNetworking: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

        // Inserted: File is inserted to whiteboard

        CONTEXT_AF.fileInsertedEvent = 'whiteboard_file_insert_event';
            
        // Listening for networking events to insert a file
        CONTEXT_AF.socket.on(CONTEXT_AF.fileInsertedEvent, function(data) 
        {
            // Creating asset
            createAsset(data.fileInfo);

            // Displaying file on whiteboard
            displayFile(data.whiteboardID, 'asset_' + data.fileInfo.name, data.fileInfo);
        });
    },
});