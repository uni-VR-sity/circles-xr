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
    var scene = '<a-scene embedded background="color:#ededed">' + 
                sceneObjects + 
                '<a-camera position="0 1.6 0" wasd-controls look-controls></a-camera>' +
                '<a-light type="ambient" color="#404040"></a-light>' +
                '<a-light type="directional" position="0 10 5" color="#ffffff" intensity="0.5"></a-light>' +
                '<a-light type="point" position="5 5 5" color="#ffffff" intensity="0.3"></a-light>' +
                '</a-scene>';
    
    document.getElementById('prototype-scene').innerHTML = scene;
}

// Generate scene from natural language description
async function generateFromDescription() {
    const description = document.getElementById('scene-description').value.trim();
    const statusElement = document.getElementById('nl-generation-status');
    const generateButton = document.getElementById('generate-from-description');
    
    if (!description) {
        statusElement.textContent = 'Please enter a description first.';
        statusElement.className = 'error';
        return;
    }
    
    // Show loading state
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';
    statusElement.textContent = 'Generating scene from description...';
    statusElement.className = 'loading';
    
    try {
        const response = await fetch('/generate-scene-from-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: description })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Store scene objects for visual editor
            window.currentSceneObjects = data.sceneObjects;
            
            // Update the JSON editor with generated scene
            const jsonEditor = document.getElementById('prototyping-input');
            jsonEditor.value = JSON.stringify(data.sceneObjects).slice(1, -1); // Remove outer brackets
            
            // Display the generated scene
            displayPrototypeScene(data.sceneElements);
            
            // Show and populate visual editor
            showVisualEditor(data.sceneObjects);
            
            statusElement.textContent = 'Scene generated successfully! You can edit using the sliders below.';
            statusElement.className = 'success';
        } else {
            statusElement.textContent = 'Error: ' + (data.error || 'Failed to generate scene');
            statusElement.className = 'error';
        }
    } catch (error) {
        console.error('Error generating scene:', error);
        statusElement.textContent = 'Error connecting to server. Please try again.';
        statusElement.className = 'error';
    } finally {
        // Reset button state
        generateButton.disabled = false;
        generateButton.textContent = 'Generate Scene';
    }
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
    request.open('POST', '/create-new-prototype-AI');
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
        request.open('POST', '/update-prototype-AI');
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
    request.open('POST', '/get-prototypes-AI');
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
    request.open('POST', '/get-prototype-info-AI');
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
    request.open('POST', '/delete-prototype-AI');
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

// Visual Editor Functions ------------------------------------------------------------------------------------------------------------------------

// Show and populate the visual editor
function showVisualEditor(sceneObjects) {
    const visualEditor = document.getElementById('visual-editor-section');
    const objectsList = document.getElementById('objects-list');
    
    // Clear existing content
    objectsList.innerHTML = '';
    
    // Show the visual editor
    visualEditor.style.display = 'block';
    
    // Create editor for each object
    sceneObjects.forEach((obj, index) => {
        const objectEditor = createObjectEditor(obj, index);
        objectsList.appendChild(objectEditor);
    });
}

// Create an object editor with sliders
function createObjectEditor(obj, index) {
    const objectDiv = document.createElement('div');
    objectDiv.className = 'object-editor';
    objectDiv.setAttribute('data-index', index);
    
    // Object header
    const header = document.createElement('div');
    header.className = 'object-header';
    
    const title = document.createElement('h5');
    title.textContent = obj.model || obj.shape || `Object ${index + 1}`;
    
    const type = document.createElement('span');
    type.className = 'object-type';
    type.textContent = obj.type || 'primitive';
    
    header.appendChild(title);
    header.appendChild(type);
    objectDiv.appendChild(header);
    
    // Position sliders
    const positionGroup = createSliderGroup('Position', [
        { label: 'X', value: parseFloat(obj.position[0]), min: -10, max: 10, step: 0.1, axis: 0, type: 'position' },
        { label: 'Y', value: parseFloat(obj.position[1]), min: 0, max: 10, step: 0.1, axis: 1, type: 'position' },
        { label: 'Z', value: parseFloat(obj.position[2]), min: -10, max: 10, step: 0.1, axis: 2, type: 'position' }
    ], index);
    objectDiv.appendChild(positionGroup);
    
    // Rotation sliders
    const rotationGroup = createSliderGroup('Rotation', [
        { label: 'X', value: parseFloat(obj.rotation[0]), min: 0, max: 360, step: 1, axis: 0, type: 'rotation' },
        { label: 'Y', value: parseFloat(obj.rotation[1]), min: 0, max: 360, step: 1, axis: 1, type: 'rotation' },
        { label: 'Z', value: parseFloat(obj.rotation[2]), min: 0, max: 360, step: 1, axis: 2, type: 'rotation' }
    ], index);
    objectDiv.appendChild(rotationGroup);
    
    // Scale sliders (only for models)
    if (obj.scale) {
        const scaleGroup = createSliderGroup('Scale', [
            { label: 'X', value: parseFloat(obj.scale[0]), min: 0.1, max: 2, step: 0.05, axis: 0, type: 'scale' },
            { label: 'Y', value: parseFloat(obj.scale[1]), min: 0.1, max: 2, step: 0.05, axis: 1, type: 'scale' },
            { label: 'Z', value: parseFloat(obj.scale[2]), min: 0.1, max: 2, step: 0.05, axis: 2, type: 'scale' }
        ], index);
        objectDiv.appendChild(scaleGroup);
    }
    
    return objectDiv;
}

// Create a group of sliders (position, rotation, or scale)
function createSliderGroup(title, sliders, objectIndex) {
    const group = document.createElement('div');
    group.className = 'slider-group';
    
    const groupTitle = document.createElement('div');
    groupTitle.className = 'slider-group-title';
    groupTitle.textContent = title;
    group.appendChild(groupTitle);
    
    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    
    sliders.forEach(slider => {
        const control = document.createElement('div');
        control.className = 'slider-control';
        
        const label = document.createElement('div');
        label.className = 'slider-label';
        label.textContent = slider.label;
        
        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'slider-input';
        input.min = slider.min;
        input.max = slider.max;
        input.step = slider.step;
        input.value = slider.value;
        input.setAttribute('data-object-index', objectIndex);
        input.setAttribute('data-property', slider.type);
        input.setAttribute('data-axis', slider.axis);
        
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = slider.value.toFixed(slider.step < 1 ? 2 : 0);
        
        // Add event listener for real-time updates
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            valueDisplay.textContent = value.toFixed(slider.step < 1 ? 2 : 0);
            updateObjectProperty(objectIndex, slider.type, slider.axis, value);
        });
        
        control.appendChild(label);
        control.appendChild(input);
        control.appendChild(valueDisplay);
        controls.appendChild(control);
    });
    
    group.appendChild(controls);
    return group;
}

// Update object property and refresh scene
function updateObjectProperty(objectIndex, property, axis, value) {
    if (!window.currentSceneObjects || !window.currentSceneObjects[objectIndex]) {
        return;
    }
    
    // Update the object data
    const obj = window.currentSceneObjects[objectIndex];
    if (!obj[property]) {
        obj[property] = ["0", "0", "0"];
    }
    obj[property][axis] = value.toString();
    
    // Update JSON editor
    updateJSONEditor();
    
    // Update the specific entity in place instead of recreating the entire scene
    updateSceneObjectInPlace(objectIndex, obj);
}

// Update the JSON editor with current scene objects
function updateJSONEditor() {
    if (!window.currentSceneObjects) return;
    
    const jsonEditor = document.getElementById('prototyping-input');
    const jsonString = JSON.stringify(window.currentSceneObjects);
    jsonEditor.value = jsonString.slice(1, -1); // Remove outer brackets
}

// Update the scene display
function updateSceneDisplay() {
    if (!window.currentSceneObjects) return;
    
    // Convert scene objects to HTML elements
    let sceneElements = '';
    window.currentSceneObjects.forEach((obj, index) => {
        sceneElements += createSceneElement(obj, index);
    });
    
    // Update the scene
    displayPrototypeScene(sceneElements);
}

// Update a specific scene object in place without recreating the entire scene
function updateSceneObjectInPlace(objectIndex, obj) {
    const entityId = `scene-object-${objectIndex}`;
    const entity = document.getElementById(entityId);
    
    if (!entity) {
        console.warn(`Entity with ID ${entityId} not found, falling back to full scene update`);
        updateSceneDisplay();
        return;
    }
    
    // Update position
    if (obj.position) {
        const position = obj.position.join(' ');
        entity.setAttribute('position', position);
    }
    
    // Update rotation
    if (obj.rotation) {
        const rotation = obj.rotation.join(' ');
        entity.setAttribute('rotation', rotation);
    }
    
    // Update scale (for models)
    if (obj.scale) {
        const scale = obj.scale.join(' ');
        entity.setAttribute('scale', scale);
    }
    
    // Update geometry properties (for primitive shapes)
    if (obj.type === 'primitive' && obj.shape) {
        let geometry = `primitive:${obj.shape};`;
        
        // Add size properties
        if (obj.shape === 'box') {
            geometry += `width:${obj.width};height:${obj.height};depth:${obj.depth};`;
        } else if (obj.shape === 'sphere') {
            geometry += `radius:${obj.radius};`;
        } else if (obj.shape === 'cylinder') {
            geometry += `radius:${obj.radius};height:${obj.height};`;
        }
        
        entity.setAttribute('geometry', geometry);
        
        // Update material color
        if (obj.colour) {
            entity.setAttribute('material', `color:${obj.colour}`);
        }
    }
}

// Create HTML element for scene object
function createSceneElement(obj, index) {
    const entityId = `scene-object-${index}`;
    
    if (obj.type === 'model') {
        const position = obj.position.join(' ');
        const rotation = obj.rotation.join(' ');
        const scale = obj.scale ? obj.scale.join(' ') : '1 1 1';
        return `<a-entity id="${entityId}" gltf-model="${obj.modelPath}" position="${position}" rotation="${rotation}" scale="${scale}"></a-entity>`;
    } else {
        const position = obj.position.join(' ');
        const rotation = obj.rotation.join(' ');
        let geometry = `primitive:${obj.shape};`;
        
        // Add size properties
        if (obj.shape === 'box') {
            geometry += `width:${obj.width};height:${obj.height};depth:${obj.depth};`;
        } else if (obj.shape === 'sphere') {
            geometry += `radius:${obj.radius};`;
        } else if (obj.shape === 'cylinder') {
            geometry += `radius:${obj.radius};height:${obj.height};`;
        }
        
        return `<a-entity id="${entityId}" geometry="${geometry}" material="color:${obj.colour};" position="${position}" rotation="${rotation}"></a-entity>`;
    }
}

// Accordion functionality
function toggleAccordion(accordionId) {
    const content = document.getElementById(accordionId);
    const icon = document.getElementById('json-accordion-icon');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.textContent = '▲';
        icon.classList.add('rotated');
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
        icon.classList.remove('rotated');
    }
}