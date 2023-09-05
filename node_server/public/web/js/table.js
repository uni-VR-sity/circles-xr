// JS for tables

// explore page ------------------------------------------------------------------------------------------------------------------------------------------

// Displaying specified circles section
function showCirclesSection(section)
{
    // Getting table bar
    var tableBar = document.getElementById('circles-bar');

    // If another tab is selected, unselect it
    if (tableBar.querySelector('.selected'))
    {
        tableBar.querySelector('.selected').classList.remove('selected');
    }

    // Getting specified tab for section
    var tab = document.getElementById(section);
    tab.classList.add('selected');

    // Make sure all containers are hidden
    for (var container of document.getElementsByClassName('table-container'))
    {
        var id = container.getAttribute('id');

        if (id === 'magic-circles-container' || id === 'your-circles-container' || id === 'public-circles-container' || id === 'editable-circles-container')
        {
            container.style.display = 'none';
        }
    }

    // Displaying the container on the specified section
    document.getElementById(section + '-container').style.display = 'block';

}

// Selecting initial section to be displayed on page load
// Magic Guests start with 'Magic Circles'
// Guests start with 'Public Circles'
// All other users start with 'Your Circles'
function selectCircleSection(usertype)
{
    switch(usertype)
    {
        // Magic Guest
        case CIRCLES.USER_TYPE.MAGIC_GUEST:
            showCirclesSection('magic-circles');
            break;

        // Guest
        case CIRCLES.USER_TYPE.GUEST:
            showCirclesSection('public-circles');
            break;

        // All other users
        default:
            showCirclesSection('your-circles');
            break
    }
}

// Displaying worlds in specified subgroup of specified group in specified section
function displayWorldsInSubgroup(sectionName, group, subgroup)
{
    // Getting all worlds in the section
    var worlds = document.getElementById(sectionName + '-circles-container').querySelectorAll('.worldList');

    // If subgroup is "all", display all worlds in the group in the section
    if (subgroup === 'all')
    {
        var groupClass = 'GROUP_' + group;

        for (const world of worlds)
        {
            if (world.classList.contains(groupClass))
            {
                world.style.display = 'inline-block';
            }
            else
            {
                world.style.display = 'none';
            }
        }
    }
    else 
    {
        var groupClass = 'GROUP_' + group;
        var subgroupClass = 'SUBGROUP_' + subgroup;

        for (const world of worlds)
        {
            if (world.classList.contains(groupClass) && world.classList.contains(subgroupClass))
            {
                world.style.display = 'inline-block';
            }
            else
            {
                world.style.display = 'none';
            }
        }
    }
}

// Creating subgroup selector for specified subgroup in specified circle section
function createSubgroupSelector(sectionName, subgroups, group)
{
    // Getting section group selector container
    var sectionSelector = document.getElementById(sectionName + '-circles-container').querySelector('.table-group-selector');

    // Creating selector
    var selector = document.createElement('select');

    selector.setAttribute('id', sectionName + '-subgroups');
    selector.setAttribute('name', sectionName + '-subgroups');

        // Setting selector options

        // "All"
        var allOption = document.createElement('option');

        allOption.setAttribute('value', 'all');
        allOption.innerHTML = 'All'

        selector.appendChild(allOption);

        // Subgroups
        for (const subgroup of subgroups)
        {
            var option = document.createElement('option');

            option.setAttribute('value', subgroup.name.replaceAll(' ', '-'));
            option.innerHTML = subgroup.name;

            selector.appendChild(option);
        }

    sectionSelector.appendChild(selector);

    // Putting event listener on selector to detect what subgroup is selected to display appropriate worlds
    selector.addEventListener('change', function(event)
    {
        displayWorldsInSubgroup(sectionName, group, event.target.value);
    });
}

// Displaying worlds in specified group in specified circle section
function displayWorldsInGroup(sectionName, group, sectionWorldInfo)
{
    // Getting section
    var section = document.getElementById(sectionName + '-circles-container');

    // Getting all worlds in the section
    var worlds = section.querySelectorAll('.worldList');

    // If group is "all", display all worlds in the section
    if (group === 'all')
    {
        for (const world of worlds)
        {
            world.style.display = 'inline-block';
        }
    }
    else 
    {
        var groupClass = 'GROUP_' + group;

        for (const world of worlds)
        {
            if (world.classList.contains(groupClass))
            {
                world.style.display = 'inline-block';
            }
            else
            {
                world.style.display = 'none';
            }
        }
    }

    // Deleting current subgroup selector
    var oldSubgroupSelector = section.querySelector('#' + sectionName + '-subgroups');

    if (oldSubgroupSelector)
    {
        oldSubgroupSelector.remove();
    }

    // Creating new subgroup selector according to the subgroups in the group

    var groupInfo;

    // Getting current group
    for (const sectionGroup of sectionWorldInfo.groups)
    {
        if (sectionGroup.name === group.replaceAll('-', ' '))
        {
            // If group has subgroups, create subgroup selector
            if (sectionGroup.subgroups.length > 0)
            {
                createSubgroupSelector(sectionName, sectionGroup.subgroups, group);
            }
        }
    }
}

// Detecting what group is selected to display appropriate worlds
function detectCurrentGroup(sectionName, sectionWorldInfo)
{
    // Getting group selection element
    var section = document.getElementById(sectionName + '-groups');

    // Putting event listener to detect when a new group is selected
    section.addEventListener('change', function(event)
    {
        displayWorldsInGroup(sectionName, event.target.value, JSON.parse(sectionWorldInfo));
    });
}

// Setting up group settings button
function setUpSettings(overlayID)
{
    // Getting overlay
    var overlay = document.getElementById(overlayID);

    // Getting settings buttons
    var buttons = document.getElementsByClassName('table-group-settings');

    // When buttons are clicked, display manage groups overlay
    for (const button of buttons)
    {
        button.addEventListener('click', function()
        {
            overlay.style.display = 'flex';
        });
    }
}