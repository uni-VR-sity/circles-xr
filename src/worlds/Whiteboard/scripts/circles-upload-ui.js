'use strict';

// Generates pop up UI for inserting files onto whiteboard(s)

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Functions

// Creating pop up element
const generatePopUp = function()
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
            document.querySelector('[circles-upload-ui]').setAttribute('circles-upload-ui', 'active:false');
        });

        container.appendChild(closeContainer);

        // Line 
        var line = document.createElement('hr');
        container.appendChild(line);

    document.getElementsByTagName('body')[0].appendChild(container);

}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying error message to user
const renderError = function(message)
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

// Displaying file on whiteboard
const displayFile = function(whiteboardID, fileID, fileInfo, fileElement)
{
    // Getting whiteboard to display file on 
    var whiteboard = document.getElementById(whiteboardID);

    // Getting file container in whiteboard
    var container = whiteboard.querySelector('.board-files');

    // Creating file entity to insert into container

    // If file is an image or video, getting their dimensions
    var height = -1;
    var width = -1;

    if (fileInfo.category === 'image')
    {
        height = fileElement.naturalHeight;
        width = fileElement.naturalWidth;
    }
    else if (fileInfo.category === 'video')
    {
        height = fileElement.videoHeight;
        width = fileElement.videoWidth;
    }

    var file = document.createElement('a-entity');
    file.setAttribute('circles-whiteboard-file', {
        type: fileInfo.category,
        id: fileID,
        originalHeight: height,
        originalWidth: width,
        boardHeight: whiteboard.getAttribute('circles-whiteboard').height,
        boardWidth: whiteboard.getAttribute('circles-whiteboard').width,
    });

    container.appendChild(file);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Inserting file into world and world database
const insertFile = function()
{
    // Closing pop up
    document.querySelector('[circles-upload-ui]').setAttribute('circles-upload-ui', 'active:false');

    // Finding the file that was selected
    var fileContainer = document.querySelector('.file-selected');
    var file = fileContainer.getAttribute('id');

    // Getting whiteboard to insert file to
    var whiteboard = document.querySelector('[circles-upload-ui]').getAttribute('circles-upload-ui').whiteboardID;

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

        // Getting Asset Management System
        let assetManager = document.getElementsByTagName('a-assets')[0];

        // Making sure this file doesn't already exist as an asset
        // If it doesn't, create the asset
        // If it does, just display it on the whiteboard
        if (!document.getElementById('asset_' + fileInfo.name))
        {
            var asset;

            // Adding asset to manager depending on the type of file it is
            if (fileInfo.category === 'image')
            {
                asset = document.createElement('img');
            }
            else if (fileInfo.category === 'video')
            {
                asset = document.createElement('video');
                asset.setAttribute('preload', 'auto');
                asset.setAttribute('autoplay', '');
            }
            else
            {
                asset = document.createElement('a-asset-item');
            }

            asset.setAttribute('id', 'asset_' + fileInfo.name);
            asset.setAttribute('src', '/uploads/' + fileInfo.name);

            assetManager.appendChild(asset);
        }

        // Displaying file on whiteboard
        displayFile(whiteboard, 'asset_' + fileInfo.name, fileInfo, fileContainer.firstChild);
    }

    request.send('file=' + file + '&whiteboardID='+ whiteboard + '&world=' + world);

    // Unselecting image
    fileContainer.classList.remove('file-selected');
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adding upload button to upload content to whiteboard
const addButton = function(whiteboard)
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
            insertFile(whiteboard);
        }
    });

    container.appendChild(button);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

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
        let button = document.getElementById('insert-button');
        
        button.setAttribute('class', 'button-inactive');
    }
    else
    {
        // If another file is active, deactivate it
        let activeFiles = document.getElementsByClassName('file-selected');

        for (let file of activeFiles)
        {
            file.classList.remove('file-selected');
        }

        // Activate current file
        contentElement.classList.add('file-selected');

        // Activating insert button
        let button = document.getElementById('insert-button');

        button.setAttribute('class', 'button-active');
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Displaying content uploaded by the user in a table on the pop up
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

                                        video.setAttribute('muted', 'muted');
                                        video.setAttribute('autoplay', 'autoplay');
                                        video.setAttribute('loop', 'loop');

                                            var source = document.createElement('source');

                                            source.setAttribute('src', '/uploads/' + content[fileNum].name);

                                            video.appendChild(source);

                                        fileContainer.appendChild(video);
                                    }
                                    // Text files (just displaying name of file)
                                    else
                                    {
                                        data.setAttribute('class', 'other-file-type file-table-section');

                                        // Icon
                                        var icon = document.createElement('i');

                                        icon.setAttribute('class', 'fa-regular fa-file file-icon');

                                        fileContainer.appendChild(icon);

                                        // Space
                                        var space = document.createElement('br');
                                        fileContainer.appendChild(space);

                                        // File name
                                        var name = document.createElement('p');

                                        name.setAttribute('class', 'fileName');
                                        name.innerHTML = content[fileNum].displayName;

                                        fileContainer.appendChild(name);
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

// Shortening file names to fit the width of the table data
const shortenNames = function()
{
    // Table section margins and padding sizes
    let sectionMargin = 30 * 4;
    let sectionPadding = 300;

    // Getting the width of the table sections
    let sectionWidth = (document.getElementById('uploads-table').getBoundingClientRect().width - sectionMargin - sectionPadding) / 4;

    // Going through each table section and checking if the length of the file name is greater then the width of the section
    // If it is, shorten it
    let nameElements = document.getElementsByClassName('fileName');

    for (let element of nameElements)
    {
        let name = element.innerHTML;
        let nameLength = element.getBoundingClientRect().width;

        if (nameLength > sectionWidth)
        {
            // The condensed name with be, for example, filena...txt (preserving the file type at the end of the name)
            
            // Getting the file type
            let splitName = name.split('.');
            let type = splitName[splitName.length - 1];

            let condensedName = name;
            
            // Taking a character off the file name until the length of the name is less then the section width
            while (nameLength > sectionWidth)
            {
                // Getting the file name without the type
                condensedName = condensedName.replace('...' + type, '');

                // Removing the last character of the name
                condensedName = condensedName.substring(0, condensedName.length - 1);
                condensedName += '...' + type;

                // Checking the length of the name
                element.innerHTML = condensedName;
                nameLength = element.getBoundingClientRect().width;
            }
        }
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Adjusting table width
// (For when there is only 1, 2, or 3 files uploaded, to still be displayed with the correct proportions)
const adjustWidth = function()
{
    // Getting the table
    let table = document.getElementById('uploads-table');

    // Getting the width of the table sections
    let width = (table.getBoundingClientRect().width) / 5;

    // Changing the table to have a max width of 100% 
    table.style.width = 'auto';
    table.style.maxWidth = '100%';

    // Getting all table sections
    let sections = table.querySelectorAll('.file-table-section');

    // Adjusting width of all table sections to be a third of the width of the table
    for (let section of sections)
    {
        section.style.width = width;
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-upload-ui', 
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

        // Generating pop up base for displaying content
        generatePopUp();

        // Showing pop up with user presses upload button on whiteboard
        //document.getElementById('upload-button').addEventListener('click', function()
        //{
            //document.getElementById('upload-content-container').style.display = 'block';
        //});

        // Getting list of content uploaded by the user
        let request = new XMLHttpRequest();
        request.open('GET', '/get-user-uploaded-content');

        request.onerror = function() 
        {
            // Generating error message
            renderError("An error occurred, please try again");
        }

        request.onload = function() 
        {
            let content = JSON.parse(request.response);

            if (content.length > 0)
            {
                // Displaying content the user uploaded on pop up
                displayContent(content);

                // Showing pop up as program can not get dimensions when elements are hidden
                document.getElementById('upload-content-container').style.display = 'block';

                    // Making sure file names fit the width of the table data
                    shortenNames();

                    // Adjusting table width
                    adjustWidth();

                // Hiding pop up again
                document.getElementById('upload-content-container').style.display = 'none';

                // Adding upload button
                addButton();

                // Listening for when files are clicked to activate them to insert onto whiteboard

                // Getting all file containers
                let containers = document.getElementsByClassName('file-container');

                // Adding event listeners to file containers
                for (let container of containers)
                {
                    container.addEventListener('click', function()
                    {
                        contentPress(container);
                    });
                }
            }
            else
            {
                // Generating error message
                renderError("<b>No content avaliable to insert</b><p>Upload content <a href='/uploaded-content' target='_blank'>here</a></p>");
            }
        };

        request.send();
    },
    update: function () 
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // If active was set to true, display the pop up
        // If it was set to false, hide pop up

        if (CONTEXT_AF.data.active === true)
        {
            document.getElementById('upload-content-container').style.display = 'block';
        }
        else
        {
            document.getElementById('upload-content-container').style.display = 'none';
        }
    }
});