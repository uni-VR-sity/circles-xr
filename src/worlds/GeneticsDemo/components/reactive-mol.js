AFRAME.registerComponent('mol-reactor', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentState = "null";

        CONTEXT_AF.attacker = "null";

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            //console.log('Holder has collided with body #' + e.detail.body.id);

            //e.detail.target.el;  // Original entity (holder).
            console.log('Original entity= ' + e.detail.target.el.id);
            //e.detail.body.el;    // Other entity, which (holder) touched.
            console.log('Touched entity= ' + e.detail.body.el.id);

            let isLactose = e.detail.body.el.classList.contains("lactose");

            if (isLactose) {
                console.log("This molecule is hitting lactose!")
            }

        });
    },

});