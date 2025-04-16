// Component for task 9 for mission control
// Generates a random rotation for sun alignment

'user strict'

// Component ---------------------------------------------------------------------------------------------------------------

AFRAME.registerComponent('sun_alignment', 
{
    schema: 
    {
        // If the previous task is complete
        isPrevComplete : {type: 'boolean', default:false},
    },

    init : function() 
    {
        const CONTEXT_AF = this;

        const element = CONTEXT_AF.el;

        // Get a random alignment rotation (between -10 and -349)
        // Formula for generating a random numnber between a min and max from https://www.w3schools.com/js/js_random.asp
        CONTEXT_AF.data.alignmentRotation = Math.floor(Math.random() * (-10 + 349) ) - 349;

        // Indicating to the users in mission control where the alignment is
        document.querySelector('#alignmentContainer').setAttribute('rotation', {y: CONTEXT_AF.data.alignmentRotation});
    }
});