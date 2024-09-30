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
            let isAllolactose = CONTEXT_AF.el.classList.contains("allolactose");
            let isBeta = CONTEXT_AF.el.classList.contains("beta-gal");
            let ismRNA = CONTEXT_AF.el.classList.contains("permease");
            let isCRP = CONTEXT_AF.el.classList.contains("CRP");
            let isCAMP = CONTEXT_AF.el.classList.contains("camp");

            if (isLactose){
                CONTEXT_AF.type = "lactose";
                console.log("This molecule is a lactose CORE!****************");
            }else if (isAllolactose){
                CONTEXT_AF.type = "allolactose";
                console.log("This molecule is allolactose!");
            }else if (ismRNA){
                CONTEXT_AF.type = "ribosome";
                console.log("This molecule is ribosome!");
            }else if (isCRP){
                CONTEXT_AF.type = "CRP";
                console.log("This molecule is CRP!");
            }else if (isCAMP){
                CONTEXT_AF.type = "camp";
                console.log("This molecule is camp!");
            }else{
                CONTEXT_AF.type = "unreactive";
                console.log("* This molecule isn't supposed to be reactive *");
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

                attacker = e.detail.body.el;
                console.log('Touched entity= ' + e.detail.body.el.id);

                let isBeta = e.detail.body.el.classList.contains("beta-gal");

                if (isBeta && CONTEXT_AF.type == "lactose") {
                    CONTEXT_AF.currentState = "binding";
                } else if (attacker == "lacIPromoter-free" && e.detail.target.el.id == "h11") {
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

        // check if the indicator is running
        if (CONTEXT_AF.currentState == "binding" && CONTEXT_AF.type == "lactose") {
            console.log('ParentNode is: ' + CONTEXT_AF.el.parentNode.id);
            console.log('Target is: ' + attacker.id);
            
            CONTEXT_AF.el.parentNode.setAttribute('constraint', {
                type: 'pointToPoint',
                target: "#" + attacker.id,
                maxForce: 0.5,
                targetPivot: '0 0 0.23',
                collideConnected: 'true'
            });

            CONTEXT_AF.currentState = "bound";
        }
    },

});
