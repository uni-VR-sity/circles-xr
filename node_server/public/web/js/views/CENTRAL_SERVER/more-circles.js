'use strict';

// Add New Servers ---------------------------------------------------------------------------------------------------------------------------------

// Generating a random placeholder for circles text input
function randomPlaceholder()
{
    let num = Math.floor(Math.random() * 10);

    switch(num)
    {
      case 0:
        return 'Technology';

      case 1:
        return 'Workplace';

      case 2:
        return 'Art Gallery';

      case 3:
        return 'Restaurant';

      case 4:
        return 'Theatre';

      case 5:
        return 'Police Station';

      case 6:
        return 'Fishing Boat';

      case 7:
        return 'Kitchen';

      case 8:
        return 'Farm';

      case 9:
        return 'Plane';

      case 10:
        return 'Church';
    }
}

// ------------------------------------------------------------------------------------------

// Adding another input into the new server form
function addCircleInput(element)
{
    var previousInput = element.parentElement.parentElement;
    var parentElement = previousInput.parentElement;
    var addButton = element.parentElement.cloneNode(true);

    // Deleting current plus button
    element.parentElement.remove();

    // Adding removing input button next to previous input
    var minusButtonContainer = document.createElement('div');

    minusButtonContainer.classList.add('icon-container', 'remove-circle-icon');

        var minusButton = document.createElement('i');

        minusButton.classList.add('fa-solid', 'fa-minus');

        minusButton.setAttribute('onclick', 'removeCircleInput(this)');

    minusButtonContainer.appendChild(minusButton);
    previousInput.appendChild(minusButtonContainer);

    // Creating new input
    var inputContainer =  document.createElement('div');
    
    inputContainer.classList.add('circles-field');
    
        var newInput = document.createElement('input');

        newInput.setAttribute('type', 'text');
        newInput.setAttribute('form', 'add-server-form');
        newInput.setAttribute('name', 'circles');
        newInput.setAttribute('placeholder', randomPlaceholder());
        newInput.setAttribute('required', 'required');

        inputContainer.appendChild(newInput);
        inputContainer.appendChild(addButton);

    parentElement.appendChild(inputContainer);
}

// ------------------------------------------------------------------------------------------

// Removing input from the new server form
function removeCircleInput(element)
{
    var input = element.parentElement.parentElement;

    input.remove();
}

// More Circles ------------------------------------------------------------------------------------------------------------------------------------

// Deactivating circles server
function deactivateServer(serverElement, serverID)
{
  // Sending data to deactivate server
  var request = new XMLHttpRequest();
  request.open('POST', '/deactivate-circles-server');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  request.onload = function() 
  {
    document.getElementById(serverElement).classList.add('inactive-server');
  }

  request.send('server='+ serverID);
}

// ------------------------------------------------------------------------------------------

// Activating circles server
function activateServer(serverElement, serverID)
{
  // Sending data to activate server
  var request = new XMLHttpRequest();
  request.open('POST', '/activate-circles-server');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  request.onload = function() 
  {
    document.getElementById(serverElement).classList.remove('inactive-server');
  }

  request.send('server='+ serverID);
}

// ------------------------------------------------------------------------------------------

// Showing delete confirmation
function deleteServerConfirmation(serverElement)
{
  document.getElementById(serverElement).querySelector('.delete-confirmation-container').style.display = 'block';
}

// ------------------------------------------------------------------------------------------

// Hiding delete confirmation
function closeDeleteConfirmation(serverElement)
{
  document.getElementById(serverElement).querySelector('.delete-confirmation-container').style.display = 'none';
}

// ------------------------------------------------------------------------------------------

// Deleting circles server
function deleteServer(serverID)
{
  // Sending data to delete server
  var request = new XMLHttpRequest();
  request.open('POST', '/delete-circles-server');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  request.onload = function() 
  {
    location.reload();
  }

  request.send('server='+ serverID);
}