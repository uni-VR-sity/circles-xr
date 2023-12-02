'use strict';

// Adjusting checkbox widths to fit longest one when checkboxes are distributed horizontally (with .horizontal-checkbox-container class)
function checkCheckboxWidth(formID)
{
    // Getting checkboxes to check
    var checkboxContainers = document.getElementById(formID).querySelectorAll('.horizontal-checkbox-container');

    // Finding longest checkbox
    var maxWidth = -1;

    for (const container of checkboxContainers)
    {
        if (container.offsetWidth > maxWidth)
        {
            maxWidth = container.offsetWidth;
        }
    }

    // Setting every checkbox to the longest label + 50px
    maxWidth += 50;

    for (const container of checkboxContainers)
    {
        container.style.width = maxWidth;
    }
}

// ------------------------------------------------------------

// Activating custom date form
function customDateForm (selectorID, customDateID)
{
    // Getting form elements
    var selector = document.getElementById(selectorID);
    var customDate = document.getElementById(customDateID);

    // Hiding custom field by default
    customDate.style.display = 'none';

    // Checking for change in selector
    selector.addEventListener('change', function(event)
    {   
        // If custom field selected, show it
        // Otherwise make sure it is hidden
        if (event.target.value === 'custom')
        {
            customDate.style.display = 'inline-block';
        }
        else
        {
            customDate.style.display = 'none';
        }
    });
}

// ------------------------------------------------------------

// Copying text from input
function copyText(inputId) 
{
    var input = document.getElementById(inputId);

    // Select the text field
    input.select(); 
    input.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field (need to use promises so this actually copies)
    navigator.clipboard.writeText(input.value).then(function() 
    {
        alert("Copied the magic link!");
    });
}