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

    newInput.setAttribute('type', 'text');
    newInput.setAttribute('form', 'createGroup');
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

// Showing subgroup details of clicked group row
function groupRowClick(event, groupInfo)
{
  // Making sure the trash button was not clicked
  if (!event.target.classList.contains('garbage-icon'))
  {
    var row = event.target.parentElement;

    // If row is already selected, unselect it
    // Otherwise, select it
    if (row.classList.contains('selected-level1'))
    {
      showGroupInfo(groupInfo.name, false);
      showSubgroupInfo(groupInfo.name, 'noGroup', false);

      for (const subgroup of groupInfo.subgroups)
      {
        showSubgroupInfo(groupInfo.name, subgroup.name, false);
      }
    }
    else
    {
      showGroupInfo(groupInfo.name, true);
      showSubgroupInfo(groupInfo.name, 'noGroup', true);
    }
  }
}

// Showing world details of clicked subgroup row
function subgroupRowClick(event, groupInfo, subgroupInfo)
{
  // Making sure the trash button was not clicked
  if (!event.target.classList.contains('garbage-icon'))
  {
    var row = event.target.parentElement;

    // If row is already selected, unselect it
    // Otherwise, select it
    if (row.classList.contains('selected-level2'))
    {
      showSubgroupInfo(groupInfo.name, subgroupInfo.name, false);
    }
    else
    {
      showSubgroupInfo(groupInfo.name, subgroupInfo.name, true);
    }
  }
}

// Showing or hiding (depending is 'show' is true or false) group subgroup information
function showGroupInfo(groupName, show)
{
  var groupRow = document.getElementById(groupName.replaceAll(' ', '-'));

  if (show)
  {
    groupRow.classList.add('selected-level1');
  }
  else
  {
    groupRow.classList.remove('selected-level1');
  }

  // Getting all subgroups under the group
  var subgroupRows = document.getElementsByClassName('info-row-' + groupName.replaceAll(' ', '-'));

  // Displaying rows
  for (const row of subgroupRows)
  {
    if (show)
    {
      row.style.display = 'table-row';
    }
    else
    {
      row.style.display = 'none';
    }
  }
}

// Showing or hiding (depending is 'show' is true or false) subgroup world information
function showSubgroupInfo(groupName, subgroupName, show)
{
  if (subgroupName !== 'noGroup')
  {
    var subgroupRow = document.getElementById(groupName.replaceAll(' ', '-') + '/' + subgroupName.replaceAll(' ', '-'));

    if (show)
    {
      subgroupRow.classList.add('selected-level2');
    }
    else
    {
      subgroupRow.classList.remove('selected-level2');
    }
  }

  // Getting all subgroups under the group
  var worldRows = document.getElementsByClassName('world-row-' + subgroupName.replaceAll(' ', '-') + '-' + groupName.replaceAll(' ', '-'));

  // Displaying rows
  for (const row of worldRows)
  {
    if (show)
    {
      row.style.display = 'table-row';
    }
    else
    {
      row.style.display = 'none';
    }
  }
}

// worldAccess page --------------------------------------------------------------------------------------------------------------------------------------

// Displaying subgroups according to the selected group
function displaySubgroups(allGroups, currentGroup, currentSubgroup = null)
{
  var groups = JSON.parse(allGroups);

  // Getting subgroups in the current group
  var subgroups = [];

  for (const group of groups)
  {
    if (group.name === currentGroup.replaceAll('-', ' '))
    {
      for (const subgroup of group.subgroups)
      {
        subgroups.push(subgroup.name);
      }
    }
  }

  // Getting subgroup form
  var subgroupSelector = document.getElementById('currentSubgroup');

  // Deleting current form options
  var child = subgroupSelector.firstElementChild ;
  
  while(child)
  {
    child.remove();
    child = subgroupSelector.firstElementChild ;
  }

  // Creating form option for current group
  function createOption(subgroup)
  {
    var option = document.createElement('option');

    option.setAttribute('value', subgroup.replaceAll(' ', '-'));
    option.innerHTML = subgroup;

    if (subgroup === 'No Subgroup')
    {
      option.style.color = 'var(--GREY)';
    }

    if (subgroup === currentSubgroup)
    {
      option.setAttribute('selected', 'true');
    }

    subgroupSelector.appendChild(option);
  }

  // Creating no subgroup option
  createOption('No Subgroup');

  // Dispaying all subgroup options in subgroup form
  for (const subgroup of subgroups)
  {
    createOption(subgroup);
  }

  // Greying out form if there is no subgroup selected
  if (currentSubgroup)
  {
    subgroupSelector.classList.remove('nothing-selected');
  }
  else
  {
    subgroupSelector.classList.add('nothing-selected');
  }
}

// Detecting when the world group is updated
function listenForGroupUpdate(allGroups, currentGroup)
{
  // Getting group form
  var groupSelector = document.getElementById('currentGroup');

  // Greying out form when no group is selected (or reversing it)
  function greyForm(selected)
  {
    if (selected)
    {
      groupSelector.classList.add('nothing-selected');
    }
    else
    {
      groupSelector.classList.remove('nothing-selected');
    }
  }

  if (!currentGroup)
  {
    greyForm(true);
  }

  // Putting event listener to detect when a new group is selected
  groupSelector.addEventListener('change', function(event)
  {
    greyForm((event.target.value === 'No-Group'));
    displaySubgroups(allGroups, event.target.value);
  });
}

// Detecting when the world subgroup is updated
function listenForSubgroupUpdate()
{
  // Getting group form
  var subgroupSelector = document.getElementById('currentSubgroup');

  // Greying out form when no subgroup is selected (or reversing it)
  function greyForm(selected)
  {
    if (selected)
    {
      subgroupSelector.classList.add('nothing-selected');
    }
    else
    {
      subgroupSelector.classList.remove('nothing-selected');
    }
  }

  // Putting event listener to detect when a new group is selected
  subgroupSelector.addEventListener('change', function(event)
  {
    greyForm((event.target.value === 'No-Subgroup'));
  });
}