'use strict';

// Force reload when back button is pressed (chrome does not keep data correctly when going so just always refresh the page)
// https://stackoverflow.com/questions/8861181/clear-all-fields-in-a-form-upon-going-back-with-browser-back-button
window.addEventListener('pageshow', function(event)
{
    if (event.persisted|| performance.getEntriesByType('navigation')[0].type === 'back_forward') 
    {
        window.location.reload();
    }
});

// Navigation Bar ----------------------------------------------------------------------------------------------------------------------------------

// Listening for window resize to reset element style values to display properly
var previousWindowWidth = window.innerWidth;

window.addEventListener('resize', function(event)
{
    // Change from mobile width to tablet width
    if (previousWindowWidth < 650 && window.innerWidth >= 650)
    {
        var navBar = document.getElementsByTagName('nav')[0];

        if (navBar)
        {
            navBar.removeAttribute('style');

            var navItems = document.getElementsByClassName('nav-items-container')[0];

            if (navItems)
            {
                navItems.removeAttribute('style');
            }
            
            var navProfile = document.getElementsByClassName('profile-container')[0];

            if (navProfile)
            {
                navProfile.removeAttribute('style');
            }
        }
    }

    previousWindowWidth = window.innerWidth;
});

// (FOR MOBILE VIEW) Showing and hiding navigation menu on hamburger icon click
function displayNavigation()
{
    var navBar = document.getElementsByTagName('nav')[0];
    var navItems = document.getElementsByClassName('nav-items-container')[0];
    var navProfile = document.getElementsByClassName('profile-container')[0];

    if (navBar && navItems && navProfile)
    {
        if (navItems.style.display != 'block' && navProfile.style.display != 'block')
        {
            navBar.style.backgroundColor = 'var(--LIGHT_GREY)';
            navItems.style.display = 'block';
            navProfile.style.display = 'block';
        }
        else
        {
            navBar.style.backgroundColor = 'var(--WHITE)';
            navItems.style.display = 'none';
            navProfile.style.display = 'none';
        }
    }
}