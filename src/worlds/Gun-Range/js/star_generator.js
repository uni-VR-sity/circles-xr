// Generates stars for the room ceiling

'user strict'

// Returning a random number for the x value for the star between -11 and 11
// (Given range is to stay within the room walls)
randomX = function()
{
    return (Math.random() * (11 - (-11)) - 11);
}

/***************************************************************************************************************************************************************************/

// Returning a random number for the y value for the star between 8 and 9.5
// (For stars to have varying heights)
randomY = function()
{
    return (Math.random() * (9.5 - (8)) + 8);
}

/***************************************************************************************************************************************************************************/

// Returning a random number for the z value for the star between -6 and 6
// (Given range is to stay within the room walls)
randomZ = function()
{
    return (Math.random() * (6 - (-6)) - 6);
}

/***************************************************************************************************************************************************************************/

// Returning a random number for the radius value for the star between 0.01 and 0.1
// (For stars to have varying sizes)
randomRad = function()
{
    return (Math.random() * (0.1 - (0.01)) + 0.01); 
}

/***************************************************************************************************************************************************************************/

// Component
AFRAME.registerComponent('star_generator', 
{
    init : function() 
    {
        // Container that hold the star elements
        const starContainer = document.querySelector('#stars');
        
        // Generating 200 stars
        for (let i = 0; i < 200; i++) 
        {
            // Creating a star element
            const star = document.createElement('a-entity');

            // Setting the star's attributes
            star.setAttribute('geometry', {
                primitive: 'sphere',
                radius: randomRad()     
            }); 

            star.setAttribute('material', {
                emissive: '#fefe86',
                emissiveIntensity: 1
            });

            star.setAttribute('position', {
                x: randomX(), 
                y: randomY(),
                z: randomZ()
            });
            
            // Appending the star to the star container
            starContainer.appendChild(star);
        }
    }
});