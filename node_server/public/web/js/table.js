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
        container.style.display = 'none';
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

// Displaying worlds in specified group in specified circle section
function displayWorldsInGroup(sectionID, group)
{
    // Getting all worlds in the section
    var worlds = document.getElementById(sectionID).querySelectorAll('.worldList');

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
        var groupClass = 'GROUP_' + group.replaceAll(' ', '-');

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
}

// Detecting what group is selected to display appropriate worlds
function detectCurrentGroup(sectionName)
{
    // Getting group selection element
    var section = document.getElementById(sectionName + '-groups');

    // Putting event listener to detect when a new group is selected
    section.addEventListener('change', function(event)
    {
        displayWorldsInGroup(sectionName + '-circles-container', event.target.value);
    });
}