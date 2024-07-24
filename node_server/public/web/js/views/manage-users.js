'use strict';

// Displaying users in specified section
function displayUsers(usertype)
{
    // Hiding all forms
    var forms = document.getElementsByClassName('manage-user-form');

    for (const form of forms)
    {
        form.style.display = 'none';
    }

    // Unselecting all tabs
    var tabs = document.getElementsByClassName('tab');

    for (const tab of tabs)
    {
        tab.classList.remove('selected-tab');
    }

    // Displaying selected form
    document.getElementById('manage-' + usertype + '-users').style.display = 'block';

    // Selecting selected tab
    document.getElementById(usertype + '-users-tab').classList.add('selected-tab');
}

// ------------------------------------------------------------------------------------------

function deleteUser(username)
{
    // Send request to delete prototype
    var request = new XMLHttpRequest();
    request.open('POST', '/delete-user');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        // If user is deleted successfully, remove user row
        // Otherwise displaying the error message
        if (response.status == 'success')
        {
            document.getElementById('deleting-user-error').style.display = 'none';

            var userRow = document.getElementsByClassName(username)[0];
            var rowParent = userRow.parentElement;

            document.getElementsByClassName(username)[0].remove();

            if (rowParent.querySelectorAll('.row').length == 0)
            {
                rowParent.querySelector('.form-field').remove();

                rowParent.querySelector('.no-users-message').style.display = 'block';
            }
        }
        else
        {
            document.getElementById('deleting-user-error').innerHTML = response.error;
            document.getElementById('deleting-user-error').style.display = 'flex';
        }
    }

    request.send('username=' + username);
}