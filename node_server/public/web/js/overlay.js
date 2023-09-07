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

// explore page ------------------------------------------------------------------------------------------------------------------------------------------

// Unselecting rows
function unselectAll(overlayID)
{
    // Getting overlay container
    var overlayContainer = document.getElementById(overlayID);

    // Getting exit button
    var button = overlayContainer.querySelector('.overlay-exit');

    // When button is clicked, unselect rows
    button.addEventListener('click', function()
    {
        // Getting all selected rows in the container
        selectedRows_level1 = overlayContainer.querySelectorAll('.selected-level1');
        selectedRows_level2 = overlayContainer.querySelectorAll('.selected-level2');

        // Unselecting all level 1 rows (group rows)
        for (const row of selectedRows_level1)
        {
            showGroupInfo(row.getAttribute('id').replaceAll('-', ' '), false);
        }

        // Unselecting all level 2 rows (subgroup rows)
        for (const row of selectedRows_level2)
        {
            
        }
    });
}