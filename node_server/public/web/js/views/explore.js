'use strict';

// Global Variables --------------------------------------------------------------------------------------------------------------------------------
var magicCircles;
var publicCircles;
var yourCircles;
var editableCircles;
var allCircles;

var currentSection;
var currentCircles;
var currentGroup;
var currentSubgroup;

// Session Name Form -------------------------------------------------------------------------------------------------------------------------------

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

// Updating session name through form
function updateSessionName(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Hiding if there are any success or error messages up
    var successMessage = document.getElementById('session-name-form').querySelector('.success-message');
    successMessage.style.display = 'none';

    var errorMessage = document.getElementById('session-name-form').querySelector('.error-message');
    errorMessage.style.display = 'none';

    // Getting form data
    var formData = new FormData(event.target);

    // Checking that the session name don't contain ', ", or -
    if (validInput(formData.get('sessionName')))
    {
        // Sending data to update session name
        var request = new XMLHttpRequest();
        request.open('POST', '/update-session-display-name');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onload = function() 
        {
            var response = JSON.parse(request.response);

            if (response === 'updated')
            {
                successMessage.style.display = 'flex';
                successMessage.innerHTML = 'Display name successfully changed for the session';
            }
            else
            {
                errorMessage.style.display = 'flex';
                errorMessage.innerHTML = "Display name must contain text and can not start with a space (' ')";
            }
        }

        request.send('sessionName='+ formData.get('sessionName'));
    }
    else
    {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Display name contains invalid characters (' + "'" + ', ", -)';
    }
}

// Circle Tabs -------------------------------------------------------------------------------------------------------------------------------------

// Fixing css depending on device and number of tabs visible
function styleTabs(adminUser, managerUser, standardUser, magicGuest)
{
    var tabsContainer = document.getElementById('circles-tabs');

    // If on computer
    //if (window.innerWidth >= 950)

    // Admin or manager user
    if (adminUser || managerUser)
    {
        tabsContainer.style.gridTemplateAreas = '"all-circles public-circles your-circles editable-circles"';
    }
    // Standard user
    else if (standardUser)
    {
        tabsContainer.style.gridTemplateAreas = '"all-circles public-circles your-circles"';
    }
    // Magic guest
    else if (magicGuest)
    {
        tabsContainer.style.gridTemplateAreas = '"magic-circles public-circles"';
    }
    // Guest
    else
    {
        tabsContainer.style.gridTemplateAreas = '"public-circles"';
    }

    // If on tablet or computer
    /*
    else
    {
        // Admin or manager user
        if (adminUser || managerUser)
        {
            tabsContainer.style.gridTemplateAreas = '"all-circles mobile-tabs-icon" "public-circles mobile-tabs-icon" "your-circles mobile-tabs-icon" "editable-circles mobile-tabs-icon"';
        }
        // Standard user
        else if (standardUser)
        {
            tabsContainer.style.gridTemplateAreas = '"all-circles mobile-tabs-icon" "public-circles mobile-tabs-icon" "your-circles mobile-tabs-icon"';
        }
        // Magic guest
        else if (magicGuest)
        {
            tabsContainer.style.gridTemplateAreas = '"magic-circles mobile-tabs-icon" "all-circles mobile-tabs-icon" "public-circles mobile-tabs-icon"';
        }
        // Guest
        else
        {
            tabsContainer.style.gridTemplateAreas = '"all-circles mobile-tabs-icon" "public-circles mobile-tabs-icon"';
        }
    }
    */
}

// Displaying Circles ------------------------------------------------------------------------------------------------------------------------------

// Getting circles in each section
function initializeCircleSection(circles, section)
{
    switch(section)
    {
        case 'magic':
            magicCircles = JSON.parse(circles);
            break;

        case 'public':
            publicCircles = JSON.parse(circles);
            break;

        case 'your':
            yourCircles = JSON.parse(circles);
            break;

        case 'editable':
            editableCircles = JSON.parse(circles);
            break;
    }
}

// ------------------------------------------------------------------------------------------

// Organizing cirles in the "all" section (combining public and your circles)
function initializeAllCircleSection()
{
    // Adding publicCircles to section
    allCircles = JSON.parse(JSON.stringify(publicCircles));

    // Going through groups in yourCircles
    for (const group of yourCircles.groups)
    {
        // Checking if group already exists in allCircles
        // If it does, adding circles to it
        // If it doesn't, adding group
        var exitingGroup = allCircles.groups.find(x => x.name === group.name);

        if (exitingGroup)
        {
            var groupIndex = allCircles.groups.indexOf(exitingGroup);

            // Going through subgroups in the group
            for (const existingSubgroup of allCircles.groups[groupIndex].subgroups)
            {
                // Checking if yourCircles has circles in this subgroup
                // If it does, adding them
                var toAddSubgroup = group.subgroups.find(x => x.name === existingSubgroup.name);

                if (toAddSubgroup.circles.length > 0)
                {
                    for (const circle of toAddSubgroup.circles)
                    {
                        existingSubgroup.circles.push(circle);
                    }
                }
            }

            // If yourCircles has circles that are not in a subgroup, adding them
            if (group.noGroup.length > 0)
            {
                for (const circle of group.noGroup)
                {
                    allCircles.groups[groupIndex].noGroup.push(circle);
                }
            }
        }
        else
        {
            allCircles.groups.push(group);
        }
    }

    // If yourCircles has circles that are not in a group, adding them
    if (yourCircles.noGroup.length > 0)
    {
        for (const circle of yourCircles.noGroup)
        {
            allCircles.noGroup.push(circle);
        }
    }
}

// ------------------------------------------------------------------------------------------

// Getting current circles (in selected section, group, and subgroup)
function getCurrentCircles()
{
    currentCircles = [];

    function getCircles(group)
    {
        for (const circle of group)
        {
            currentCircles.push(circle);
        }
    }

    // If 'All' group is selected, displaying all circles
    // Otherwise displaying circles in specified group
    if (currentGroup === 'All')
    {
        // Circles with no group
        getCircles(currentSection.noGroup);

        // Circles with group
        for (const group of currentSection.groups)
        {
            // Circles with no subgroup
            getCircles(group.noGroup);

            // Circles with subgroup
            for (const subgroup of group.subgroups)
            {
                getCircles(subgroup.circles);
            }
        }
    }
    else
    {
        // Getting current group
        var group = currentSection.groups.find(x => x.name === currentGroup);

        // If 'All' subgroup is selected, displaying all circles in group
        // Otherwise displaying circles in specified subgroup
        if (currentSubgroup === 'All')
        {
            // Circles with no subgroup
            getCircles(group.noGroup);

            // Circles with subgroup
            for (const subgroup of group.subgroups)
            {
                getCircles(subgroup.circles);
            }
        }
        else
        {
            // Getting current subgroup
            var subgroup = group.subgroups.find(x => x.name === currentSubgroup);

            getCircles(subgroup.circles);
        }
    }
}

// ------------------------------------------------------------------------------------------

// Displaying current circles
function displayCircles()
{
    var noCirclesMessage = document.getElementById('no-circles-message');

    // Hiding currently displayed circles
    var previouslyDisplayed = document.getElementsByClassName('displayed-circle');

    while (previouslyDisplayed.length > 0)
    {
        previouslyDisplayed[0].classList.add('hidden-circle');
        previouslyDisplayed[0].classList.remove('displayed-circle');
    }

    // If there are circles to display, displaying current circles
    // Otherwise displaying no circles message 
    if (currentCircles.length > 0)
    {
        noCirclesMessage.style.display = 'none';

        // Displaying current circles
        for (const circle of currentCircles)
        {
            document.getElementById(circle.name).classList.remove('hidden-circle');
            document.getElementById(circle.name).classList.add('displayed-circle');
        }
    }
    else
    {
        noCirclesMessage.style.display = 'block';
    }
}

// ------------------------------------------------------------------------------------------

// Displaying circles in selected group
function displayCirclesInGroup(selectedGroup)
{
    currentGroup = selectedGroup;
    currentSubgroup = 'All';

    // If "All" group selected, hiding subgroup selector
    // Otherwise setting up subgroup selector
    var subgroupSelector = document.getElementById('circles-subgroup-selector');

    if (selectedGroup === 'All')
    {
        subgroupSelector.style.display = 'none';
    }
    else
    {
        // Getting group infromation
        var group = currentSection.groups.find(x => x.name === selectedGroup);

        if (group.subgroups.length > 0)
        {
            subgroupSelector.style.display = 'inline-block';

            // Removing current subgroups
            while (subgroupSelector.firstChild) 
            {
                subgroupSelector.removeChild(subgroupSelector.firstChild);
            }

            var allOption = document.createElement('option');
            allOption.setAttribute('value', 'All');
            allOption.setAttribute('selected', 'selected');
            allOption.innerHTML = 'All';
            subgroupSelector.appendChild(allOption);

            for (const subgroup of group.subgroups)
            {
                var option = document.createElement('option');
                option.setAttribute('value', subgroup.name);
                option.innerHTML = subgroup.name;
                subgroupSelector.appendChild(option);
            }
        }
        else
        {
            subgroupSelector.style.display = 'none';
        }
    }

    getCurrentCircles();
    displayCircles();
}

// ------------------------------------------------------------------------------------------

// Displaying circles in selected subgroup
function displayCirclesInSubgroup(selectedSubgroup)
{
    currentSubgroup = selectedSubgroup;

    getCurrentCircles();
    displayCircles();
}

// ------------------------------------------------------------------------------------------

// Detecting what group and subgroup is selected to display appropriate circles
function detectGroupSelect()
{
    // Getting group selection element
    var groupSelector = document.getElementById('circles-group-selector');

    // Putting event listener to detect when a new group is selected
    groupSelector.addEventListener('change', function(event)
    {
        displayCirclesInGroup(event.target.value);
    });

    // Getting subgroup selection element
    var subgroupSelector = document.getElementById('circles-subgroup-selector');

    // Putting event listener to detect when a new group is selected
    subgroupSelector.addEventListener('change', function(event)
    {
        displayCirclesInSubgroup(event.target.value);
    });
}

// ------------------------------------------------------------------------------------------

// Highlighting selected tab
function highlightCirclesTab(tab)
{
    // Removing highlight from other tab
    var previouslySelected = document.getElementsByClassName('selected-tab')[0];

    if (previouslySelected)
    {
        previouslySelected.classList.remove('selected-tab');
    }

    // Highlighting specified tab
    document.getElementById(tab).classList.add('selected-tab');
}

// ------------------------------------------------------------------------------------------

// Setting up group selector for currentSection
function setUpCircleGroup()
{
    // Getting group selection element
    var groupSelector = document.getElementById('circles-group-selector');

    // Removing current groups
    while (groupSelector.firstChild) 
    {
        groupSelector.removeChild(groupSelector.firstChild);
    }

    // Adding groups in currentSection
    var allOption = document.createElement('option');
    allOption.setAttribute('value', 'All');
    allOption.setAttribute('selected', 'selected');
    allOption.innerHTML = 'All';
    groupSelector.appendChild(allOption);

    if (currentSection.groups.length > 0)
    {
        for (const group of currentSection.groups)
        {
            var option = document.createElement('option');
            option.setAttribute('value', group.name);
            option.innerHTML = group.name;
            groupSelector.appendChild(option);
        }
    }

    // Hiding subgroup selector as by default "all" is selected
    var subgroupSelector = document.getElementById('circles-subgroup-selector');
    subgroupSelector.style.display = 'none';
}

// ------------------------------------------------------------------------------------------

// Displaying circles in specified section
function displaySection(section)
{
    // Hiding or showing manage groups icon (editable section groups can't be edited)
    function hideIcon(hide)
    {
        var icon = document.getElementById('manage-groups-button');

        if (icon)
        {
            if (hide)
            {
                icon.style.display = 'none';
            }
            else
            {
                icon.style.display = 'block';
            }
        }
    }

    // Getting circles in selected tab 
    switch(section)
    {
        case 'magic':
            currentSection = magicCircles;
            break;

        case 'all':
            currentSection = allCircles;
            hideIcon(false);
            break;

        case 'public':
            currentSection = publicCircles;
            hideIcon(false);
            break;

        case 'your':
            currentSection = yourCircles;
            hideIcon(false);
            break;

        case 'editable':
            currentSection = editableCircles;
            hideIcon(true);
            break;
    }

    // Highlighting selected tab
    highlightCirclesTab(section + '-circles');

    // Setting up group selector for tab
    setUpCircleGroup();

    // Displaying circles ("All" group by default)
    displayCirclesInGroup('All');
}

// ------------------------------------------------------------------------------------------

// Circles search bar functionality
function circlesSearchBar()
{
    var searchBar = document.getElementById('circles-search-bar').querySelector('.search-bar');

    searchBar.addEventListener('keyup', function(event)
    {
        console.log(searchBar.value);
    });
}

// Magic Links -------------------------------------------------------------------------------------------------------------------------------------

// Creating magic link through form
function createMagicLink(event)
{
    // Preventing page refresh
    event.preventDefault(); 

    // Getting form data
    var formData = new FormData(event.target);

    // Hiding if there are any magic links, or success or error messages up
    var successMessage = document.getElementById('create-link').querySelector('.success-message');
    successMessage.style.display = 'none';

    var errorMessage = document.getElementById('create-link').querySelector('.error-message');
    errorMessage.style.display = 'none';

    var copyForm = document.getElementById('create-link').querySelector('.copy-magic-link');
    copyForm.style.display = 'none';

    // Checking that at least one circle is selected
    // If there is not, displaying an error
    if (formData.getAll('magicCircle').length === 0)
    {
        errorMessage.style.display = 'flex';
        errorMessage.innerHTML = 'No circles selected';
    }
    else
    {
        // If custom date selected, checking that a custom date was entered
        // Otherwise displaying an error
        if (formData.get('linkExpiry') === 'custom' && formData.get('customLinkExpiry') === '')
        {
            errorMessage.style.display = 'flex';
            errorMessage.innerHTML = 'No date for custom expiration selected';
        }
        else
        {
            // Checking that link name does not contain spaces
            if (formData.get('forwardingName').includes(' '))
            {
                errorMessage.style.display = 'flex';
                errorMessage.innerHTML = 'Link name can not contain spaces (" ")';
            }
            else 
            {

                // Sending data to update session name
                var request = new XMLHttpRequest();
                request.open('POST', '/create-magic-link');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                request.onload = function() 
                {
                    var response = JSON.parse(request.response);

                    if (response === 'error')
                    {
                        errorMessage.style.display = 'flex';
                        errorMessage.innerHTML = 'Something went wrong, please try again';
                    }
                    else if (response === 'forwarding name exists')
                    {
                        errorMessage.style.display = 'flex';
                        errorMessage.innerHTML = '"' + formData.get('forwardingName') + '" link name is already being used, please enter a new name';
                    }
                    else
                    {
                        successMessage.style.display = 'flex';
                        successMessage.innerHTML = 'Magic link successfully made for the following circle(s): ';

                        for (const circle of response.circles)
                        {
                            successMessage.innerHTML += circle + ', ';
                        }

                        successMessage.innerHTML = successMessage.innerHTML.slice(0, -2);

                        copyForm.style.display = 'block';
                        copyForm.querySelector('.copy-link-input').setAttribute('value', response.forwardingLink);

                        // Clearing form
                        var form = document.getElementById('magic-link-form');
                        form.reset();
                    }
                }

                var dataString = 'linkExpiry=' + formData.get('linkExpiry');
                dataString += '&customLinkExpiry=' + formData.get('customLinkExpiry');
                dataString += '&forwardingName=' + formData.get('forwardingName');

                for (const circle of formData.getAll('magicCircle'))
                {
                    dataString += '&magicCircle=' + circle;
                }

                request.send(dataString);
            }
        }
    }
}