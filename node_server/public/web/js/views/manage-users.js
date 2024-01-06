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