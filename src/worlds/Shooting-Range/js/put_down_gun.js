// Puts down the gun
// Targets are removed and other guns are back on the table

'user strict'

// Component
AFRAME.registerComponent('put_down_gun', 
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

            // Executing button click in 250 milliseconds
            setTimeout(function() 
            {
                // Removing the target generator component for the target container
                var targetContainer = document.querySelector('#targets');
                targetContainer.removeAttribute('target_generator');

                // Deleting all exsiting targets
                targetContainer.setAttribute('delete_targets', {});
                targetContainer.removeAttribute('delete_targets');

                // Deleting current gun being used
                var gun = document.querySelector('.gun');

                gun.parentNode.removeChild(gun);

                // Deleting buttons and removing button generator
                var buttonContainer = document.querySelector('#buttons');

                while (buttonContainer.lastElementChild)
                {
                    buttonContainer.removeChild(buttonContainer.lastElementChild);
                }

                buttonContainer.removeAttribute('button_generator');

                // Generating guns on table 
                var scene = document.querySelector('#scene');
                scene.setAttribute('gun_generator', {});

            }, 250);
        });
    }
});