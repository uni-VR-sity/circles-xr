AFRAME.registerComponent('trigger', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentState = "null";
        CONTEXT_AF.type = "null";

        CONTEXT_AF.attacker = "null";
        CONTEXT_AF.partner;

        CONTEXT_AF.manager = document.querySelector("#dna_model");

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            //console.log('Holder has collided with body #' + e.detail.body.id);

            if (CONTEXT_AF.currentState == "unbound") {
                //console.log('Trigger has collided with body #' + e.detail.body.id);
                //e.detail.target.el;  // Original entity (holder).
                //console.log('Original entity= ' + e.detail.target.el.id);
                //e.detail.body.el;    // Other entity, which (holder) touched.
                //console.log('Touched entity= ' + e.detail.body.el.id);

                CONTEXT_AF.attacker = e.detail.body.el.id;

                if (CONTEXT_AF.attacker == "RNApoly" && e.detail.target.el.id == "repressor_trigger") {
                    CONTEXT_AF.currentState = "binding";
                    //console.log('RepressorTrigger is binding');
                }else if(CONTEXT_AF.attacker == "RNApoly" && e.detail.target.el.id == "lac_trigger"){
                    CONTEXT_AF.currentState = "binding";
                    //console.log('LacTrigger is binding');
                }else if(CONTEXT_AF.attacker == "repressor" && e.detail.target.el.id == "rep_trigger"){
                    CONTEXT_AF.currentState = "binding";
                    //console.log('RepTrigger is binding');
                }

            }

        });

        CONTEXT_AF.el.addEventListener('setState', function(evt){
            CONTEXT_AF.currentState = evt.detail.value;
        });

        CONTEXT_AF.el.addEventListener('blocked', function(evt){
            if(evt.detail.value == 'true'){

                CONTEXT_AF.currentState = 'null';
                //console.log('Repressor Blocking!');

            }else if(evt.detail.value == 'false'){

                CONTEXT_AF.currentState = 'unbound';

            }else{
                //console.log('*Failed to Block*');
            }
            
        });
    },

    tick: function () {
        // setup self references
        const CONTEXT_AF = this;
        
        let test = this.el.getAttribute('id');

        // check if the indicator is running
        if (CONTEXT_AF.currentState == "binding") {
            //console.log('Object Bound to ' + test.detail.id);

            CONTEXT_AF.partner = document.querySelector("#" + CONTEXT_AF.attacker);

            if(test == "repressor_trigger"){
                var mover = document.querySelector("#RNA_moving_rep");
                mover.setAttribute('visible', 'true');
                CONTEXT_AF.partner.setAttribute('visible', 'false');
                CONTEXT_AF.partner.removeAttribute('dynamic-body');
                CONTEXT_AF.currentState = "bound";

                play("#RNA_moving_rep"); //turn on the animation
                setTimeout('pause("#RNA_moving_rep")', 6200); //pause the animation after a delay that is roughly the length of the animation
                setTimeout('setInvisible("#RNA_moving_rep")', 6250); //make invisible to show that it has finished

                setTimeout(() => { setDynamicLocation(CONTEXT_AF.attacker, { x: -1.5, y: 1.85, z: -5.95 }, { x: 90, y: 70, z: 0 }); }, 6255);
                setTimeout(() => { CONTEXT_AF.manager.emit('mol_spawn', {value : 'mRNA-rep', pos : { x: -1.5, y: 2, z: -5.95 }, rot : 'null'}); }, 6255);
                setTimeout(() => { CONTEXT_AF.partner.setAttribute('visible', 'true'); }, 6260);

                setTimeout('play("#RNA_moving_rep")', 6300); //make sure the animation cycles back to the start of the loop
                setTimeout('pause("#RNA_moving_rep")', 6450);

                setTimeout(() => { CONTEXT_AF.currentState = 'unbound'; }, 6600); //Reset the current state so that the trigger is available again
                
            }else if(test == "lac_trigger"){
                var mover = document.querySelector("#RNA_moving_lac");
                mover.setAttribute('visible', 'true');
                CONTEXT_AF.partner.setAttribute('visible', 'false');
                CONTEXT_AF.partner.removeAttribute('dynamic-body');
                CONTEXT_AF.currentState = "bound";

                play("#RNA_moving_lac"); //turn on the animation
                setTimeout('pause("#RNA_moving_lac")', 16700); //pause the animation after a delay that is roughly the length of the animation
                setTimeout('setInvisible("#RNA_moving_lac")', 16750); //make invisible to show that it has finished

                setTimeout(() => { setDynamicLocation(CONTEXT_AF.attacker, { x: 1.65, y: 1.55, z: -5.3 }, { x: 90, y: 70, z: 0 }); }, 16755);
                setTimeout(() => { CONTEXT_AF.manager.emit('mol_spawn', {value : 'mRNA-lac', pos : { x: 1.65, y: 1.55, z: -5.3 }, rot : 'null'}); }, 16755);
                setTimeout(() => { CONTEXT_AF.partner.setAttribute('visible', 'true'); }, 16760);

                setTimeout('play("#RNA_moving_lac")', 16800); //make sure the animation cycles back to the start of the loop
                setTimeout('pause("#RNA_moving_lac")', 16975);

                setTimeout(() => { CONTEXT_AF.currentState = 'unbound'; }, 17100); //Reset the current state so that the trigger is available again
                

            }else if(test == "rep_trigger"){
                CONTEXT_AF.partner.removeAttribute('dynamic-body');

                CONTEXT_AF.partner.setAttribute('position', { x: -0.293, y: 0.709, z: -6.853 });
                CONTEXT_AF.partner.setAttribute('rotation', { x: -8.56, y: -10.6, z: -37.09 });

                CONTEXT_AF.partner.classList.remove("interactive");

                var blocker =  document.querySelector("#lac_trigger");
                blocker.emit('blocked', {value : 'true'});
                CONTEXT_AF.currentState = "bound";
            }

        }
    },

});