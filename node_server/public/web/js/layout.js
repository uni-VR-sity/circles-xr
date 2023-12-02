'use strict';

// Force reload when back button is pressed (chrome does not keep data correctly when going so just always refresh the page)
// https://stackoverflow.com/questions/8861181/clear-all-fields-in-a-form-upon-going-back-with-browser-back-button
window.addEventListener("pageshow", function(event)
{
    if (event.persisted|| performance.getEntriesByType("navigation")[0].type === 'back_forward') 
    {
        window.location.reload();
    }
});

// Navigation Bar ----------------------------------------------------------------------------------------------------------------------------------------

// Listening for window resize to reset element style values to display properly
var previousWindowWidth = window.innerWidth;

window.addEventListener('resize', function(event)
{
    // Change from mobile width to tablet width
    if (previousWindowWidth < 650 && window.innerWidth >= 650)
    {
        document.getElementsByTagName('nav')[0].removeAttribute('style');
        document.getElementsByClassName('nav-items-container')[0].removeAttribute('style');
        document.getElementsByClassName('profile-container')[0].removeAttribute('style');
    }

    previousWindowWidth = window.innerWidth;
});

// (FOR MOBILE VIEW) Showing and hiding navigation menu on hamburger icon click
function displayNavigation()
{
    var navBar = document.getElementsByTagName('nav')[0];
    var generalNavigation = document.getElementsByClassName('nav-items-container')[0];
    var profileNavigation = document.getElementsByClassName('profile-container')[0];

    if (generalNavigation.style.display != 'block' && profileNavigation.style.display != 'block')
    {
        navBar.style.backgroundColor = 'var(--LIGHT_GREY)';
        generalNavigation.style.display = 'block';
        profileNavigation.style.display = 'block';
    }
    else
    {
        navBar.style.backgroundColor = 'var(--WHITE)';
        generalNavigation.style.display = 'none';
        profileNavigation.style.display = 'none';
    }
}