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
                CONTEXT_AF.partner = e.detail.body.el;
                var mover_rep = 'null';
                var mover_lac = 'null';

                if (e.detail.body.el.classList.contains("RNApoly") && e.detail.target.el.id == "repressor_trigger") {
                    CONTEXT_AF.currentState = "binding";
                    mover_rep = document.querySelector("#RNA_moving_rep");
                    //console.log('RepressorTrigger is binding');
                }else if(e.detail.body.el.classList.contains("RNApoly") && e.detail.target.el.id == "lac_trigger"){
                    CONTEXT_AF.currentState = "binding";
                    mover_lac = document.querySelector("#RNA_moving_lac");
                    //console.log('LacTrigger is binding');
                }else if(e.detail.body.el.classList.contains("repressor") && e.detail.target.el.id == "rep_trigger"){
                    CONTEXT_AF.currentState = "binding";
                    //CONTEXT_AF.el.emit('repressor_flag');
                    //console.log('RepTrigger is binding');

                    if(CONTEXT_AF.type == "null"){

                    }
                }else if(e.detail.body.el.classList.contains("CRP_final") && e.detail.target.el.id == "capSite_trigger"){
                    CONTEXT_AF.currentState = "binding";
                    console.log('capSite Trigger is binding');
                }

                if(mover_rep != 'null' && CONTEXT_AF.type == "null"){
                    mover_rep.addEventListener('animation-loop', function(){
                        console.log('Finished rep animation!');
                        pause("#RNA_moving_rep"); //turn off the animation
            
                        setDynamicLocation(CONTEXT_AF.attacker, { x: -1.5, y: 1.85, z: -5.95 }, { x: 90, y: 70, z: 0 });
                        CONTEXT_AF.manager.emit('mol_spawn', {value : 'mRNA-rep', pos : { x: -1.5, y: 2, z: -5.95 }, rot : 'null'});
                        CONTEXT_AF.partner.setAttribute('visible', 'true');
            
                        setTimeout(() => { CONTEXT_AF.currentState = 'unbound'; }, 1000); //Reset the current state so that the trigger is available again
                    });
                    console.log('Rep eventListener set');
                    CONTEXT_AF.type = 'rep';
                }

                if(mover_lac != 'null' && CONTEXT_AF.type == "null"){
                    mover_lac.addEventListener('animation-loop', function(){
                        console.log('Finished lac animation!');
                        pause("#RNA_moving_lac"); //turn off the animation

                        var tempRep = document.querySelector("#rep_trigger");
                        tempRep.setAttribute('circles-interactive-object', { enabled: 'false'});
                        var tempCap = document.querySelector("#capSite_trigger");
                        tempCap.setAttribute('circles-interactive-object', { enabled: 'false'});
    
                        setDynamicLocation(CONTEXT_AF.attacker, { x: 1.65, y: 1.55, z: -5.3 }, { x: 90, y: 70, z: 0 });
                        CONTEXT_AF.manager.emit('mol_spawn', {value : 'mRNA-lac', pos : { x: 1.65, y: 1.55, z: -5.3 }, rot : 'null'});
                        CONTEXT_AF.partner.setAttribute('visible', 'true');
    
                        setTimeout(() => { CONTEXT_AF.currentState = 'unbound'; }, 1000); //Reset the current state so that the trigger is available again
                    });
                    console.log('Lac eventListener set');
                    CONTEXT_AF.type = 'lac';
                }

            }

        });

        CONTEXT_AF.el.addEventListener('setState', function(evt){
            CONTEXT_AF.currentState = evt.detail.value;

            if(CONTEXT_AF.el.id == 'repressor_trigger' || CONTEXT_AF.el.id == 'lac_trigger'){
                CONTEXT_AF.el.setAttribute('circles-interactive-object', { enabled: 'true'});
            }
            //CONTEXT_AF.el.setAttribute('circles-interactive-object', { enabled: 'true'});
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

            if(test == "repressor_trigger"){
                var mover = document.querySelector("#RNA_moving_rep");
                mover.setAttribute('visible', 'true');
                CONTEXT_AF.partner.setAttribute('visible', 'false');
                CONTEXT_AF.el.setAttribute('circles-interactive-object', { enabled: 'false'});
                CONTEXT_AF.partner.removeAttribute('dynamic-body');
                CONTEXT_AF.currentState = "bound";

                play("#RNA_moving_rep"); //turn on the animation
                CONTEXT_AF.el.emit('rep_flag');
                
            }else if(test == "lac_trigger"){
                var mover = document.querySelector("#RNA_moving_lac");
                mover.setAttribute('visible', 'true');
                CONTEXT_AF.partner.setAttribute('visible', 'false');

                /*
                var tempRep = document.querySelector("#rep_trigger");
                tempRep.setAttribute('circles-interactive-object', { enabled: 'true'});
                var tempCap = document.querySelector("#capSite_trigger");
                tempCap.setAttribute('circles-interactive-object', { enabled: 'true'});*/
                CONTEXT_AF.el.setAttribute('circles-interactive-object', { enabled: 'false'});

                CONTEXT_AF.partner.removeAttribute('dynamic-body');
                CONTEXT_AF.currentState = "bound";

                play("#RNA_moving_lac"); //turn on the animation
                CONTEXT_AF.el.emit('lac_flag');

            }else if(test == "rep_trigger"){
                if(!CONTEXT_AF.partner.classList.contains("blocked")){

                    CONTEXT_AF.partner.classList.remove("interactive");
                    
                    CONTEXT_AF.partner.setAttribute('constraint', {
                        type: 'coneTwist',
                        target: "#" + CONTEXT_AF.el.id,
                        targetPivot: '0 -0.18 0',
                        pivot: '0 0.35 0',
                        axis: '0 0 1',
                        collideConnected: 'false'
                    });

                    var blocker =  document.querySelector("#lac_trigger");
                    blocker.emit('blocked', {value : 'true'});
                    setTimeout(() => { CONTEXT_AF.currentState = "binding"; }, 3000);
                    CONTEXT_AF.currentState = "bound";

                }else{
                    if(!CONTEXT_AF.partner.classList.contains("interactive")){
                        CONTEXT_AF.partner.classList.add("interactive");

                        CONTEXT_AF.partner.removeAttribute('constraint');

                        var blocker =  document.querySelector("#lac_trigger");
                        setTimeout(() => { CONTEXT_AF.currentState = "unbound"; }, 3000);
                        blocker.emit('blocked', {value : 'false'});
    
                    }else{
                        setTimeout(() => { CONTEXT_AF.currentState = "binding"; }, 3000);
                    }
                    console.log('This repressor is capped and cannot trigger');
                    CONTEXT_AF.currentState = "bound";
                }
            }else if(test == "capSite_trigger"){
                CONTEXT_AF.partner.removeAttribute('dynamic-body');

                CONTEXT_AF.partner.setAttribute('position', { x: -1.148, y: 1.399, z: -6.42 });
                CONTEXT_AF.partner.setAttribute('rotation', { x: 1.165, y: 62.94, z: 10.826 });

                document.querySelector("#lac_trigger").removeAttribute('static-body');
                document.querySelector("#lac_trigger").setAttribute('static-body', { shape: 'sphere', sphereRadius: 0.7 });

                CONTEXT_AF.partner.classList.remove("interactive");
                CONTEXT_AF.el.emit('capSite_flag');

                CONTEXT_AF.currentState = "bound";
                
            }

        }
    },

});