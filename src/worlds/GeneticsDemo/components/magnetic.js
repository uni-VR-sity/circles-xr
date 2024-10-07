let magnetCount = 0;
AFRAME.registerComponent('magnet', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentState = "unbound";

        CONTEXT_AF.attacker = "null";

        CONTEXT_AF.type = "null";

        while (CONTEXT_AF.type == "null"){
            let isLactose = CONTEXT_AF.el.parentNode.classList.contains("lactose");
            let isRibosome = CONTEXT_AF.el.parentNode.classList.contains("ribosome");
            let isRepressor = CONTEXT_AF.el.parentNode.classList.contains("repressor");
            let isAllolactose = CONTEXT_AF.el.classList.contains("allolactose");
            let isBeta = CONTEXT_AF.el.classList.contains("beta-gal");
            let isCRP = CONTEXT_AF.el.parentNode.classList.contains("CRP");
            let isCAMP = CONTEXT_AF.el.parentNode.classList.contains("camp");

            if (isLactose){
                CONTEXT_AF.type = "lactose";
                //console.log("This molecule is a lactose CORE!****************");
            }else if (isAllolactose){
                CONTEXT_AF.type = "allolactose";
                //console.log("This molecule is allolactose!");
            }else if (isRibosome){
                CONTEXT_AF.type = "ribosome";
                //console.log("This molecule is ribosome!");
            }else if (isRepressor){
                CONTEXT_AF.type = "repressor";
                //console.log("This molecule is repressor!");
            }else if (isCRP){
                CONTEXT_AF.type = "CRP";
                //console.log("This molecule is CRP!");
            }else if (isCAMP){
                CONTEXT_AF.type = "camp";
                //console.log("This molecule is camp!");
            }else{
                CONTEXT_AF.type = "unreactive";
                console.log("* This molecule isn't supposed to be magnetic *");
            }
        }

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            //console.log('Holder has collided with body #' + e.detail.body.id);

            if (CONTEXT_AF.currentState == "unbound") {
                e.detail.target.el;  // Original entity (holder).
                //console.log('Original entity= ' + e.detail.target.el.id);
                e.detail.body.el;    // Other entity, which (holder) touched.
                //console.log('Touched entity= ' + e.detail.body.el.id);

                CONTEXT_AF.attacker = e.detail.body.el;
                //console.log('Touched entity= ' + e.detail.body.el.id);
                //console.log('Target entity= ' + e.detail.target.el.id);

                let isBeta = e.detail.body.el.classList.contains("beta-gal");
                let ismRNA = e.detail.body.el.classList.contains("mRNA");
                let isAllo = e.detail.body.el.classList.contains("allolactose");
                let isCRPbound = e.detail.body.el.parentNode.classList.contains("CRP");
                let isCRP = e.detail.body.el.classList.contains("CRP");

                if (isBeta && CONTEXT_AF.type == "lactose") {
                    CONTEXT_AF.currentState = "binding";
                } else if (ismRNA && CONTEXT_AF.type == "ribosome") {
                    //console.log('Touched an mRNA molecule and is binding!');
                    CONTEXT_AF.currentState = "binding";
                } else if (isAllo && CONTEXT_AF.type == "repressor") {
                    //console.log('Touched an allolactase and is binding!');
                    CONTEXT_AF.currentState = "binding";
                } else if (isCRP && CONTEXT_AF.type == "CRP") {
                    //console.log('Touched a CRP molecule, is a CRP and is binding!');
                    CONTEXT_AF.currentState = "binding";
                } else if (isCRP && CONTEXT_AF.type == "camp") {
                    //console.log('Touched an CRP molecule and is binding!');
                    CONTEXT_AF.currentState = "binding";
                    if(e.detail.body.el.classList.contains("blocked")){
                        CONTEXT_AF.currentState = "bound";
                    }
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

        // check if the indicator is running
        if (CONTEXT_AF.currentState == "binding" && CONTEXT_AF.type == "lactose") {
            //console.log('ParentNode is: ' + CONTEXT_AF.el.parentNode.id);
            //console.log('Target is: ' + CONTEXT_AF.attacker.id);
            
            CONTEXT_AF.el.parentNode.setAttribute('constraint', {
                type: 'pointToPoint',
                target: "#" + CONTEXT_AF.attacker.id,
                maxForce: 0.3,
                targetPivot: '0 0 0.22',
                collideConnected: 'true'
            });

            CONTEXT_AF.currentState = "bound";
        }else if(CONTEXT_AF.currentState == "binding" && CONTEXT_AF.type == "ribosome"){
            //console.log('ParentNode is: ' + CONTEXT_AF.el.id);
            //console.log('Target is: ' + CONTEXT_AF.attacker.id);
            
            CONTEXT_AF.el.parentNode.setAttribute('constraint', {
                type: 'pointToPoint',
                target: "#" + CONTEXT_AF.attacker.id,
                maxForce: 0.05,
                targetPivot: '0 0 0.3',
                collideConnected: 'true'
            });

            setTimeout(() => { CONTEXT_AF.currentState = "unbound"; }, 5000);

            CONTEXT_AF.currentState = "bound";
        }else if(CONTEXT_AF.currentState == "binding" && CONTEXT_AF.type == "repressor"){
            //console.log('ParentNode is: ' + CONTEXT_AF.el.parentNode.id);
            //console.log('Target is: ' + CONTEXT_AF.attacker.id);

            var mover = document.querySelector("#" + CONTEXT_AF.attacker.id);

            if(!CONTEXT_AF.el.parentNode.classList.contains("blocked")){
                mover.setAttribute('constraint', {
                    type: 'pointToPoint',
                    target: "#" + CONTEXT_AF.el.parentNode.id,
                    maxForce: 0.2,
                    targetPivot: '0 -0.4 0',
                    collideConnected: 'true'
                });
    
                setTimeout(() => { mover.removeAttribute('constraint'); }, 22000);
                setTimeout(() => { CONTEXT_AF.currentState = "unbound"; }, 23000);
                setTimeout(() => { CONTEXT_AF.el.parentNode.classList.remove("blocked"); }, 22500);
    
                CONTEXT_AF.currentState = "bound";
            }
            
            
        }else if(CONTEXT_AF.currentState == "binding" && CONTEXT_AF.type == "camp"){
            //console.log('ParentNode is: ' + CONTEXT_AF.el.parentNode.id);
            //console.log('Target is: ' + CONTEXT_AF.attacker.id);
            
            if(!CONTEXT_AF.attacker.classList.contains("blocked")){
                CONTEXT_AF.attacker.classList.add("blocked");

                CONTEXT_AF.el.parentNode.setAttribute('constraint', {
                    type: 'pointToPoint',
                    target: "#" + CONTEXT_AF.attacker.id,
                    maxForce: 0.15,
                    targetPivot: '0 0.2 0',
                    collideConnected: 'true'
                });
                setTimeout(() => { CONTEXT_AF.currentState = "unbound"; }, 500);

                CONTEXT_AF.currentState = "bound";
            }
            
        }else if(CONTEXT_AF.currentState == "binding" && CONTEXT_AF.type == "CRP" && CONTEXT_AF.attacker.classList.contains('blocked')){
            //console.log('ParentNode is: ' + CONTEXT_AF.el.parentNode.id);
            //console.log('Target is: ' + CONTEXT_AF.attacker.id);
            
            CONTEXT_AF.el.parentNode.setAttribute('constraint', {
                type: 'pointToPoint',
                target: "#" + CONTEXT_AF.attacker.id,
                maxForce: 0.15,
                targetPivot: '0 0 0',
                collideConnected: 'true'
            });
            setTimeout(() => { CONTEXT_AF.currentState = "unbound"; }, 1000);

            CONTEXT_AF.currentState = "bound";
            
        }
    },

});
