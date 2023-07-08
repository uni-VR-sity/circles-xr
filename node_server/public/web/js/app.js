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

// Adding another input into the server form ('moreCircles' page)
function addWorldInput(aboveElementId)
{
  // Generating a random work to be a placeholder in the input
  function randomWord()
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

  let newInput = document.createElement('input');
  let aboveElement = document.getElementById(aboveElementId);

  newInput.setAttribute('class', 'field-long');
  newInput.setAttribute('type', 'text');
  newInput.setAttribute('name', 'worlds');
  newInput.setAttribute('placeholder', randomWord());

  aboveElement.parentNode.insertBefore(newInput, aboveElement);
}

// Creating a double check click before deleting the server ('moreCircles' page)
function doubleCheckDelete_Server(deleteLink)
{
  // deleteLink: /delete-server/serverId
  // split result array: {"", "delete-server", "serverId"}
  const urlSplit = deleteLink.split('/');
  const id = urlSplit[2];

  // Making sure there is not already a delete confirmation (they have an id of the serve id)
  if (!document.getElementById('delete?' + id))
  {
    // Creating elements to confirm the delete

    // DIV that holds elements
    let confirmationContainer = document.createElement('div');
    confirmationContainer.setAttribute('class', 'confirm-delete-wrapper');
    confirmationContainer.setAttribute('id', 'delete?' + id);
    

    let confirmationText = document.createElement('p');
    confirmationText.innerHTML = 'Delete this server?';
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

// Canceling the delete by user request ('moreCircles' page)
function cancelDelete_Server(elementId)
{
  // Deleting delete confirmation div
  let confirmation = document.getElementById('delete?' + elementId);
  confirmation.remove();
}