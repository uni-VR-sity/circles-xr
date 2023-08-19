window.onload = function () {
  //have something in the group field when opening page
  //let's not as "explore" will be used if field is blank
  // if (typeof MagicLinkGroup !== 'undefined') {
  //   autogenerateGroupName(MagicLinkGroup, 4);
  // }

  let popover = new Popover();
  const cps = document.querySelectorAll('.colorPicker'); //from here - https://github.com/tovic/color-picker 

  if (!cps.length) {
    return;
  }

  for (let i = 0; i < cps.length; i++) {
    let picker = new CP(cps[i]);

    picker.on("change", function (color) {
      let v = CP.HEX2RGB(color);
      //v = alpha.value == 1 ? 'rgb(' + v.join(', ') + ')' : 'rgba(' + v.join(', ') + ', ' + alpha.value.replace(/^0\./, '.') + ')';
      v = 'rgb(' + v.join(', ') + ')';
      this.target.value = v;
      this.target.style.backgroundColor = v;
    });

    //update on direct text change ... not great UX but will do for now
    let update = function () {
      picker.set(this.value).enter();
    }

    picker.target.oncut = update;
    picker.target.onpaste = update;
    picker.target.onkeyup = update;
    picker.target.oninput = update;
  }
}

class Popover {
  constructor() {
    this.activator = document.querySelector('.topbar-header__popover-activator');
    this.popover = document.querySelector('.topbar-popover');
    this.wrapper = document.querySelector('.topbar-header__popover-wrapper');
    this.activator.addEventListener('click', this.togglePopover.bind(this));
    document.addEventListener('click', this.closePopover.bind(this));
  }

  togglePopover() {
    this.popover.classList.toggle('topbar-popover--is-visible');
  }

  closePopover(evt) {
    if (!this.wrapper.contains(evt.target) ) {
      this.popover.classList.remove('topbar-popover--is-visible');
    }
  }
}

//********** timer functionality
let g_intervalTimer = null;

function startCoundown(numMS, textId) {
  clearInterval(g_intervalTimer); //remove if already counting down

  let currTime = new Date();
  let countDownDate = new Date(currTime.getTime() + numMS).getTime();

  // Update the count down every 1 second
  g_intervalTimer = setInterval(function() {
    // Get today's date and time
    let now = new Date().getTime();
      
    // Find the distance between now and the count down date
    let time_distance = countDownDate - now;
      
    // Time calculations for days, hours, minutes and seconds
    let seconds = Math.floor(time_distance / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    let days = Math.floor(hours / 24);
    hours = hours % 24;
      
    // Output the result in an element with id="demo"
    document.querySelector('#' + textId).innerHTML = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
      
    // If the count down is over, write some text 
    if (time_distance < 0) {
      clearInterval(g_intervalTimer);
      document.querySelector('#' + textId).innerHTML = "EXPIRED";
    }
  }, 1000);
}

function copyText(copyTextElem) {
  // Select the text field
  copyTextElem.select(); 
  copyTextElem.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field (need to use promises so this actually copies)
  navigator.clipboard.writeText(copyTextElem.value).then(function() {
    alert("Copied the magic link!");
  });
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
    let confirmationContainer = document.createElement('div');
    confirmationContainer.setAttribute('class', 'confirm-wrapper');
    confirmationContainer.setAttribute('id', 'delete?' + id);

      let confirmationText = document.createElement('p');
      confirmationText.innerHTML = 'Delete this ' + item + '?';
      confirmationContainer.appendChild(confirmationText);

      let cancelButton = document.createElement('a');
      cancelButton.setAttribute('class', 'pure-button worldList no-delete');
      cancelButton.setAttribute('onclick', 'cancelDelete_TableView("' + id + '")');
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
function cancelDelete_TableView(elementId)
{
  // Deleting delete confirmation div
  let confirmation = document.getElementById('delete?' + elementId);
  confirmation.remove();
}

// Hiding information about file and displaying delete confirmation (uploadedContent page)
function doubleCheckDelete_UploadFile(fileName)
{
    document.getElementById('info' + fileName).style.display = 'none';
    document.getElementById('deleteConfirmation' + fileName).style.display = 'block';
}

// Canceling delete by hiding delete confirmation and displaying information about the file again (uploadedContent page)
function cancelDelete_UploadFile(fileName)
{
  document.getElementById('info' + fileName).style.display = 'block';
  document.getElementById('deleteConfirmation' + fileName).style.display = 'none';
}

// Showing information to renew the magic link (magicLinks page)
function renewLink(link)
{
  document.getElementById('renew:' + link).style.display = 'block';
}

// Hiding information to renew the magic link (magicLinks page)
function cancelRenewLink(link)
{
  document.getElementById('renew:' + link).style.display = 'none';
}

// Checking if any other buttons are currently active (magicLinks page)
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