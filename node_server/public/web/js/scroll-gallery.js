'use strict';

// Global Variables --------------------------------------------------------------------------------------------------------------------------------
var galleries = [];
var galleryPages = [];
var currentPage = [];
var totalPages = [];
var contentPerPage = [];

// -------------------------------------------------------------------------------------------------------------------------------------------------

// Setting up gallery
function setUpScrollGallery(galleryContent, numPerPage, galleryContainerID)
{
    // Parsing gallery content
    galleryContent = JSON.parse(galleryContent);

    // Storing gallery and getting its ID (for allowing multiple galleries on a page)
    galleries.push(galleryContainerID);
    var galleryID = galleries.indexOf(galleryContainerID);

    // Storing content per page
    contentPerPage[galleryID] = numPerPage;

    // Calculating number of pages
    totalPages[galleryID] = Math.ceil(galleryContent.length / contentPerPage[galleryID]);

    // Creating page indicators
    createScrollGalleryPageIndicators(galleryContainerID);

    // Dividing content into pages
    var pages = [];

    for (var i = 0; i < totalPages[galleryID]; i++)
    {
        var page = [];

        for (var j = 0; j < contentPerPage[galleryID]; j++)
        {
            var contentIdx = (i * contentPerPage[galleryID]) + j;

            if (galleryContent[contentIdx])
            {
                page.push(galleryContent[contentIdx]);
            }
            else
            {
                page.push(null);
            }
        }

        pages.push(page);
    }

    galleryPages[galleryID] = pages;

    // Showing first page
    currentPage[galleryID] = 0;
    showCurrentScrollGalleryPage(galleryContainerID);
}

// ------------------------------------------------------------------------------------------

// Creating scroll gallery page indicators
function createScrollGalleryPageIndicators(galleryContainerID)
{
    // Getting gallery ID
    var galleryID = galleries.indexOf(galleryContainerID);

    // Getting gallery container
    var galleryContainer = document.getElementById(galleryContainerID).parentElement;

    // Creating page indicator container
    var indicatorContainer = document.createElement('div');
    indicatorContainer.classList.add('gallery-page-indicator-container');
    
        // Creating page indicators
        for (var i = 0; i < totalPages[galleryID]; i++)
        {
            var indicator = document.createElement('div');
            indicator.classList.add('page-indicator');
            indicator.id = 'page-' + i;

                var iconContainer = document.createElement('div');
                iconContainer.classList.add('icon-container');

                    var icon = document.createElement('i');
                    icon.classList.add('fa-regular');
                    icon.classList.add('fa-circle');

                    iconContainer.appendChild(icon);

                indicator.appendChild(iconContainer);

            indicatorContainer.appendChild(indicator);
        }

    galleryContainer.appendChild(indicatorContainer);
}

// ------------------------------------------------------------------------------------------

// Showing current page of gallery
function showCurrentScrollGalleryPage(galleryContainerID)
{
    // Getting gallery ID
    var galleryID = galleries.indexOf(galleryContainerID);

    // Getting gallery items
    var galleryItems = document.getElementById(galleryContainerID).querySelectorAll('.scroll-gallery-item');

    // Getting contents of current page
    var currentPageContents = galleryPages[galleryID][currentPage[galleryID]];

    // Replacing gallery items with content from current page
    for (var i = 0; i < contentPerPage[galleryID]; i++)
    {
        if (currentPageContents[i])
        {
            galleryItems[i].style.visibility = 'visible';

            galleryItems[i].querySelector('.gallery-item-image').src = currentPageContents[i].photo;
            galleryItems[i].querySelector('.gallery-item-image').alt = 'Image of ' + currentPageContents[i].name;
            galleryItems[i].querySelector('.gallery-item-name').innerHTML = currentPageContents[i].name;

            if (currentPageContents[i].secondaryInfo && galleryItems[i].querySelector('.gallery-item-secondary-info'))
            {
                galleryItems[i].querySelector('.gallery-item-secondary-info').innerHTML = currentPageContents[i].secondaryInfo;
            }
        }
        else
        {
            galleryItems[i].style.visibility = 'hidden';
        }
    }

    // Changing page indicator
    var indicatorContainer = document.getElementById(galleryContainerID).parentElement.querySelector('.gallery-page-indicator-container');

    // Removing previous page indicator
    var previousIndicator = indicatorContainer.querySelector('.fa-solid');

    if (previousIndicator)
    {
        previousIndicator.classList.replace('fa-solid', 'fa-regular');
    }

    // Adding indication to current page indicator
    indicatorContainer.querySelector('#page-' + currentPage[galleryID]).querySelector('i').classList.replace('fa-regular', 'fa-solid');
}

// ------------------------------------------------------------------------------------------

// Changing to previous (direction = -1) or next page (direction = 1)
function changeScrollGalleryPage(galleryContainerID, direction)
{
    // Getting gallery ID
    var galleryID = galleries.indexOf(galleryContainerID);

    // Changing current page
    currentPage[galleryID] += direction;

    // Making sure current page is within range
    if (currentPage[galleryID] < 0)
    {
        currentPage[galleryID] = totalPages[galleryID] - 1;
    }
    else if (currentPage[galleryID] > totalPages[galleryID] - 1)
    {
        currentPage[galleryID] = 0;
    }

    // Showing new page
    showCurrentScrollGalleryPage(galleryContainerID);
}