'use strict';

// Global Variables --------------------------------------------------------------------------------------------------------------------------------
var currentPrototype;

// General -----------------------------------------------------------------------------------------------------------------------------------------

// Hiding error messages
function hideMessages()
{
    var errors = document.getElementsByClassName('error-message');

    for (const error of errors)
    {
        error.style.display = 'none';
    }
}

// Prototyping -------------------------------------------------------------------------------------------------------------------------------------

// Displays prototype scene
function displayPrototypeScene(sceneObjects)
{
    var scene = '<a-scene embedded background="color:#ededed">' + sceneObjects + '</a-scene>';
    
    document.getElementById('prototype-scene').innerHTML = scene;
}

// ------------------------------------------------------------------------------------------

// Creates new prototype
function createPrototype(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Getting form data
    var formData = new FormData(event.target);

    // Getting prototype name
    var prototypeName = formData.get('prototypeName');

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
            // Closing create prototype overlay
            closeOverlay("create-prototype-overlay");

            // Saving prototype name
            currentPrototype = response.prototypeName;

            // Updating title
            document.getElementById('prototype-title').innerHTML = response.prototypeName;

            // Inserting starting string into textarea
            document.getElementById('prototyping-input').innerHTML = response.startingString;

            // Hiding success and error messages
            hideMessages();

            // Displaying prototype editor
            var prototypeEditorElements = document.getElementsByClassName('hide-until-ready');

            while (prototypeEditorElements.length > 0)
            {
                prototypeEditorElements[0].classList.remove('hide-until-ready');
            }

            document.getElementById('initial-buttons-container').style.display = 'none';

            // Displaying prototype scene
            displayPrototypeScene(response.sceneElements);
        }
        else 
        {
            document.getElementById('prototype-creation-error').innerHTML = response.error;
            document.getElementById('prototype-creation-error').style.display = 'flex';
        }
    }

    request.send('prototypeName=' + prototypeName);
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
                // Updating prototype scene
                displayPrototypeScene(response.sceneElements);
            }
            else
            {
                document.getElementById('prototype-input-error').innerHTML = response.error;
                document.getElementById('prototype-input-error').style.display = 'flex';
            }
        }

        request.send('prototypeName=' + currentPrototype + '&prototypeEdits=' + prototypeJSON);
    } 
    catch (e) 
    {
        document.getElementById('prototype-input-error').innerHTML = 'Error in JSON syntax';
        document.getElementById('prototype-input-error').style.display = 'flex';
    }
}