// JS for overlays

// General -----------------------------------------------------------------------------------------------------------------------------------------------

// Setting up button to close overlay
function exitOverlay(overlayID)
{
    // Getting overlay container
    var overlayContainer = document.getElementById(overlayID);

    // Getting exit button
    var button = overlayContainer.querySelector('.overlay-exit');

    // When button is clicked, hide overlay
    button.addEventListener('click', function()
    {
        overlayContainer.style.display = 'none';
    });
}