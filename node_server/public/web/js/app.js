// General JS for pages

// -------------------------------------------------------------------------------------------------------------------------------------------------------

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

// uploadedContent page ----------------------------------------------------------------------------------------------------------------------------------

// Get dimensions of files to save in database
function getDimensions(fileID)
{
  let file = document.getElementById(fileID);

  let height;
  let width;

  // Image
  if (file.tagName === 'IMG')
  {
    height = file.naturalHeight;
    width = file.naturalWidth;
  }
  // Video
  else
  {
    height = file.videoHeight;
    width = file.videoWidth;
  }

  var request = new XMLHttpRequest();
  request.open('POST', '/set-file-dimensions');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send('file='+ fileID + '&height=' + height + '&width=' + width);
}

// explore page ------------------------------------------------------------------------------------------------------------------------------------------

// Adding another input into the group form
function addSubgroupInput(element)
{
  var previousInput = element.parentElement;
  var parentElement = previousInput.parentElement;
  var addButton = element.cloneNode(true);

  // Deleting current plus button
  element.remove();

  // Adding removing input button next to previous input
  var minusButton = document.createElement('i');

  minusButton.classList.add('fa-solid', 'fa-minus', 'icon-background', 'lg-icon');
  minusButton.style.marginLeft = '-6px';

  minusButton.setAttribute('onclick', 'removeSubgroupInput(this)');

  previousInput.appendChild(minusButton);

  // Creating new input
  var inputContainer =  document.createElement('div');
  
    var newInput = document.createElement('input');

    newInput.setAttribute('class', 'stacked-input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('name', 'subgroups');
    newInput.setAttribute('placeholder', 'Subgroup name...');

    inputContainer.appendChild(newInput);
    inputContainer.appendChild(addButton);

  parentElement.appendChild(inputContainer);
}

// Removing input from the group form
function removeSubgroupInput(element)
{
  var input = element.parentElement;

  input.remove();
}