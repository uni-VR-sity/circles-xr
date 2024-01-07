'use strict';

// Showing link renewal form 
function renewLink(magicLink)
{
    document.getElementById(magicLink).querySelector('.renewal-container').style.display = 'grid';

    // Making sure delete confirmation is hidden
    document.getElementById(magicLink).querySelector('.delete-confirmation-container').style.display = 'none';
}

// ------------------------------------------------------------------------------------------

// Showing delete confirmation
function deleteLinkConfirmation(magicLink)
{
    document.getElementById(magicLink).querySelector('.delete-confirmation-container').style.display = 'block';

    // Making sure renewal form is hidden
    document.getElementById(magicLink).querySelector('.renewal-container').style.display = 'none';
}

// ------------------------------------------------------------------------------------------

// Hiding specified container
function closeContainer(magicLink, container)
{
    document.getElementById(magicLink).querySelector(container).style.display = 'none';
}

// ------------------------------------------------------------------------------------------

// Deleting magic link
function deleteLink(magicLink) 
{
    // Sending data to delete magic link
    var request = new XMLHttpRequest();
    request.open('POST', '/new-delete-magic-link');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        location.reload();
    }

    request.send('magicLink='+ magicLink);
}