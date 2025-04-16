'use strict';

// General -----------------------------------------------------------------------------------------------------------------------------------------

// Closing overlay
function openOverlay(id)
{
    var overlay = document.getElementById(id);

    overlay.style.display = 'flex';
}

// ------------------------------------------------------------------------------------------

// Closing overlay
function closeOverlay(id)
{
    var overlay = document.getElementById(id);

    overlay.style.display = 'none';
}

// Closing overlay by reloading page
function closeOverlayReload()
{
    location.reload();
}

// Delete Confirmation -----------------------------------------------------------------------------------------------------------------------------

// Showing delete confirmation
function deleteConfirmationPopUp(event, item, name, deleteFuntion, deleteNote = '')
{
    // Preventing parent from being clicked
    event.stopPropagation();

    // Overlay
    var overlay = document.createElement('div');
    overlay.classList.add('overlay-container');

        // Pop up
        var popup = document.createElement('div');
        popup.classList.add('overlay-delete-confirmation', 'overlay');

            // Icon container
            var iconContainer = document.createElement('div');
            iconContainer.classList.add('icon-container');

                // Icon
                var icon = document.createElement('i');
                icon.classList.add('fa-solid', 'fa-circle-exclamation');

            iconContainer.appendChild(icon);

        popup.appendChild(iconContainer);

            // Title
            var title = document.createElement('h3');
            title.innerHTML = 'Delete ' + item + '?';

        popup.appendChild(title);

            // Description
            var description = document.createElement('p');
            description.innerHTML = 'Are you sure you want to delete ' + name + '? This action can not be undone.';

        popup.appendChild(description);

        // Note (if there is one)
        if (deleteNote.length > 0)
        {
            var note = document.createElement('p');
            note.classList.add('delete-note');

            note.innerHTML = deleteNote;

            popup.appendChild(note);
        }

            // Button Container
            var buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

                // Delete button
                var deleteButtonContainer = document.createElement('div');
                deleteButtonContainer.classList.add('delete-button');

                    var deleteButton = document.createElement('a');
                    
                    deleteButton.innerHTML = 'Delete';
                    deleteButton.setAttribute('onclick', 'cancelPopupDelete(this); ' + deleteFuntion);

                deleteButtonContainer.appendChild(deleteButton);

            buttonContainer.appendChild(deleteButtonContainer);

                // Cancel button
                var cancelButtonContainer = document.createElement('div');
                cancelButtonContainer.classList.add('cancel-button');

                    var cancelButton = document.createElement('a');

                    cancelButton.innerHTML = 'Cancel';
                    cancelButton.setAttribute('onclick', 'cancelPopupDelete(this)');

                cancelButtonContainer.appendChild(cancelButton);

            buttonContainer.appendChild(cancelButtonContainer);

        popup.appendChild(buttonContainer);

    overlay.appendChild(popup);

    overlay.style.display = 'flex';

    document.getElementsByTagName('body')[0].appendChild(overlay);
}

// ------------------------------------------------------------------------------------------

// Closing delete confirmation pop up
function cancelPopupDelete(element)
{
  element.parentElement.parentElement.parentElement.parentElement.remove();
}

// Warning -----------------------------------------------------------------------------------------------------------------------------------------

// Showing warning
function warningPopUp(event, warning, options, details = null)
{
    // Preventing parent from being clicked
    event.stopPropagation();

    // Overlay
    var overlay = document.createElement('div');
    overlay.classList.add('overlay-container');

        // Pop up
        var popup = document.createElement('div');
        popup.classList.add('overlay-warning', 'overlay');

            // Icon container
            var iconContainer = document.createElement('div');
            iconContainer.classList.add('icon-container');

                // Icon
                var icon = document.createElement('i');
                icon.classList.add('fa-solid', 'fa-circle-exclamation');

            iconContainer.appendChild(icon);

        popup.appendChild(iconContainer);

            // Title
            var title = document.createElement('h3');
            title.innerHTML = warning;

        popup.appendChild(title);

            // Description (if there is one)
            if (details)
            {
                var description = document.createElement('p');
                description.innerHTML = details;

                popup.appendChild(description);
            }

            // Button Container
            var buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');
            
            var gridColumnsFormating = '';

            // Option buttons
            for (var i = 0; i < options.buttons.length; i++)
            {
                gridColumnsFormating += 'auto ';

                var optionButtonContainer = document.createElement('div');
                optionButtonContainer.classList.add('option-button');

                    var optionButton = document.createElement('a');
                    
                    optionButton.innerHTML = options.buttons[i];
                    optionButton.setAttribute('onclick', 'cancelPopupDelete(this); ' + options.functions[i]);

                    optionButtonContainer.appendChild(optionButton);

                buttonContainer.appendChild(optionButtonContainer);
            }

                // Cancel button
                gridColumnsFormating += 'auto';

                var cancelButtonContainer = document.createElement('div');
                cancelButtonContainer.classList.add('cancel-button');

                    var cancelButton = document.createElement('a');

                    cancelButton.innerHTML = 'Cancel';
                    cancelButton.setAttribute('onclick', 'cancelPopupDelete(this)');

                cancelButtonContainer.appendChild(cancelButton);
                buttonContainer.style.gridTemplateColumns = gridColumnsFormating;

            buttonContainer.appendChild(cancelButtonContainer);

        popup.appendChild(buttonContainer);

    overlay.appendChild(popup);

    overlay.style.display = 'flex';

    document.getElementsByTagName('body')[0].appendChild(overlay);
}
