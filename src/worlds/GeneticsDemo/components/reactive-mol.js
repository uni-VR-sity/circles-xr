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

        while (CONTEXT_AF.type == "null") {
            let isLactose = CONTEXT_AF.el.parentNode.classList.contains("lactose");
            let isAllolactose = CONTEXT_AF.el.classList.contains("allolactose");
            let isBeta = CONTEXT_AF.el.classList.contains("beta-gal");
            let isRibosome = CONTEXT_AF.el.parentNode.classList.contains("ribosome");
            let isRepressor = CONTEXT_AF.el.parentNode.classList.contains("repressor");
            let isPermease = CONTEXT_AF.el.classList.contains("permease");
            let isCRP = CONTEXT_AF.el.classList.contains("CRP");
            let isCRPbound = CONTEXT_AF.el.classList.contains("CRP_bound");
            let isCAMP = CONTEXT_AF.el.parentNode.classList.contains("camp");

            if (isLactose) {
                CONTEXT_AF.type = "lactose";
                //console.log("This molecule is lactose!");
            } else if (isAllolactose) {
                CONTEXT_AF.type = "allolactose";
                //console.log("This molecule is allolactose!");
            } else if (isBeta) {
                CONTEXT_AF.type = "beta-gal";
                //console.log("This molecule is beta-gal!");
            } else if (isRibosome) {
                CONTEXT_AF.type = "ribosome";
                //console.log("This molecule is ribosome!");
            } else if (isRepressor) {
                CONTEXT_AF.type = "repressor";
                //console.log("This molecule is repressor!");
            } else if (isPermease) {
                CONTEXT_AF.type = "permease";
                //console.log("This molecule is permease!");
            } else if (isCRP) {
                CONTEXT_AF.type = "CRP";
                //console.log("This molecule is CRP!");
            } else if (isCRPbound) {
                CONTEXT_AF.type = "CRPbound";
                //console.log("This molecule is CRPbound!");
            } else if (isCAMP) {
                CONTEXT_AF.type = "camp";
                //console.log("This molecule is camp and reactive!");
            } else {
                CONTEXT_AF.type = "unreactive";
                console.log("* This molecule isn't supposed to be reactive *");
            }
        }

        CONTEXT_AF.el.addEventListener('setState', function (evt) {

            CONTEXT_AF.currentState = evt.detail.value;
            //console.log('Set currentState of '+ CONTEXT_AF.el.id +' to ' + CONTEXT_AF.currentState);

            if (CONTEXT_AF.currentState == "CRPbound") {
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
            let isRibosome = e.detail.body.el.parentNode.classList.contains("ribosome");
            let ismRNA = e.detail.body.el.classList.contains("mRNA");
            let isRepressor = e.detail.body.el.classList.contains("repressor");
            let isCRP = e.detail.body.el.classList.contains("CRP");
            let isCRPbound = e.detail.body.el.classList.contains("CRP_bound");

            if (CONTEXT_AF.currentState == "null") {
                if (isLactose && CONTEXT_AF.type == "beta-gal") {
                    //console.log("This molecule is hitting lactose and should react");
                    CONTEXT_AF.currentState = "reacting";
                } else if (isBeta && CONTEXT_AF.type == "lactose") {
                    //console.log("This molecule is hitting beta-gal and should react");
                    CONTEXT_AF.currentState = "reacting";
                } else if (isRepressor && CONTEXT_AF.type == "lactose") {
                    //console.log("This molecule is hitting the repressor and should react");
                    CONTEXT_AF.currentState = "reacting";
                } else if (isAllolactose && CONTEXT_AF.type == "repressor") {
                    //console.log("This molecule is hitting the repressor and should react");
                    CONTEXT_AF.currentState = "reacting";
                } else if (ismRNA && CONTEXT_AF.type == "ribosome") {
                    //console.log("This molecule is hitting an mRNA and should react");
                    CONTEXT_AF.currentState = "reacting";
                } else if (isCRPbound && CONTEXT_AF.type == "CRP") {
                    if (e.detail.body.el.id == "core_CRP_01" && e.detail.target.el.id == "CRP_02") {
                        var temp1 = document.getElementById('core_CRP_01');

                        var temp2 = document.getElementById('core_CRP_02');
                        //console.log("Temp Core: "+ temp2.id);
                        if (((temp2 == null || temp2.id == null) && e.detail.target.el.classList.contains('blocked')) || (e.detail.body.el.parentNode.classList.contains('blocked') && e.detail.target.el.classList.contains('blocked'))) {
                            //console.log("This CRP_02 molecule is hitting a CRPcore and should react");
                            //console.log("Type is: "+ CONTEXT_AF.type);
                            //CONTEXT_AF.attacker = document.getElementById('CRP_01');
                            CONTEXT_AF.currentState = "reacting";
                            CONTEXT_AF.attacker.emit('setState', { value: 'reacting' });
                        } else {
                            setTimeout(() => { temp1.remove(); }, 0);
                            //console.log("Core_01 deleted");
                            CONTEXT_AF.currentState = "waiting";
                        }

                    } else if (e.detail.body.el.id == "core_CRP_02" && e.detail.target.el.id == "CRP_01") {
                        var temp1 = document.getElementById('core_CRP_02');
                        
                        var temp2 = document.getElementById('core_CRP_01');
                        //console.log("Temp Core: "+ temp2.id);
                        if (((temp2 == null || temp2.id == null) && e.detail.target.el.classList.contains('blocked')) || (e.detail.body.el.parentNode.classList.contains('blocked') && e.detail.target.el.classList.contains('blocked'))) {
                            //console.log("This CRP_01 molecule is hitting a CRPcore and should react");
                            //console.log("Type is: "+ CONTEXT_AF.type);
                            //CONTEXT_AF.attacker = document.getElementById('CRP_02');
                            CONTEXT_AF.currentState = "reacting";
                            CONTEXT_AF.attacker.emit('setState', { value: 'reacting' });
                        } else {
                            setTimeout(() => { temp1.remove(); }, 0);
                            //console.log("Core_02 deleted");
                            CONTEXT_AF.currentState = "waiting";
                        }
                    }
                } else if (isCRP && CONTEXT_AF.type == "camp") {
                    //console.log("This molecule is hitting a CRP, is a camp, and should react");

                    //console.log("This is the object that is being deleted: " + e.detail.target.el.parentNode.id);

                    var temp = document.getElementById(e.detail.target.el.parentNode.id);

                    setTimeout(() => { temp.remove(); }, 0);

                    e.detail.body.el.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/CRP_bound.glb');

                    //Make the reactive core!

                    var mol_miniCore = document.createElement('a-entity');

                    mol_miniCore.setAttribute('id', 'core_' + e.detail.body.el.id);

                    mol_miniCore.classList.add("CRP_bound");

                    mol_miniCore.setAttribute('mol-reactor', '');

                    mol_miniCore.setAttribute('static-body', {
                        shape: 'none'
                    });

                    mol_miniCore.setAttribute('shape__main', {
                        shape: 'sphere',
                        radius: 0.5
                    });

                    mol_miniCore.setAttribute('collision-filter', {
                        group: 'capSite',
                        collidesWith: 'capSite',
                        collisionForces: 'false'
                    });

                    e.detail.body.el.appendChild(mol_miniCore);

                    ///Make the Magnet!

                    var mol_core = document.createElement('a-entity');

                    mol_core.setAttribute('id', 'magnet_' + e.detail.body.el.id);
                    mol_core.setAttribute('magnet', '');

                    mol_core.setAttribute('static-body', {
                        shape: 'none'
                    });

                    mol_core.setAttribute('shape__main', {
                        shape: 'sphere',
                        radius: 2
                    });

                    mol_core.setAttribute('collision-filter', {
                        group: 'capSite',
                        collidesWith: 'capSite',
                        collisionForces: 'false'
                    });

                    e.detail.body.el.appendChild(mol_core);

                    console.log("This molecule is:" + e.detail.body.el.id);

                    CONTEXT_AF.currentState = "reacted";
                    e.detail.body.el.removeAttribute('mol-reactor');
                }
            }

        });
    },

    tick: function () {

        // setup self references
        const CONTEXT_AF = this;

        if (CONTEXT_AF.currentState == "reacting") {
            //console.log("Type is: "+ CONTEXT_AF.type);
            //console.log("Attacker is: "+ CONTEXT_AF.attacker.id);
            if (CONTEXT_AF.attacker.classList.contains("beta-gal") && CONTEXT_AF.type == "lactose") {
                let temp_pos = CONTEXT_AF.el.object3D.getWorldPosition(new THREE.Vector3());
                //console.log("Spawn position is: " + temp_pos);

                CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'allolactose', pos: { x: temp_pos.x - 0.05, y: temp_pos.y, z: temp_pos.z + 0.05 }, rot: 'null' });
                CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'galactose', pos: { x: temp_pos.x + 0.05, y: temp_pos.y, z: temp_pos.z - 0.05 }, rot: 'null' });

                setTimeout(() => { CONTEXT_AF.el.parentNode.remove(); }, 0);

                CONTEXT_AF.currentState = "reacted";
            } else if (CONTEXT_AF.attacker.classList.contains("mRNA") && CONTEXT_AF.type == "ribosome") {
                let temp_pos = CONTEXT_AF.el.object3D.getWorldPosition(new THREE.Vector3());
                //console.log("Spawn position is: " + temp_pos.y);

                if (CONTEXT_AF.attacker.classList.contains("lac")) {
                    CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'beta-gal', pos: { x: temp_pos.x - 0.1, y: temp_pos.y, z: temp_pos.z + 0.1 }, rot: 'null' });
                    CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'permease', pos: { x: temp_pos.x - 0.1, y: temp_pos.y + 0.5, z: temp_pos.z }, rot: 'null' });
                } else if (CONTEXT_AF.attacker.classList.contains("rep")) {
                    CONTEXT_AF.mol_manager.emit('mol_spawn', { value: 'repressor', pos: { x: temp_pos.x - 0.1, y: temp_pos.y, z: temp_pos.z + 0.1 }, rot: 'null' });
                }
                setTimeout(() => { CONTEXT_AF.attacker.remove(); }, 0);
                setTimeout(() => { CONTEXT_AF.currentState = "null"; }, 2000);

                CONTEXT_AF.currentState = "reacted";

            } else if (CONTEXT_AF.attacker.classList.contains("allolactose") && CONTEXT_AF.type == "repressor") {
                //console.log("Allo Reacting!!!!! ");
                if (!CONTEXT_AF.el.parentNode.classList.contains("blocked")) {
                    CONTEXT_AF.el.parentNode.classList.add("blocked");
                }

                CONTEXT_AF.currentState = "null";
            } else if (CONTEXT_AF.type == "CRPbound") {
                //console.log("This molecule is hitting a CRP, is a CRP, and should react");

                CONTEXT_AF.attacker.classList.add("CRP_final");

                CONTEXT_AF.attacker.setAttribute('gltf-model', '/worlds/GeneticsDemo/assets/models/CRP_final.glb');

                CONTEXT_AF.attacker.setAttribute('circles-pickup-object', {
                    physicsObject: true,
                    shapeNames: 'shape__topLeft, shape__middleLeft, shape__bottomLeft, shape__topRight, shape__middleRight, shape__bottomRight',
                    pickupScale: '0.8 0.8 0.8'
                });
                CONTEXT_AF.attacker.setAttribute('shape__topLeft', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '-0.145 0.135 0'
                });
                CONTEXT_AF.attacker.setAttribute('shape__middleLeft', {
                    shape: 'cylinder',
                    radiusTop: 0.14,
                    radiusBottom: 0.14,
                    height: 0.25,
                    numSegments: 12,
                    offset: '-0.145 0 0'
                });
                CONTEXT_AF.attacker.setAttribute('shape__bottomLeft', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '-0.145 -0.135 0'
                });
                CONTEXT_AF.attacker.setAttribute('shape__topRight', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '0.145 0.135 0'
                });
                CONTEXT_AF.attacker.setAttribute('shape__middleRight', {
                    shape: 'cylinder',
                    radiusTop: 0.14,
                    radiusBottom: 0.14,
                    height: 0.25,
                    numSegments: 12,
                    offset: '0.145 0 0'
                });
                CONTEXT_AF.attacker.setAttribute('shape__bottomRight', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '0.145 -0.135 0'
                });

                console.log("Reshaped " + CONTEXT_AF.attacker.id);

                if (CONTEXT_AF.attacker.id == "CRP_01"){
                    var temp1 = document.getElementById('core_CRP_01');
                    var temp2 = document.getElementById('magnet_CRP_01');
                    setTimeout(() => { temp1.remove(); }, 0);
                    setTimeout(() => { temp2.remove(); }, 0);
                }else if (CONTEXT_AF.attacker.id == "CRP_02"){
                    var temp1 = document.getElementById('core_CRP_02');
                    var temp2 = document.getElementById('magnet_CRP_02');
                    setTimeout(() => { temp1.remove(); }, 0);
                    setTimeout(() => { temp2.remove(); }, 0);
                }

                setTimeout(() => { CONTEXT_AF.el.parentNode.remove(); }, 0);

                CONTEXT_AF.currentState = "reacted";
            }
        }

        if (CONTEXT_AF.type == 'permease' && CONTEXT_AF.currentState == 'null') {
            let temp_pos = CONTEXT_AF.el.object3D.getWorldPosition(new THREE.Vector3());
            //console.log("Spawn position is: " + temp_pos);

            setTimeout(() => { mol_manager.emit('mol_spawn', { value: 'lactose', pos: { x: temp_pos.x, y: temp_pos.y - 0.4, z: temp_pos.z }, rot: 'null' }); }, 500);
            setTimeout(() => { CONTEXT_AF.currentState = "null"; }, 10000);

            CONTEXT_AF.currentState = "reacted";
        }


    }

});