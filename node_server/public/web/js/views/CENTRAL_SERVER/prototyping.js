'use strict';

// Global Variables --------------------------------------------------------------------------------------------------------------------------------


// Prototyping -------------------------------------------------------------------------------------------------------------------------------------

// 
function newPrototype()
{
    // Send request to create new prototypes
    var request = new XMLHttpRequest();
    request.open('POST', '/create-new-prototype');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.onload = function() 
    {
        var response = JSON.parse(request.response);

        console.log(response);
    }

    request.send();
}

// ------------------------------------------------------------------------------------------