'use strict';

// Title -------------------------------------------------------------------------------------------------------------------------------------------------

// Setting circle to be public
function makePublic(circle)
{
    // Sending data to update circle access restriction to public
    var request = new XMLHttpRequest();
    request.open('POST', '/update-access-restriction');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        location.reload();
    }

    request.send('circle='+ circle + '&restriction=false');
}

// ------------------------------------------------------------------------------------------

// Setting circle to be private
function makePrivate(circle)
{
    // Sending data to update circle access restriction to public
    var request = new XMLHttpRequest();
    request.open('POST', '/update-access-restriction');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        location.reload();
    }

    request.send('circle='+ circle + '&restriction=true');
}

// User access -------------------------------------------------------------------------------------------------------------------------------------------

// Giving user viewing permission on circle
function permitViewing(user, circle)
{
    // Changing icon to being permitted
    var icon = document.getElementById(user.replaceAll(' ', '-')).querySelector('.viewing-access').querySelector('.restricted-icon');

    if (icon)
    {
        icon.classList.replace('restricted-icon', 'permitted-icon');

        // Delaying to not trigger right away
        setTimeout(function()
        {
            icon.querySelector('i').setAttribute('onclick', 'restrictViewing("' + user + '", "' + circle + '")');
        }, 100);

        // Sending data to give user viewing permission on circle
        var request = new XMLHttpRequest();
        request.open('POST', '/update-user-viewing');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.send('user=' + user + '&circle='+ circle + '&viewing=true');
    }
}

// ------------------------------------------------------------------------------------------

// Removing user viewing permission on circle
function restrictViewing(user, circle)
{
    // Changing icon to being restricted
    var icon = document.getElementById(user.replaceAll(' ', '-')).querySelector('.viewing-access').querySelector('.permitted-icon');

    if (icon)
    {
        icon.classList.replace('permitted-icon', 'restricted-icon');

        // Delaying to not trigger right away
        setTimeout(function()
        {
            icon.querySelector('i').setAttribute('onclick', 'permitViewing("' + user + '", "' + circle + '")');
        }, 100);

        // Sending data to give user viewing permission on circle
        var request = new XMLHttpRequest();
        request.open('POST', '/update-user-viewing');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.send('user=' + user + '&circle='+ circle + '&viewing=false');
    }
}

// ------------------------------------------------------------------------------------------

// Giving user editing permission on circle
function permitEditing(user, circle)
{
    // Changing icon to being permitted for editing
    // Disbling icon for viewing
    var editingIcon = document.getElementById(user.replaceAll(' ', '-')).querySelector('.editing-access').querySelector('.restricted-icon');
    var viewingIcon = document.getElementById(user.replaceAll(' ', '-')).querySelector('.viewing-access').querySelector('.icon-container');

    if (editingIcon && viewingIcon)
    {
        editingIcon.classList.replace('restricted-icon', 'permitted-icon');
        viewingIcon.classList.add('disabled');

        // Delaying to not trigger right away
        setTimeout(function()
        {
            editingIcon.querySelector('i').setAttribute('onclick', 'restrictEditing("' + user + '", "' + circle + '")');
            viewingIcon.querySelector('i').removeAttribute('onclick');
        }, 100);

        // Sending data to give user editing permission on circle
        var request = new XMLHttpRequest();
        request.open('POST', '/update-user-editing');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.send('user=' + user + '&circle='+ circle + '&editing=true');
    }
}

// ------------------------------------------------------------------------------------------

// Removing user editing permission on circle
function restrictEditing(user, circle)
{
    // Changing icon to being restricted
    // Enabling icon for viewing
    var editingIcon = document.getElementById(user.replaceAll(' ', '-')).querySelector('.editing-access').querySelector('.permitted-icon');
    var viewingIcon = document.getElementById(user.replaceAll(' ', '-')).querySelector('.viewing-access').querySelector('.icon-container');

    if (editingIcon)
    {
        editingIcon.classList.replace('permitted-icon', 'restricted-icon');
        viewingIcon.classList.remove('disabled');

        // Delaying to not trigger right away
        setTimeout(function()
        {
            editingIcon.querySelector('i').setAttribute('onclick', 'permitEditing("' + user + '", "' + circle + '")');

            if (viewingIcon.classList.contains('permitted-icon'))
            {
                viewingIcon.querySelector('i').setAttribute('onclick', 'restrictViewing("' + user + '", "' + circle + '")');
            }
            else
            {
                viewingIcon.querySelector('i').setAttribute('onclick', 'permitViewing("' + user + '", "' + circle + '")');
            }
        }, 100);

        // Sending data to give user viewing permission on circle
        var request = new XMLHttpRequest();
        request.open('POST', '/update-user-editing');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.send('user=' + user + '&circle='+ circle + '&editing=false');
    }
}