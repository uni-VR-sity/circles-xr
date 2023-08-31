// JS for click confirmations (ex. confirmation to delete)

// General -----------------------------------------------------------------------------------------------------------------------------------------------

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
    let confirmationContainer = document.createElement('div');
    confirmationContainer.setAttribute('class', 'confirm-wrapper');
    confirmationContainer.setAttribute('id', 'delete?' + id);

      let confirmationText = document.createElement('p');
      confirmationText.innerHTML = 'Delete this ' + item + '?';
      confirmationContainer.appendChild(confirmationText);

      let cancelButton = document.createElement('a');
      cancelButton.setAttribute('class', 'pure-button worldList no-delete');
      cancelButton.setAttribute('onclick', 'cancelDelete("' + id + '")');
      cancelButton.innerHTML = 'Cancel';
      confirmationContainer.appendChild(cancelButton);

      let deleteButton = document.createElement('a');
      deleteButton.setAttribute('class', 'pure-button worldList delete');
      deleteButton.setAttribute('href', deleteLink);
      deleteButton.innerHTML = 'Delete';
      confirmationContainer.appendChild(deleteButton);

    // Finding the div with the id of this server id to put the check message in
    
    let parentElement = document.getElementById(id);
    
    parentElement.insertBefore(confirmationContainer, parentElement.lastElementChild);
  }

}

// Canceling the delete by user request
function cancelDelete(elementId)
{
  // Deleting delete confirmation div
  let confirmation = document.getElementById('delete?' + elementId);
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
      let confirmation = document.getElementById('delete?' + link);
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