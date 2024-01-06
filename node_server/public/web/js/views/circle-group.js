'use strict';

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
  var subgroupSelector = document.getElementById('current-subgroup');

  // Deleting current form options
  var child = subgroupSelector.firstElementChild;
  
  while(child)
  {
    child.remove();
    child = subgroupSelector.firstElementChild;
  }

  // Creating form option
  function createOption(subgroup)
  {
    var option = document.createElement('option');

    option.setAttribute('value', subgroup.replaceAll(' ', '-'));
    option.innerHTML = subgroup;

    if (subgroup === 'No Subgroup')
    {
      option.setAttribute('id', 'no-subgroup');
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

// ------------------------------------------------------------------------------------------

// Detecting when the circle group is updated
function listenForGroupUpdate(allGroups, currentGroup)
{
  // Getting group form
  var groupSelector = document.getElementById('current-group');

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

// ------------------------------------------------------------------------------------------

// Detecting when the circle subgroup is updated
function listenForSubgroupUpdate()
{
  // Getting group form
  var subgroupSelector = document.getElementById('current-subgroup');

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