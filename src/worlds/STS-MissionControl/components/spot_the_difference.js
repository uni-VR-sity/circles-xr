// Component for task 8 for mission control
// Choose which image will be the odd one out
// When user selects the odd one out, task complete

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('spot_the_difference', 
{
    schema: 
    {
        // If the odd one out was succesfully selected
        isSelected : {type: 'boolean', default:false},

        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        var canClick = true;

        // Getting the image holders
        var imageHolders = document.querySelector('#images').children;
        var numImages = imageHolders.length;

        // Selecting an image number to be the wrong image
        // Formula for generating a random numnber between a min and max from https://www.w3schools.com/js/js_random.asp
        var wrongImageNum = Math.floor(Math.random() * (numImages - 1) ) + 1;

        // Displaying images to users in mission control
        var imageId = 'correct'
        var correctImageIdx = 1;

        for (let i = 0; i < numImages; i++)
        {
            if (i + 1 === wrongImageNum)
            {
                imageHolders[i].setAttribute('material', {src: '#wrong'});

                // Putting an event listener on to highlight green when clicked to indicate correct selection
                imageHolders[i].addEventListener('click', function() 
                {
                    // If the previous task is complete
                    // And if task has not been completed
                    // Users can only click on an image every second
                    if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isSelected === false && canClick === true)
                    {
                        imageHolders[i].setAttribute('material', {color: '#00FF00'});

                        CONTEXT_AF.data.isSelected = true;
                    }
                });
            }
            else
            {
                var currentId = '#' + imageId + correctImageIdx;

                imageHolders[i].setAttribute('material', {src: currentId});

                correctImageIdx += 1;

                // Putting an event listener on to highlight red when clicked to indicate incorrect selection
                imageHolders[i].addEventListener('click', function() 
                {
                    // If the previous task is complete
                    // And if task has not been completed
                    // Users can only click on an image every second
                    if (CONTEXT_AF.data.isPrevComplete === true && CONTEXT_AF.data.isSelected === false && canClick === true)
                    {
                        imageHolders[i].setAttribute('material', {color: '#FF0000'});

                        canClick = false;

                        setTimeout(function() 
                        {
                            imageHolders[i].setAttribute('material', {color: '#FFFFFF'});

                            canClick = true;

                        }, 1000);
                    }
                });
            }
        }
    }
}); 