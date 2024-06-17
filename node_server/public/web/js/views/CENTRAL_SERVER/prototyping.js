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

// Displaying prototype editor
function displayPrototypeEditor(editorInput, sceneElements)
{
    // Updating title
    document.getElementById('prototype-title').innerHTML = currentPrototype;

    // Inserting starting string into textarea
    document.getElementById('prototyping-input').value = editorInput;

    // Hiding success and error messages
    hideMessages();

    // Displaying prototype editor
    var prototypeEditorElements = document.getElementsByClassName('hide-until-ready');

    for (const element of prototypeEditorElements)
    {
        element.style.visibility = 'visible';
    }

    // Displaying prototype scene
    displayPrototypeScene(sceneElements);
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

    // Resetting form
    document.getElementById('create-prototype-form').reset();

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

            // Displaying prototype editor
            displayPrototypeEditor(response.startingString, response.sceneElements);
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
    prototypeInput = '[' + prototypeInput + ']';

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

// ------------------------------------------------------------------------------------------

// Gets existing prototypes that the user creates and displays open prototype overlay
function getExistingPrototypes()
{
    // Send request to get user's existing prototypes
    var request = new XMLHttpRequest();
    request.open('POST', '/get-prototypes');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        // Deleting current prototype elements
        var oldElements = document.getElementsByClassName('prototype');

        while (oldElements[0])
        {
            oldElements[0].parentNode.removeChild(oldElements[0]);
        }

        // If the user does not have any prototypes, displaying message
        // Otherwise displaying prototypes
        if (response.length == 0)
        {
            document.getElementById('no-prototypes-message').style.display = 'flex';
        }
        else
        {
            document.getElementById('no-prototypes-message').style.display = 'none';

            // Displaying prototypes
            var prototypeContainer = document.getElementById('existing-prototypes-container');

            for (const prototype of response)
            {
                var prototypeElement = document.createElement('div');
                prototypeElement.classList.add('prototype');

                    // Name
                    var name = document.createElement('p');
                    name.innerHTML = prototype.name;

                    prototypeElement.appendChild(name);

                    // Open button
                    var openButton = document.createElement('a');
                    openButton.innerHTML = 'Open';
                    openButton.setAttribute('onclick', 'openPrototype("' + prototype.name + '")');

                    prototypeElement.appendChild(openButton);

                    // Delete button
                    var deleteButtonContainer = document.createElement('div');
                    deleteButtonContainer.classList.add('icon-container');

                        var deleteButton = document.createElement('i');
                        deleteButton.classList.add('fa-regular', 'fa-trash-can');

                        var deleteFunction = 'deletePrototype(\'' + prototype.name + '\')';
                        deleteButton.setAttribute('onclick', 'deleteConfirmationPopUp(event, "Prototype", "' + prototype.name + '", "' + deleteFunction + '")');

                        deleteButtonContainer.appendChild(deleteButton);

                    prototypeElement.appendChild(deleteButtonContainer);

                prototypeContainer.appendChild(prototypeElement);
            }
        }

        // Hiding success and error messages
        hideMessages();

        // Displaying overlay
        openOverlay('open-prototype-overlay');
    }

    request.send();
}

// ------------------------------------------------------------------------------------------

// Opening selected prototype
function openPrototype(prototype)
{
    // Send request to get selected prototype information
    var request = new XMLHttpRequest();
    request.open('POST', '/get-prototype-info');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        if (response.status == 'success')
        {
            // Saving prototype name
            currentPrototype = prototype;

            // Displaying prototype editor
            displayPrototypeEditor(response.editorInput, response.sceneElements);

            // Closing create prototype overlay
            closeOverlay("open-prototype-overlay");
        }
        else
        {
            document.getElementById('prototype-open-error').innerHTML = response.error;
            document.getElementById('prototype-open-error').style.display = 'flex';
        }
    }

    request.send('prototypeName=' + prototype);
}

// ------------------------------------------------------------------------------------------

// Deleting selected prototype
function deletePrototype(prototype)
{
    // Send request to delete prototype
    var request = new XMLHttpRequest();
    request.open('POST', '/delete-prototype');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        if (response.status == 'success')
        {
            // If deleted prototype was current prototype, hiding prototype editor
            if (prototype === currentPrototype)
            {
                var prototypeEditorElements = document.getElementsByClassName('hide-until-ready');

                for (const element of prototypeEditorElements)
                {
                    element.style.visibility = 'hidden';
                }
            }

            // Displaying overlay again to update
            getExistingPrototypes();
        }
        else
        {
            document.getElementById('prototype-open-error').innerHTML = response.error;
            document.getElementById('prototype-open-error').style.display = 'flex';
        }
    }

    request.send('prototypeName=' + prototype);
}