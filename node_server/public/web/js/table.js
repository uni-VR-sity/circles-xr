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

// Selecting initial group to be displayed on page load
// Magic Guests start with 'Magic Circles'
// Guests start with 'Public Circles'
// All other users start with 'Your Circles'
function selectCircleGroup(usertype)
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