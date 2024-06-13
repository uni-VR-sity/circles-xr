'use strict';

// Constant Variables ------------------------------------------------------------------------------------------------------------------------------
const STARTING_STRING = '{\n\t"shape" : "box",\n\t"position" : ["0", "0", "0"]\n}'

// Global Variables --------------------------------------------------------------------------------------------------------------------------------
var prototypeName;

// General -----------------------------------------------------------------------------------------------------------------------------------------

// Hiding success and error messages
function hideMessages()
{
    document.getElementById('prototype-input-success').style.display = 'none';
    document.getElementById('prototype-input-error').style.display = 'none';
}

// Prototyping -------------------------------------------------------------------------------------------------------------------------------------

// Creates new prototype
function newPrototype()
{
    // Send request to create new prototype
    var request = new XMLHttpRequest();
    request.open('POST', '/create-new-prototype');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        // If new prototype made successfully
        if (response.status == 'success')
        {
            // Saving prototype name
            prototypeName = response.prototypeName;

            // Updating title
            document.getElementById('prototype-title').innerHTML = response.prototypeName;

            // Inserting starting string into textarea
            document.getElementById('prototyping-input').innerHTML = STARTING_STRING;

            // Hiding success and error messages
            hideMessages();

            // Displaying prototype editor
            document.getElementById('prototyping-container').style.visibility = 'visible';
        }
    }

    request.send();
}

// ------------------------------------------------------------------------------------------

// Updates current prototype
function updatePrototype(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Hiding success and error messages
    hideMessages();

    // Getting form data
    var formData = new FormData(event.target);

    // Getting prototype input
    var prototypeInput = formData.get('prototyping');

    // Adding array brackets to input
    var prototypeInput = '[' + prototypeInput + ']';

    // Converting input to JSON and ensuring it is valid
    // If it is valid,
    // If it is invalid, displaying error message
    // https://www.geeksforgeeks.org/javascript-check-if-a-string-is-a-valid-json-string/
    var prototypeJSON;

    try 
    {
        prototypeJSON = JSON.stringify(JSON.parse(prototypeInput));

        // Send request to update current prototype
        var request = new XMLHttpRequest();
        request.open('POST', '/update-prototype');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        request.onload = function() 
        {
            var response = JSON.parse(request.response);

            if (response.status == 'success')
            {
                document.getElementById('prototype-input-success').innerHTML = 'Prototype updated';
                document.getElementById('prototype-input-success').style.display = 'inline-flex';
            }
            else
            {
                document.getElementById('prototype-input-error').innerHTML = response.error;
                document.getElementById('prototype-input-error').style.display = 'inline-flex';
            }
        }

        request.send('prototypeName=' + prototypeName + '&prototypeEdits=' + prototypeJSON);
    } 
    catch (e) 
    {
        document.getElementById('prototype-input-error').innerHTML = 'Error in JSON syntax';
        document.getElementById('prototype-input-error').style.display = 'inline-flex';
    }
}