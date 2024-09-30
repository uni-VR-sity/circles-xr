let CRPcount = 0;

AFRAME.registerComponent('mol-reactor', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentState = "null";

        CONTEXT_AF.attacker = "null";

        CONTEXT_AF.type = "null";

        CONTEXT_AF.mol_manager = document.querySelector('#dna_model');

        while (CONTEXT_AF.type == "null"){
            let isLactose = CONTEXT_AF.el.parentNode.classList.contains("lactose");
            let isAllolactose = CONTEXT_AF.el.classList.contains("allolactose");
            let isBeta = CONTEXT_AF.el.classList.contains("beta-gal");
            let isRibosome = CONTEXT_AF.el.classList.contains("ribosome");
            let isPermease = CONTEXT_AF.el.classList.contains("permease");
            let isCRP = CONTEXT_AF.el.classList.contains("CRP");
            let isCAMP = CONTEXT_AF.el.classList.contains("camp");

            if (isLactose){
                CONTEXT_AF.type = "lactose";
                console.log("This molecule is lactose!");
            }else if (isAllolactose){
                CONTEXT_AF.type = "allolactose";
                console.log("This molecule is allolactose!");
            }else if (isBeta){
                CONTEXT_AF.type = "beta-gal";
                console.log("This molecule is beta-gal!");
            }else if (isRibosome){
                CONTEXT_AF.type = "ribosome";
                console.log("This molecule is ribosome!");
            }else if (isPermease){
                CONTEXT_AF.type = "permease";
                console.log("This molecule is permease!");
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

        CONTEXT_AF.el.addEventListener('setState', function(evt){

            CONTEXT_AF.currentState = evt.detail.value;
            console.log('Set currentState to ' + CONTEXT_AF.currentState);
            
            if (CONTEXT_AF.currentState == "CRPbound"){
                CONTEXT_AF.type = "CRP_bound";
                CONTEXT_AF.el.classList.add("CRP_bound");
            }
        });

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            //console.log('Holder has collided with body #' + e.detail.body.id);

            //e.detail.target.el;  // Original entity (holder).
            //console.log('Original entity= ' + e.detail.target.el.id);
            //e.detail.body.el;    // Other entity, which (holder) touched.
            //console.log('Touched entity= ' + e.detail.body.el.id);

            CONTEXT_AF.attacker = e.detail.body.el;

            let isLactose = e.detail.body.el.parentNode.classList.contains("lactose");
            let isAllolactose = e.detail.body.el.classList.contains("allolactose");
            let isBeta = e.detail.body.el.classList.contains("beta-gal");
            let isRibosome = e.detail.body.el.classList.contains("ribosome");
            let isRepressor = e.detail.body.el.classList.contains("repressor");
            let isCRP = e.detail.body.el.classList.contains("CRP");

            if (CONTEXT_AF.currentState == "null"){
                if (isLactose && CONTEXT_AF.type == "beta-gal") {
                    console.log("This molecule is hitting lactose and should react");
                    CONTEXT_AF.currentState = "reacting";
                }else if (isBeta && CONTEXT_AF.type == "lactose") {
                    console.log("This molecule is hitting beta-gal and should react");
                    CONTEXT_AF.currentState = "reacting";
                }else if (isRepressor && CONTEXT_AF.type == "lactose") {
                    console.log("This molecule is hitting the repressor and should react");
                    CONTEXT_AF.currentState = "reacting";
                }else if (isCRP && CONTEXT_AF.type == "camp") {
                    console.log("This molecule is hitting a CRP, is a camp, and should react");

                    setTimeout(() => { CONTEXT_AF.el.parentNode.removeChild(CONTEXT_AF.el); }, 0);

                    e.detail.body.el.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/CRP_bound.glb');
                    console.log("This molecule is:" + e.detail.body.el.id);

                    //CONTEXT_AF.currentState = "CRPbound";
                    e.detail.body.el.emit('setState', { value: 'CRPbound'});
                }
            }

            if (CONTEXT_AF.currentState == "CRPbound"){
                console.log("This CRP has been bound and the type is: " + CONTEXT_AF.type);
    
                if (isCRP && CONTEXT_AF.type == "CRP_bound") {
                    console.log("This molecule is hitting a CRP, is a CRP, and should react");
                    e.detail.body.el.emit('setState', { value: 'reacting'});
    
                    setTimeout(() => { CONTEXT_AF.el.parentNode.removeChild(CONTEXT_AF.el); }, 0);
    
                    e.detail.body.el.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/CRP_final.glb');
                    e.detail.body.el.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/CRP_final.glb');
    
                    e.detail.body.el.setAttribute('circles-pickup-object', {
                        physicsObject: true,
                        shapeNames: 'shape__topLeft, shape__middleLeft, shape__bottomLeft, shape__topRight, shape__middleRight, shape__bottomRight',
                        pickupScale: '0.8 0.8 0.8'
                    });
                    e.detail.body.el.setAttribute('shape__topLeft', {
                        shape: 'sphere',
                        radius: 0.14,
                        offset: '-0.145 0.135 0'
                    });
                    e.detail.body.el.setAttribute('shape__middleLeft', {
                        shape: 'cylinder',
                        radiusTop: 0.14,
                        radiusBottom: 0.14,
                        height: 0.25,
                        numSegments: 12,
                        offset: '-0.145 0 0'
                    });
                    e.detail.body.el.setAttribute('shape__bottomLeft', {
                        shape: 'sphere',
                        radius: 0.14,
                        offset: '-0.145 -0.135 0'
                    });
                    e.detail.body.el.setAttribute('shape__topRight', {
                        shape: 'sphere',
                        radius: 0.14,
                        offset: '0.145 0.135 0'
                    });
                    e.detail.body.el.setAttribute('shape__middleRight', {
                        shape: 'cylinder',
                        radiusTop: 0.14,
                        radiusBottom: 0.14,
                        height: 0.25,
                        numSegments: 12,
                        offset: '0.145 0 0'
                    });
                    e.detail.body.el.setAttribute('shape__bottomRight', {
                        shape: 'sphere',
                        radius: 0.14,
                        offset: '0.145 -0.135 0'
                    });
    
                    console.log("Reshaped " + e.detail.body.el.id);
    
                    CONTEXT_AF.currentState = "reacted";
                }
            }

        });
    },

    tick: function (){
        
        // setup self references
        const CONTEXT_AF = this;

        if(CONTEXT_AF.currentState == "reacting"){
            if (CONTEXT_AF.attacker.classList.contains("beta-gal") && CONTEXT_AF.type == "lactose"){
                let temp_pos = CONTEXT_AF.el.object3D.getWorldPosition(new THREE.Vector3());
                console.log("Spawn position is: " + temp_pos);

                setTimeout(() => { CONTEXT_AF.el.parentNode.parentNode.removeChild(CONTEXT_AF.el.parentNode); }, 0);

                CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'allolactose', pos: { x: temp_pos.x - 0.05, y: temp_pos.y, z: temp_pos.z + 0.05 }, rot: 'null' });
                CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'galactose', pos: { x: temp_pos.x + 0.05, y: temp_pos.y, z: temp_pos.z - 0.05 }, rot: 'null' });

                CONTEXT_AF.currentState = "reacted";
            }
        }
    }

});