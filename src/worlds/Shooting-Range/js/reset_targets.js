// Generates new targets, replacing the existing ones

'user strict'

// Component
AFRAME.registerComponent('reset_targets', 
{
    init : function() 
    {
        const CONTEXT_AF = this;

        var element = CONTEXT_AF.el;

        // On button click
        element.addEventListener('click', function()
        {
            // Playing button press sound
            var buttonPress = document.querySelector('#buttonSoundEntity');
            buttonPress.components.sound.playSound();

            // Removing the target generator component for the target container
            var targetContainer = document.querySelector('#targets');
            targetContainer.removeAttribute('target_generator');

            // Deleting all exsiting targets
            targetContainer.setAttribute('delete_targets', {});
            targetContainer.removeAttribute('delete_targets');

            // Generating targets again
            targetContainer.setAttribute('target_generator', {});

        });
    }
});