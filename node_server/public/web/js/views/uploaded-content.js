'use strict';

// Getting file dimensions to save to database
function getDimensions(filename, file)
{
    let fileElement = document.getElementById(file);

    let height;
    let width;

    // Image
    if (fileElement.tagName === 'IMG')
    {
        height = fileElement.naturalHeight;
        width = fileElement.naturalWidth;
    }
    // Video
    else
    {
        height = fileElement.videoHeight;
        width = fileElement.videoWidth;
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/new-set-file-dimensions');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send('file='+ filename + '&height=' + height + '&width=' + width);
}

// ------------------------------------------------------------------------------------------

// Showing delete confirmation
function confirmDeleteFile(file)
{
    document.getElementById(file).querySelector('.file-description').style.display = 'none';
    document.getElementById(file).querySelector('.file-delete-confirmation').style.display = 'grid';
}

// ------------------------------------------------------------------------------------------

// Hiding delete confirmation
function cancelDelete(file)
{
    document.getElementById(file).querySelector('.file-delete-confirmation').style.display = 'none';
    document.getElementById(file).querySelector('.file-description').style.display = 'grid';
}

// ------------------------------------------------------------------------------------------

// Deleting file
function deleteFile(filename, file)
{
    // Sending data to delete magic link
    var request = new XMLHttpRequest();
    request.open('POST', '/new-delete-uploaded-content');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        // Deleting file element
        document.getElementById(file).remove();

        // If that was the last group row, displaying no groups available message
        if (document.getElementsByClassName('file').length === 0)
        {
            document.getElementById('no-content-message').style.display = 'block';
        }
    }

    request.send('file='+ filename);
}