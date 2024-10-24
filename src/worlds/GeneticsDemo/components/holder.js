/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   Project - Genetics Interactive Demo
//   Filename - holder.js
//   Author - Elis Joynes
//   Date - October 21st 2024
//
//   Description - This component handles the placeholder elements that get replaced by the DNA segements as it gets assembled.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////

let holderCount = 0;

AFRAME.registerComponent('collision-holder', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentState = "null";

        CONTEXT_AF.attacker = "null";

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            //console.log('Holder has collided with body #' + e.detail.body.id);

            if (CONTEXT_AF.currentState == "unbound") {
                e.detail.target.el;  // Original entity (holder).
                //console.log('Original entity= ' + e.detail.target.el.id);
                e.detail.body.el;    // Other entity, which (holder) touched.
                //console.log('Touched entity= ' + e.detail.body.el.id);

                attacker = e.detail.body.el.id;

                if (attacker == "lacIPromoter-hover" && e.detail.target.el.id == "h1") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacIPromoter-hover" && e.detail.target.el.id == "h11") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacI-hover" && e.detail.target.el.id == "h2") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "capSite-hover" && e.detail.target.el.id == "h3") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacPromoter-hover" && e.detail.target.el.id == "h4") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacPromoter-hover" && e.detail.target.el.id == "h14") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacOperator-hover" && e.detail.target.el.id == "h5") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacZ-hover" && e.detail.target.el.id == "h6") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacY-hover" && e.detail.target.el.id == "h7") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacA-hover" && e.detail.target.el.id == "h8") {
                    CONTEXT_AF.currentState = "binding";
                }
            }

        });

        CONTEXT_AF.el.addEventListener('setState', function(evt){
            //console.log('Set holder state to unboound');
            CONTEXT_AF.currentState = evt.detail.value;
        });

        CONTEXT_AF.el.addEventListener('setPartner', function(){
            //console.log('Set Partner collider');

            CONTEXT_AF.currentState = "set";
        });
    },

    tick: function () {
        // setup self references
        const CONTEXT_AF = this;
        var partner;

        let test = this.el.getAttribute('id');

        // check if the indicator is running
        if (CONTEXT_AF.currentState == "binding") {
            //console.log('Object Bound to ' + test);

            if (attacker == "lacIPromoter-hover" && test == "h1") {
                //this.el.parentNode.object3D.visible = false;
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacIPromoter.glb');

                var burner = document.querySelector("#lacIPromoter-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }
                
                burner.parentNode.removeChild(burner);

                partner = document.querySelector("#h11");
                partner.emit('setPartner');
                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacIPromoter-hover" && test == "h11") {
                //this.el.parentNode.object3D.visible = false;
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacIPromoter.glb');

                var burner = document.querySelector("#lacIPromoter-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                partner = document.querySelector("#h1");
                partner.emit('setPartner');

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacI-hover" && test == "h2") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacI.glb');

                var burner = document.querySelector("#lacI-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "capSite-hover" && test == "h3") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/capSite.glb');

                var burner = document.querySelector("#capSite-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacPromoter-hover" && test == "h4") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacPromoter.glb');

                var burner = document.querySelector("#lacPromoter-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                partner = document.querySelector("#h14");
                partner.emit('setPartner');

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacPromoter-hover" && test == "h14") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacPromoter.glb');

                var burner = document.querySelector("#lacPromoter-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                partner = document.querySelector("#h4");
                partner.emit('setPartner');

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacOperator-hover" && test == "h5") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacOperator.glb');

                var burner = document.querySelector("#lacOperator-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacZ-hover" && test == "h6") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacZ.glb');

                var burner = document.querySelector("#lacZ-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacY-hover" && test == "h7") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacY.glb');

                var burner = document.querySelector("#lacY-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            } else if (attacker == "lacA-hover" && test == "h8") {
                this.el.parentNode.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/lacA.glb');

                var burner = document.querySelector("#lacA-free");
                let body = burner.getAttribute('dynamic-body');
                //console.log('This is the result of the get dynamic-body: ' + body);
                if(body == null){
                    //console.log('This object was held so it needs to be released');
                    burner.emit('throw');
                }

                burner.parentNode.removeChild(burner);

                CONTEXT_AF.currentState = "set";
                holderCount++;
                console.log('The number of DNA segments assembled is: ' + holderCount);
            }

            if(holderCount == 8){
                repressor_trigger = document.querySelector('#repressor_trigger');
                lac_trigger = document.querySelector('#lac_trigger');
                rep_trigger = document.querySelector('#rep_trigger');
                capSite_trigger = document.querySelector('#capSite_trigger');

                repressor_trigger.emit('setState', {value : 'unbound'});
                lac_trigger.emit('setState', {value : 'unbound'});
                rep_trigger.emit('setState', {value : 'unbound'});
                capSite_trigger.emit('setState', {value : 'unbound'});

                CONTEXT_AF.el.parentNode.parentNode.emit('DNA_flag');

                console.log('DNA set is complete');
                holderCount++;
            }
        }
    },

});
