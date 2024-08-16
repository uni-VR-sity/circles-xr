'use strict';

// Creating new user account
function registerUser(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Hiding messages
    document.getElementById('registration-error').style.display = 'none';
    document.getElementById('registration-success').style.display = 'none';

    // Getting form data
    var formData = new FormData(event.target);

    // Checking that the password and password confirmation match
    // If they don't, displaying an error message
    if (formData.get('password') == formData.get('passwordConf'))
    {
        // Showing loading icon
        document.getElementById('loading-icon').style.display = 'flex';

        // Send request to create new user
        var request = new XMLHttpRequest();
        request.open('POST', '/register-user');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onload = function() 
        {
            var response = JSON.parse(request.response);

            // Hiding loading icon
            document.getElementById('loading-icon').style.display = 'none';

            // Displaying appropriate messages if registration was a success or not
            if (response.status == 'success')
            {
                document.getElementById('registration-success').innerHTML = "We sent an email to " + formData.get('email') + " complete the registration. If you don't see it, check your spam folder";
                document.getElementById('registration-success').style.display = 'flex';
            }
            else
            {
                document.getElementById('registration-error').innerHTML = response.error;
                document.getElementById('registration-error').style.display = 'flex';
            }

            document.getElementById('register-form').querySelector('form').reset();
        }

        var requestString = 'username=' + formData.get('username');
        requestString += '&email=' + formData.get('email');
        requestString += '&password=' + formData.get('password');

        request.send(requestString);
    }
    else
    {
        document.getElementById('registration-error').innerHTML = 'Passwords do not match';
        document.getElementById('registration-error').style.display = 'flex';
    }
}