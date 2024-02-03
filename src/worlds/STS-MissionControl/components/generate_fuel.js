// Component for task 5 for mission control
// Generates a random fuel position/ percent for the task

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('generate_fuel', 
{
    schema: 
    {
        // Ideal fuel percent
        idealFuel : {type: 'int', default:50},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Get a random fuel percent (between 20% and 100%)
        // Formula for generating a random numnber between a min and max from https://www.w3schools.com/js/js_random.asp
        CONTEXT_AF.data.idealFuel = Math.floor(Math.random() * (100 - 20) ) + 20;

        // Creating bar object to show where the fuel percent is to the users in mission control

        // Getting fuel tank, its height, and its width
        var tankHeight = element.getAttribute('geometry')['height'];
        var tankWidth = element.getAttribute('geometry')['width'];

        // Calculating the position of the bar on the screen depending on the fuel percent
        // Position is between -(tankHeight / 2) and (tankHeight / 2)
        var decimal =  CONTEXT_AF.data.idealFuel / 100;

        var percentOfScreen = decimal * tankHeight;

        var barPos = -(tankHeight / 2) + percentOfScreen;
        
        // Creating bar object
        var bar = document.createElement('a-entity');

        bar.setAttribute('position', {
            x: 0,
            y: barPos,
            z: 0.03
        });

        bar.setAttribute('geometry', {
            primitive: 'plane',
            height: 0.05,
            width: tankWidth
        });

        bar.setAttribute('material', {
            color: '#000000'
        });

        element.appendChild(bar);
    }
});