'use strict';

// News --------------------------------------------------------------------------------------------------------------------------------------------

// Displaying news articles from selected year
function displayNewsYear(year)
{
    // Hiding currently visible articles
    var previouslyDisplayed = document.getElementsByClassName('visible-article');

    while (previouslyDisplayed.length > 0)
    {
        previouslyDisplayed[0].classList.add('hidden-article');
        previouslyDisplayed[0].classList.remove('visible-article');
    }

    // Hiding currently selected year button
    var previousYearButton = document.getElementsByClassName('selected-news-year')[0];

    if (previousYearButton)
    {
        previousYearButton.classList.remove('selected-news-year');
    }

    // Displaying articles from selected year
    var selectedArticles = document.getElementsByClassName('news-year-' + year);

    for (const article of selectedArticles)
    {
        article.classList.add('visible-article');
        article.classList.remove('hidden-article');
    }

    // Highlighting button for selected year
    document.getElementsByClassName(year + '-news-button')[0].classList.add('selected-news-year');
}