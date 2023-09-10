// JS for click confirmations (ex. confirmation to delete)

// General -----------------------------------------------------------------------------------------------------------------------------------------------

// Creating delete confirmation pop up before deleting something
function deleteConfirmationPopUp(item, name, deleteLink, deleteNote = '')
{
  // Overlay
  var overlay = document.createElement('div');
  overlay.classList.add('overlay-container');

    // Pop up
    var popup = document.createElement('div');
    popup.classList.add('overlay-delete-confirmation');

      // Icon
      var icon = document.createElement('i');
      icon.classList.add('fa-solid', 'fa-circle-exclamation', 'icon', 'xxl-icon');

      popup.appendChild(icon);

      // Title
      var title = document.createElement('h2');
      title.innerHTML = 'Delete ' + item + '?';

      popup.appendChild(title);

      // Description
      var description = document.createElement('p');
      description.innerHTML = 'Are you sure you want to delete ' + name + '? This action can not be undone.';

      popup.appendChild(description);

      // Note (if there is one)
      if (deleteNote.length > 0)
      {
        var note = document.createElement('p');
        note.classList.add('delete-note');

        note.innerHTML = deleteNote;

        popup.appendChild(note);
      }

      // Cancel button
      var cancelButton = document.createElement('a');
      cancelButton.classList.add('pure-button');
      
      cancelButton.innerHTML = 'Cancel';
      cancelButton.setAttribute('onclick', 'cancelPopupDelete(this)');

      popup.appendChild(cancelButton);

      // Delete button
      var deleteButton = document.createElement('a');
      deleteButton.classList.add('pure-button');
      
      deleteButton.innerHTML = 'Delete';
      deleteButton.setAttribute('onclick', 'cancelPopupDelete(this)');
      deleteButton.setAttribute('href', deleteLink);

      popup.appendChild(deleteButton);

    overlay.appendChild(popup);

  document.getElementsByTagName('body')[0].appendChild(overlay);
}

// Closing delete confirmation pop up
function cancelPopupDelete(element)
{
  element.parentElement.parentElement.remove();
}

// Creating a double check click before deleting something
function doubleCheckDelete_TableView(deleteLink, item)
{
  // deleteLink: /delete-address/id
  // split result array: {"", "delete-address", "id"}
  const urlSplit = deleteLink.split('/');
  const id = urlSplit[2];

  // Making sure there is not already a delete confirmation (they have an id of the id)
  if (!document.getElementById('delete?' + id))
  {
    // Creating elements to confirm the delete

    // DIV that holds elements
    var confirmationContainer = document.createElement('div');
    confirmationContainer.setAttribute('class', 'confirm-wrapper');
    confirmationContainer.setAttribute('id', 'delete?' + id);

      var confirmationText = document.createElement('p');
      confirmationText.innerHTML = 'Delete this ' + item + '?';
      confirmationContainer.appendChild(confirmationText);

      var cancelButton = document.createElement('a');
      cancelButton.setAttribute('class', 'pure-button worldList no-delete');
      cancelButton.setAttribute('onclick', 'cancelDelete("' + id + '")');
      cancelButton.innerHTML = 'Cancel';
      confirmationContainer.appendChild(cancelButton);

      var deleteButton = document.createElement('a');
      deleteButton.setAttribute('class', 'pure-button worldList delete');
      deleteButton.setAttribute('href', deleteLink);
      deleteButton.innerHTML = 'Delete';
      confirmationContainer.appendChild(deleteButton);

    // Finding the div with the id of this server id to put the check message in
    
    var parentElement = document.getElementById(id);
    
    parentElement.insertBefore(confirmationContainer, parentElement.lastElementChild);
  }

}

// Canceling the delete by user request
function cancelDelete(elementId)
{
  // Deleting delete confirmation div
  var confirmation = document.getElementById('delete?' + elementId);
  confirmation.remove();
}

// uploadedContent page ----------------------------------------------------------------------------------------------------------------------------------

// Hiding information about file and displaying delete confirmation
function doubleCheckDelete_UploadFile(fileName)
{
    document.getElementById('info' + fileName).style.display = 'none';
    document.getElementById('deleteConfirmation' + fileName).style.display = 'block';
}

// Canceling delete by hiding delete confirmation and displaying information about the file again
function cancelDelete_UploadFile(fileName)
{
  document.getElementById('info' + fileName).style.display = 'block';
  document.getElementById('deleteConfirmation' + fileName).style.display = 'none';
}

// magicLinks page ---------------------------------------------------------------------------------------------------------------------------------------

// Showing information to renew the magic link
function renewLink(link)
{
  document.getElementById('renew:' + link).style.display = 'block';
}

// Hiding information to renew the magic link
function cancelRenewLink(link)
{
  document.getElementById('renew:' + link).style.display = 'none';
}

// Checking if any other buttons are currently active
// If they are, deactivate them
function checkOtherButtons(link, buttonClicked)
{
  if (buttonClicked === 'renew')
  {
    if (document.getElementById('delete?' + link))
    {
      var confirmation = document.getElementById('delete?' + link);
      confirmation.remove();
    }
  }
  else if (buttonClicked = 'delete')
  {
    if (document.getElementById('renew:' + link).style.display === 'block')
    {
      document.getElementById('renew:' + link).style.display = 'none';
    }
  }
}