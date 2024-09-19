AFRAME.registerComponent('trigger', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentState = "unbound";
        CONTEXT_AF.type = "null";

        CONTEXT_AF.attacker = "null";

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            //console.log('Holder has collided with body #' + e.detail.body.id);

            if (CONTEXT_AF.currentState == "unbound") {
                console.log('Trigger has collided with body #' + e.detail.body.id);
                e.detail.target.el;  // Original entity (holder).
                console.log('Original entity= ' + e.detail.target.el.id);
                e.detail.body.el;    // Other entity, which (holder) touched.
                console.log('Touched entity= ' + e.detail.body.el.id);

                attacker = e.detail.body.el.id;

                if (attacker == "RNApoly" && e.detail.target.el.id == "repressor_trigger") {
                    CONTEXT_AF.currentState = "binding";
                    console.log('Trigger is binding');
                }else if(attacker == "RNApoly" && e.detail.target.el.id == "lac_trigger"){
                    CONTEXT_AF.currentState = "binding";
                    console.log('Trigger is binding');
                }
            }

        });
    },

    tick: function () {
        // setup self references
        const CONTEXT_AF = this;
        var partner;

        let test = this.el.getAttribute('id');

        // check if the indicator is running
        if (CONTEXT_AF.currentState == "binding") {
            console.log('Object Bound to ' + test);

            partner = document.querySelector("#" + attacker);

            if(test == "repressor_trigger"){
                var mover = document.querySelector("#RNA_moving_rep");
                mover.setAttribute('visible', 'true');
                partner.setAttribute('visible', 'false');
                CONTEXT_AF.currentState = "bound";

                play("#RNA_moving_rep"); //turn on the animation
                setTimeout('pause("#RNA_moving_rep")', 6200); //pause the animation after a delay that is roughly the length of the animation
                setTimeout('setInvisible("#RNA_moving_rep")', 6250); //make invisible to show that it has finished

                //setTimeout(() => { partner.setAttribute('position', { x: -0.7, y: 1.65, z: -0.7 }).syncToPhysics(); }, 6255);
                setTimeout(() => { setDynamicPosition(attacker, { x: -0.7, y: 1.65, z: -0.7 }); }, 6255);
                setTimeout(() => { partner.setAttribute('visible', 'true'); }, 6260);

                setTimeout('play("#RNA_moving_rep")', 6300); //make sure the animation cycles back to the start of the loop
                setTimeout('pause("#RNA_moving_rep")', 6450);

                setTimeout(() => { CONTEXT_AF.currentState = 'unbound'; }, 6600); //Reset the current state so that the trigger is available again
                
            }else if(test == "lac_trigger"){
                var mover = document.querySelector("#RNA_moving_lac");
                mover.setAttribute('visible', 'true');
                CONTEXT_AF.currentState = "bound";

                play("#RNA_moving_lac"); //turn on the animation
                setTimeout('pause("#RNA_moving_lac")', 16700); //pause the animation after a delay that is roughly the length of the animation
                setTimeout('setInvisible("#RNA_moving_lac")', 16750); //make invisible to show that it has finished
                setTimeout('play("#RNA_moving_lac")', 16800); //make sure the animation cycles back to the start of the loop
                setTimeout('pause("#RNA_moving_lac")', 16975);

                setTimeout(() => { CONTEXT_AF.currentState = 'unbound'; }, 17100); //Reset the current state so that the trigger is available again

            }

            console.log('Trigger is bound');
        }
    },

});