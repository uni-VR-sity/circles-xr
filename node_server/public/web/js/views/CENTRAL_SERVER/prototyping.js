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
function displayPrototypeScene(sceneAttributes, sceneElements)
{
    var scene = '<a-scene embedded renderer="antialias:true;colorManagement:true;sortObjects:false;foveationLevel:3;highRefreshRate:true;physicallyCorrectLights:true;logarithmicDepthBuffer:false;precision:high;" shadow="autoUpdate:false;type:basic;" vr-mode-ui="enabled:true;" loading-screen="enabled:false;" device-orientation-permission-ui="enabled:true;" circles-platform-scene-shadows ';
    scene += sceneAttributes;
    scene += '>';

        scene += sceneElements;
    
    scene += '</a-scene>';
    
    document.getElementById('prototype-scene').innerHTML = scene;
}

// ------------------------------------------------------------------------------------------

// Displaying prototype editor
function displayPrototypeEditor(editorInput, sceneAttributes, sceneElements)
{
    // Updating title
    document.getElementById('prototype-title').innerHTML = currentPrototype;

    // Inserting starting string into textarea
    document.getElementById('prototyping-input').value = JSON.stringify(JSON.parse(editorInput), null, 4);

    // Hiding success and error messages
    hideMessages();

    // Displaying prototype editor
    var prototypeEditorElements = document.getElementsByClassName('hide-until-ready');

    for (const element of prototypeEditorElements)
    {
        element.style.visibility = 'visible';
    }

    // Displaying prototype scene
    displayPrototypeScene(sceneAttributes, sceneElements);
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
            displayPrototypeEditor(response.startingString, response.sceneAttributes, response.sceneElements);
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
                displayPrototypeScene(response.sceneAttributes, response.sceneElements);
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
            displayPrototypeEditor(response.editorInput, response.sceneAttributes, response.sceneElements);

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
                document.getElementById('prototyping-input').value = '';

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

// ------------------------------------------------------------------------------------------

// Uploading user selected model
async function uploadModel(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Getting form data
    var form = event.target;
    var formData = new FormData(form);

    // If a file was selected, sending request to upload new model
    if (formData.get('modelFile').size > 0)
    {
        // Hiding previous success and error messages
        hideMessages();

        fetch('/upload-model', {method: form.method, body: formData})
        .then(response => response.json())
        .then(data => 
        {
            if (data.status == 'success')
            {
                var modelsContainer = document.getElementById('models-container');

                // If there were no models in container previously, hiding no model text
                if (modelsContainer.querySelectorAll('.model').length == 0)
                {
                    document.getElementById('no-models-message').style.display = 'none';
                }

                // Displaying uploaded model
                var model = document.createElement('div');
                model.classList.add('model');
                model.classList.add('file');
                model.setAttribute('id', data.model.name);

                    var modelType = document.createElement('h3');
                    modelType.innerHTML = data.model.type;
                    model.appendChild(modelType);

                    var modelNameContainer = document.createElement('div');
                    modelNameContainer.classList.add('name-container');

                        var modelName = document.createElement('p');
                        modelName.classList.add('file-name');
                        modelName.innerHTML = data.model.displayName;
                        modelNameContainer.appendChild(modelName);

                    model.appendChild(modelNameContainer);

                    var modelOptionsContainer = document.createElement('div');
                    modelOptionsContainer.classList.add('model-options');

                        var copyIconContainer = document.createElement('div');
                        copyIconContainer.classList.add('icon-container');
                        copyIconContainer.classList.add('copy-icon');

                            var copyIcon = document.createElement('a');
                            copyIcon.classList.add('fa-regular');
                            copyIcon.classList.add('fa-copy');
                            copyIcon.setAttribute('onclick', 'copyModelName(event, "' + data.model.displayName + '")');
                            copyIconContainer.appendChild(copyIcon);
                        
                        modelOptionsContainer.appendChild(copyIconContainer);

                        var trashIconContainer = document.createElement('div');
                        trashIconContainer.classList.add('icon-container');
                        trashIconContainer.classList.add('trash-icon');

                            var trashIcon = document.createElement('a');
                            trashIcon.classList.add('fa-regular');
                            trashIcon.classList.add('fa-trash-can');
                            trashIcon.setAttribute('onclick', 'deleteConfirmationPopUp(event, "Model", "' + data.model.displayName + '", "deleteModel(\'' + data.model.name + '\')")');
                            trashIconContainer.appendChild(trashIcon);

                        modelOptionsContainer.appendChild(trashIconContainer);

                    model.appendChild(modelOptionsContainer);

                    modelsContainer.appendChild(model);

            }
            else
            {
                document.getElementById('prototype-model-error').innerHTML = data.error;
                document.getElementById('prototype-model-error').style.display = 'flex';
            }
        });

        // Resetting form
        document.getElementById('model-upload-form').reset();
    }
}

// ------------------------------------------------------------------------------------------

// Deleting selected model
async function deleteModel(model)
{
    fetch('/delete-uploaded-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file: model }),})
    .then(response => response.json())
    .then(data => 
    {
        // Deleting model element
        document.getElementById(model).remove();

        // If that was the last model, displaying no models available message
        if (document.getElementsByClassName('file').length === 0)
        {
            document.getElementById('no-models-message').style.display = 'flex';
        }
    });
}

// ------------------------------------------------------------------------------------------

// Copying model name
function copyModelName(event, model)
{
    // Removing event listener if copy button was previously clicked
    event.target.removeEventListener('mouseleave', hideCopyIndicator);

    // Copying model name to clipboard
    navigator.clipboard.writeText(model);

    // Displaying indicator that name was copied
    event.target.classList.remove('fa-regular');
    event.target.classList.remove('fa-copy');
    
    event.target.classList.add('fa-solid');
    event.target.classList.add('fa-check');

    event.target.addEventListener('mouseleave', hideCopyIndicator);
}

// ------------------------------------------------------------------------------------------

// Hiding copy indicator a little after user stops hovering copy button
function hideCopyIndicator(event)
{
    event.target.removeEventListener('mouseleave', hideCopyIndicator);

    setTimeout(function()
    {
        event.target.classList.remove('fa-solid');
        event.target.classList.remove('fa-check');

        event.target.classList.add('fa-regular');
        event.target.classList.add('fa-copy');
    }, 250);
}