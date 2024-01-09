'use strict';

// Updating profile through form
function updateProfile(event, guestUser)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Getting form data
    var formData = new FormData(event.target);

    // Hiding if there are any magic links, or success or error messages up
    var successMessage = document.querySelector('.success-message');
    successMessage.style.display = 'none';

    var errorMessage = document.querySelector('.error-message');
    errorMessage.style.display = 'none';

    // Sending data to update profile
    var request = new XMLHttpRequest();
    request.open('POST', '/update-user-profile');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        if (response === 'error')
        {
            errorMessage.style.display = 'flex';
            errorMessage.innerHTML = 'Something went wrong, please try again';
        }
        else if (response === 'passwords do not match')
        {
            errorMessage.style.display = 'flex';
            errorMessage.innerHTML = 'Passwords do not match';
        }
        else if (response === 'old password incorrect')
        {
            errorMessage.style.display = 'flex';
            errorMessage.innerHTML = 'Old password is incorrect';
        }
        else if (response === 'success')
        {
            successMessage.style.display = 'flex';
            successMessage.innerHTML = 'Profile updated successfully';

            // Clearing form
            var form = document.getElementById('update-profile-form');
            form.reset();
            
            // If values have changed, updating form
            document.getElementById('displayName').value = formData.get('displayName');

            if (!guestUser)
            {
                if (formData.get('email').length > 0)
                {
                    document.getElementById('email').value = formData.get('email');
                }

                if (formData.get('deleteEmail'))
                {
                    document.getElementById('email').value = '';
                }
            }
        }
    }

    var dataString = 'displayName=' + formData.get('displayName');

    if (!guestUser)
    {
        if (formData.get('email').length > 0)
        {
            dataString += '&email=' + formData.get('email');
        }

        if (formData.get('deleteEmail'))
        {
            dataString += '&deleteEmail=' + formData.get('deleteEmail');
        }

        if (formData.get('passwordOld').length > 0)
        {
            dataString += '&passwordOld=' + formData.get('passwordOld');
            dataString += '&passwordNew=' + formData.get('passwordNew');
            dataString += '&passwordConf=' + formData.get('passwordConf');
        }
    }

    request.send(dataString);
}