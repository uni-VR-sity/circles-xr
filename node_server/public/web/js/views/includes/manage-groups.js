'use strict';

// Subgroup Inputs ---------------------------------------------------------------------------------------------------------------------------------

// Adding another input into the group form
function addSubgroupInput(element)
{
    var previousInput = element.parentElement.parentElement;
    var parentElement = previousInput.parentElement;
    var addButton = element.parentElement.cloneNode(true);

    // Deleting current plus button
    element.parentElement.remove();

    // Adding removing input button next to previous input
    var minusButtonContainer = document.createElement('div');

    minusButtonContainer.classList.add('icon-container', 'remove-subgroup-icon');

        var minusButton = document.createElement('i');

        minusButton.classList.add('fa-solid', 'fa-minus');

        minusButton.setAttribute('onclick', 'removeSubgroupInput(this)');

    minusButtonContainer.appendChild(minusButton);
    previousInput.appendChild(minusButtonContainer);

    previousInput.classList.add('added-subgroup-field');

    // Creating new input
    var inputContainer =  document.createElement('div');
    
    inputContainer.classList.add('subgroup-field');
    
        var newInput = document.createElement('input');

        newInput.setAttribute('type', 'text');
        newInput.setAttribute('form', 'create-group-form');
        newInput.setAttribute('name', 'subgroups');
        newInput.setAttribute('placeholder', 'Subgroup name...');

        inputContainer.appendChild(newInput);
        inputContainer.appendChild(addButton);

    parentElement.appendChild(inputContainer);
}

// ------------------------------------------------------------------------------------------

// Removing input from the group form
function removeSubgroupInput(element)
{
    var input = element.parentElement.parentElement;

    input.remove();
}

// ------------------------------------------------------------------------------------------

// Removing extra subgroup inputs
function removeExtraSubgroupInputs(form)
{
    var extraInputs = form.querySelectorAll('.added-subgroup-field');

    for (var i = 0; i < extraInputs.length; i++)
    {
        extraInputs[i].remove();
    }
}

// Creating ----------------------------------------------------------------------------------------------------------------------------------------

// Checking that input doesn't contain ', ", or -
function validInput(input)
{
    if (input.includes("'"))
    {
        return false;
    }
    else if (input.includes('"'))
    {
        return false;
    }
    else if (input.includes('-'))
    {
        return false;
    }

    return true;
}

// ------------------------------------------------------------------------------------------

// Updating number of subgroups in group row
function updateSubgroupNum(row, increasing)
{
    var subgroupNum = row.querySelector('.subgroup-num');
    var oldNum = parseInt(subgroupNum.innerHTML[0]);

    var newNum = oldNum;

    if (increasing)
    {
        newNum++;
    }
    else
    {
        newNum--;
    }

    if (newNum === 1)
    {
        subgroupNum.innerHTML = newNum + ' subgroup';
    }
    else
    {
        subgroupNum.innerHTML = newNum + ' subgroups';
    }
}

// ------------------------------------------------------------------------------------------

// Creating subgroup row
function createSubgroupRow(group, subgroup)
{
    // Getting rows
    var groupRow = document.querySelector('.' + group.replaceAll(' ', '-') + '.group-row');

    var groups = groupRow.parentElement;

    var addSubgroupRow = groups.querySelector('.' + group.replaceAll(' ', '-') + '.group-add-subgroup');

    // Increasing subgroup num in group row
    updateSubgroupNum(groupRow, true);

    // Creating new subgroup row
    var row = document.createElement('div');
    row.classList.add('row', group.replaceAll(' ', '-'), subgroup.replaceAll(' ', '-'), 'group-subgroup', 'hidden-row');
    row.style.display= 'block';

        var subgroupRow = document.createElement('div');
        subgroupRow.classList.add('subgroup-row');

            var collapseIconContainer = document.createElement('div');
            collapseIconContainer.classList.add('icon-container', 'collapse-icon');

                var collapseIcon = document.createElement('i');
                collapseIcon.classList.add('fa-solid', 'fa-angle-right');

            collapseIconContainer.appendChild(collapseIcon);
        
        subgroupRow.appendChild(collapseIconContainer);

            var name = document.createElement('p');
            name.classList.add('subgroup-name');
            name.innerHTML = subgroup;

        subgroupRow.appendChild(name);

            var numCircles = document.createElement('p');
            numCircles.classList.add('greyed', 'circle-num');
            numCircles.innerHTML = '0 circles';

        subgroupRow.appendChild(numCircles);

            var trashIconContainer = document.createElement('div');
            trashIconContainer.classList.add('icon-container', 'trash-icon');

                var trashIcon = document.createElement('i');
                trashIcon.classList.add('fa-regular', 'fa-trash-can');

                var deleteFunction = 'deleteSubgroup(\'' + group + '\', \'' + subgroup + '\')';
                var note = 'Circles in subgroup will NOT be deleted';

                trashIcon.setAttribute('onclick', 'deleteConfirmationPopUp("Subgroup", "' + subgroup + '", "' + deleteFunction + '", "' + note + '")');

            trashIconContainer.appendChild(trashIcon);
        
        subgroupRow.appendChild(trashIconContainer);

    row.appendChild(subgroupRow);

        var line = document.createElement('hr');

    row.appendChild(line);

    groups.insertBefore(row, addSubgroupRow);

    subgroupRowClick(group, subgroup);

    return row;
}

// ------------------------------------------------------------------------------------------

// Creating group row and its subrows
function createGroupRows(group, subgroups)
{
    // Getting group container
    var groups = document.getElementById('groups-container');

    // Group container
    var groupContainer = document.createElement('div');
    groupContainer.classList.add('group', group.replaceAll(' ', '-'));

        // Group row
        var groupRow = document.createElement('div');
        groupRow.classList.add('group-row', 'hidden-row', group.replaceAll(' ', '-'));

            // Collapse icon container
            var collapseIconContainer = document.createElement('div');
            collapseIconContainer.classList.add('icon-container', 'collapse-icon');

                // Collapse icon
                var collapseIcon = document.createElement('i');
                collapseIcon.classList.add('fa-solid', 'fa-angle-right');

            collapseIconContainer.appendChild(collapseIcon);

        groupRow.appendChild(collapseIconContainer);

            // Name
            var name = document.createElement('p');
            name.classList.add('group-name');
            name.innerHTML = group;

        groupRow.appendChild(name);

            // Number of subgroups
            var numSubgroups = document.createElement('p');
            numSubgroups.classList.add('greyed', 'subgroup-num');
            numSubgroups.innerHTML = '0 subgroups';

        groupRow.appendChild(numSubgroups);

            // Number of circles
            var numCircles = document.createElement('p');
            numCircles.classList.add('greyed', 'circle-num');
            numCircles.innerHTML = '0 circles';

        groupRow.appendChild(numCircles);

            // Trash icon container
            var trashIconContainer = document.createElement('div');
            trashIconContainer.classList.add('icon-container', 'trash-icon');

                // Trash icon
                var trashIcon = document.createElement('i');
                trashIcon.classList.add('fa-regular', 'fa-trash-can');

                var deleteFunction = 'deleteGroup(\'' + group + '\')';
                var note = 'Circles in group will NOT be deleted';

                trashIcon.setAttribute('onclick', 'deleteConfirmationPopUp(event, "Group", "' + group + '", "' + deleteFunction + '", "' + note + '")');

            trashIconContainer.appendChild(trashIcon);
        
        groupRow.appendChild(trashIconContainer);

    groupContainer.appendChild(groupRow);

    groups.appendChild(groupContainer);

    groupRowClick(group);

    // Adding subgroup rows
    for (const subgroup of subgroups)
    {
        if (subgroup.length > 0)
        {
            var row = createSubgroupRow(group, subgroup);
            row.style.display = 'none';

            groupContainer.appendChild(row);
        }
    }

    // Creating add subgroup row
    var row = document.createElement('div');
    row.classList.add('row', group.replaceAll(' ', '-'), 'group-add-subgroup',);

        var addSubgroupRow = document.createElement('div');
        addSubgroupRow.classList.add('add-subgroup-row');

            var form = document.createElement('form');

            form.setAttribute('id', group.replaceAll(' ', '-') + '-create-subgroup');
            form.setAttribute('onsubmit', 'createSubgroup(event)');
            form.setAttribute('method', 'post');

                var groupFieldContainer = document.createElement('div');

                groupFieldContainer.classList.add('group-field');

                    var groupField = document.createElement('input')
                    groupField.classList.add('hidden-field');

                    groupField.setAttribute('type', 'text');
                    groupField.setAttribute('form', group.replaceAll(' ', '-') + '-create-subgroup');
                    groupField.setAttribute('name', 'group');
                    groupField.setAttribute('value', group);

                groupFieldContainer.appendChild(groupField);

            form.appendChild(groupFieldContainer);
            
                var subgroupFieldContainer = document.createElement('div');

                subgroupFieldContainer.classList.add('subgroup-field');

                    var subgroupField = document.createElement('input');

                    subgroupField.setAttribute('type', 'text');
                    subgroupField.setAttribute('form', group.replaceAll(' ', '-') + '-create-subgroup');
                    subgroupField.setAttribute('name', 'subgroup');
                    subgroupField.setAttribute('placeholder', 'Subgroup name...');
                    subgroupField.setAttribute('required', 'required');

                subgroupFieldContainer.appendChild(subgroupField);

                    var addButtonContainer = document.createElement('div');
                    addButtonContainer.classList.add('icon-container', 'add-subgroup-icon');

                        var label = document.createElement('label');

                            var submit = document.createElement('input');

                            submit.setAttribute('type', 'submit');
                            submit.style.display = 'none';

                        label.appendChild(submit);

                            var icon = document.createElement('i');
                            icon.classList.add('fa-solid', 'fa-square-plus');

                        label.appendChild(icon);

                    addButtonContainer.appendChild(label);

                subgroupFieldContainer.appendChild(addButtonContainer);

            form.appendChild(subgroupFieldContainer);

                var errorMessage = document.createElement('p');
                errorMessage.classList.add('error-message');

            form.appendChild(errorMessage);
                
        addSubgroupRow.appendChild(form);

    row.appendChild(addSubgroupRow);

    groupContainer.appendChild(row);
}

// ------------------------------------------------------------------------------------------

// Creating group through form
function createGroup(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Getting form data
    var formData = new FormData(event.target);

    // Hiding if there are any error messages up
    var errorMessage = document.getElementById('create-group').querySelector('.error-message');
    errorMessage.style.display = 'none';

    // Checking that group name doesn't contain ', ", or -
    if (validInput(formData.get('group')))
    {
        var valid = true;

        // Checking that subgroup names don't contain ', ", or -
        for (const subgroup of formData.getAll('subgroups'))
        {
            if (validInput(subgroup) === false)
            {
                valid = false;
                break;
            }
        }

        if (valid)
        {
            // Sending data to update session name
            var request = new XMLHttpRequest();
            request.open('POST', '/create-group');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            request.onload = function()
            {
                var response = JSON.parse(request.response);

                if (response === 'error')
                {
                    errorMessage.style.display = 'block';
                    errorMessage.innerHTML = 'Something went wrong, please try again';
                }
                else if (response === 'group exists')
                {
                    errorMessage.style.display = 'block';
                    errorMessage.innerHTML = '"' + formData.get('group') + '" group already exits';
                }
                else
                {
                    document.getElementById('no-groups-message').style.display = 'none';

                    createGroupRows(formData.get('group'), formData.getAll('subgroups'));
                
                    event.target.reset();

                    removeExtraSubgroupInputs(event.target);
                }
            }

            var dataString = 'group=' + formData.get('group');

            for (const subgroup of formData.getAll('subgroups'))
            {
                if (subgroup.length > 0)
                {
                    dataString += '&subgroups=' + subgroup;
                }
            }

            request.send(dataString);
        }
        else
        {
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = 'Group or subgroup(s) contain invalid characters (' + "'" + ', ", -)';
        }
    }
    else
    {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Group or subgroup(s) contain invalid characters (' + "'" + ', ", -)';
    }
}

// ------------------------------------------------------------------------------------------

// Creating subgroup through form
function createSubgroup(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Getting form data
    var formData = new FormData(event.target);

    // Hiding if there are any error messages up
    var errorMessage = document.getElementById(formData.get('group').replaceAll(' ', '-') + '-create-subgroup').querySelector('.error-message');
    errorMessage.style.display = 'none';

    // Checking that group name doesn't contain ', ", or -
    if (validInput(formData.get('subgroup')))
    {
        // Sending data to update session name
        var request = new XMLHttpRequest();
        request.open('POST', '/create-subgroup');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onload = function()
        {
            var response = JSON.parse(request.response);

            if (response === 'error')
            {
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = 'Something went wrong, please try again';
            }
            else if (response === 'subgroup exists')
            {
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = '"' + formData.get('subgroup') + '" subgroup already exits';
            }
            else
            {
                createSubgroupRow(formData.get('group'), formData.get('subgroup'));
                
                event.target.reset();
            }
        }

        request.send('group=' + formData.get('group') + '&subgroup=' + formData.get('subgroup'));
    }
    else
    {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Subgroup contain invalid characters (' + "'" + ', ", -)';
    }
}

// Deleting ----------------------------------------------------------------------------------------------------------------------------------------

// Deleting group on user request
function deleteGroup(group)
{
    // Deleting group, subgroup, and circle rows for the group
    var rows = document.getElementsByClassName(group.replaceAll(' ', '-'));

    if (rows)
    {
        while (rows.length > 0)
        {
            rows[0].remove();
        }
    }

    // If that was the last group row, displaying no groups available message
    if (document.getElementsByClassName('group').length === 0)
    {
        document.getElementById('no-groups-message').style.display = 'flex';
    }

    // Sending data to delete group from database
    var request = new XMLHttpRequest();
    request.open('POST', '/delete-group');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.send('group=' + group);
}

// ------------------------------------------------------------------------------------------

// Deleting subgroup on user request
function deleteSubgroup(group, subgroup)
{
    // Deleting subgroup and circle rows for the subgroup
    var rows = document.getElementsByClassName(subgroup.replaceAll(' ', '-'));

    if (rows)
    {
        while (rows.length > 0)
        {
            rows[0].remove();
        }
    }

    // Increasing subgroup num in group row
    updateSubgroupNum(document.querySelector('.' + group.replaceAll(' ', '-') + '.group-row'), false);

    // Sending data to delete group from database
    var request = new XMLHttpRequest();
    request.open('POST', '/delete-subgroup');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    request.send('group=' + group + '&subgroup=' + subgroup);
}

// Row Click ---------------------------------------------------------------------------------------------------------------------------------------

// Collapsing or hiding group and subgroup subrows
function collapseRows(row, subRowClass, isGroup, toDisplay)
{
    if (toDisplay)
    {
        row.classList.replace('hidden-row', 'collapsed-row');

        // Changing icon to show group subrows are collapsed
        row.querySelector('.collapse-icon').querySelector('i').classList.replace('fa-angle-right', 'fa-angle-down');
    }
    else
    {
        row.classList.replace('collapsed-row', 'hidden-row');

        // Changing icon to show group subrows are hidden
        row.querySelector('.collapse-icon').querySelector('i').classList.replace('fa-angle-down', 'fa-angle-right');
    }

    // Showing subrows
    var subRows = document.getElementsByClassName(subRowClass);

    for (const subRow of subRows)
    {
        // Depending on if subgroups are from a group row or subgroup row, selecting the appropriate subrows to display/ hide
        // Group row subrows
        if (isGroup)
        {
            if (subRow.classList.contains('group-subgroup') || subRow.classList.contains('group-add-subgroup') || subRow.classList.contains('group-circle'))
            {
                if (toDisplay)
                {
                    subRow.style.display = 'block';
                }
                else
                {
                    // Hiding subgroup subrows
                    if (subRow.classList.contains('group-subgroup'))
                    {
                        var name;

                        // Getting subgroup name
                        for (const rowClass of subRow.classList)
                        {
                            if (rowClass !== subRowClass && rowClass !== 'group-subgroup' && rowClass !== 'row' && rowClass !== 'hidden-row' && rowClass !== 'collapsed-row')
                            {
                                name = rowClass;
                            }
                        }

                        collapseRows(subRow, subRowClass + ' ' + name, false, false);
                    }

                    subRow.style.display = 'none';
                }
            }
        }   
        // Subgroup row subrows
        else 
        {
            if (subRow.classList.contains('group-subgroup-circle'))
            {
                if (toDisplay)
                {
                    subRow.style.display = 'block';
                }
                else
                {
                    subRow.style.display = 'none';
                }
            }
        }
    }
}

// ------------------------------------------------------------------------------------------

// Colls/ hiding subrows when group row is clicked
function groupRowClick(group)
{
    var row = document.getElementsByClassName('group-row ' + group.replaceAll(' ', '-'))[0];

    row.addEventListener('click', function(event)
    {
        // If group row is hidden, collapse it
        // If it is collapsed, hide it
        if (row.classList.contains('hidden-row'))
        {
            collapseRows(row, group.replaceAll(' ', '-'), true, true);
        }
        else
        {
            collapseRows(row, group.replaceAll(' ', '-'), true, false);
        }
    });
}

// ------------------------------------------------------------------------------------------

// Expanding subrows when group row is clicked
function subgroupRowClick(group, subgroup)
{
    var row = document.getElementsByClassName(group.replaceAll(' ', '-') + ' ' + subgroup.replaceAll(' ', '-') + ' group-subgroup')[0];

    row.addEventListener('click', function()
    {
        // If subgroup row is hidden, collapse it
        // If it is collapsed, hide it
        if (row.classList.contains('hidden-row'))
        {
            collapseRows(row, group.replaceAll(' ', '-') + ' ' + subgroup.replaceAll(' ', '-'), false, true);
        }
        else
        {
            collapseRows(row, group.replaceAll(' ', '-') + ' ' + subgroup.replaceAll(' ', '-'), false, false);
        }

    });
}