// Deletes all targets

'user strict'

// Functions

// Delete targets
deleteTargets = function(targetContainer)
{
    while (targetContainer.lastElementChild)
    {
        targetContainer.removeChild(targetContainer.lastElementChild);
    }
}

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('delete_targets', 
{
    init : function() 
    {
        // Deleting exiting target elements
        var targets;

        // Deleting front row targets
        targets = document.querySelector('#frontRow');
        deleteTargets(targets);

        // Deleting middle row targets
        targets = document.querySelector('#middleRow');
        deleteTargets(targets);


        // Deleting back row targets
        targets = document.querySelector('#backRow');
        deleteTargets(targets);
    }
});