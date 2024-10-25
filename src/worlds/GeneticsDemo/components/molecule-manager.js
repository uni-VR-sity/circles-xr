/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   Project - Genetics Interactive Demo
//   Filename - molecule-manager.js
//   Author - Elis Joynes
//   Date - October 21st 2024
//
//   Description - The molecule manager is responsible for the procedural creation and deletion of the molecules created in the 
//   demonstration. It keeps track of how many molecules have been created and keeps them within an acceptable range.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
let repressorTarget = false;
let capSiteTarget = false;
let repmRNATarget = false;
let lacmRNATarget = false;
let repRiboTarget = false;
let lacRiboTarget = false;
let finalTarget = false;

let lactoseCount = 0;
let alloLactoseCount = 0;
let galactoseCount = 0;
let glucoseCount = 0;
let mRNAcount = 0;

AFRAME.registerComponent('molecule-manager', {
    init: function () {

        //this.object = this.object.bind(this); To bind this.object to be passed to a function
        // Setup self references
        const CONTEXT_AF = this;

        // setup global variables
        CONTEXT_AF.currentPreset = "null";
        CONTEXT_AF.capSite = false;
        CONTEXT_AF.repressor = false;

        CONTEXT_AF.el.addEventListener('set', function (evt) {
            //console.log('Preset heard!');

            // set the current state
            CONTEXT_AF.currentPreset = evt.detail.value;
            //console.log('Current Preset: ' + CONTEXT_AF.currentPreset);
            
        });

        CONTEXT_AF.el.addEventListener('resetTargets', function (evt) {
            repressorTarget = false;
            repmRNATarget = false;
            lacmRNATarget = false;
            repRiboTarget = false;
            lacRiboTarget = false;
            capSiteTarget = false;
            finalTarget = false;
        });

        CONTEXT_AF.el.addEventListener('setTarget', function (evt) {
            //console.log('Preset heard!');

            // set the current state
            switch(evt.detail.value){
                case 'capSite':
                    if(!capSiteTarget){
                        capSiteTarget = true;
                        console.log("Capsite Target has been hit!");
                    }

                    break;
                case 'repressor':
                    if(!repressorTarget){
                        repressorTarget = true;
                        console.log("Repressor Target has been hit!");
                    }
    
                    break;

                default: 
                    console.log('Unknown Target!');
            }
            CONTEXT_AF.currentPreset = evt.detail.value;
            //console.log('Current Preset: ' + CONTEXT_AF.currentPreset);
            
        });

        CONTEXT_AF.el.addEventListener('mol_initial_spawn', function (evt) {

            var scene = document.querySelector('#scene');

            switch (CONTEXT_AF.currentPreset){
                case 'HH':
                    if (evt.detail.value != 'cAMP'){
                        var mol = CONTEXT_AF.createMol(evt.detail.value, evt.detail.pos, evt.detail.rot);
                        //Add that molecule to the scene
                        scene.appendChild(mol);
                    }
                    break;

                case 'LH':
                    if (evt.detail.value != 'glucose'){
                        var mol = CONTEXT_AF.createMol(evt.detail.value, evt.detail.pos, evt.detail.rot);
                        //Add that molecule to the scene
                        scene.appendChild(mol);
                    }

                    break;

                case 'HL':
                    if (evt.detail.value != 'lactose' && evt.detail.value != 'cAMP'){
                        var mol = CONTEXT_AF.createMol(evt.detail.value, evt.detail.pos, evt.detail.rot);
                        //Add that molecule to the scene
                        scene.appendChild(mol);
                    }

                    break;

                case 'LL':
                    if (evt.detail.value != 'glucose' && evt.detail.value != 'lactose'){
                        var mol = CONTEXT_AF.createMol(evt.detail.value, evt.detail.pos, evt.detail.rot);
                        //Add that molecule to the scene
                        scene.appendChild(mol);
                    }

                    break;

                default: 
                    console.log('Unknown Preset!');
            }
            
        });

        CONTEXT_AF.el.addEventListener('mol_spawn', function (evt) {

            var scene = document.querySelector('#scene');

            var mol = CONTEXT_AF.createMol(evt.detail.value, evt.detail.pos, evt.detail.rot);
            //Add that molecule to the scene
            scene.appendChild(mol);
            
        });
    },

    createMol: function (type, position, rotation) {

        // Create your empty element
        var mol = document.createElement('a-entity');
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    
        // set the class so you can mass select them later
        mol.classList.add("molecule");

        var sample;
        var tag;
    
        switch (type) {
            case "glucose":
                sample = document.querySelectorAll('.glucose');
                tag = glucoseCount++;

                mol.setAttribute('id', 'glucoseMain_' + tag);

                mol.classList.add("glucose");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/glucose.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.1
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main',
                    pickupScale: '0.8 0.8 0.8'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.3
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.25,
                    z: 0
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
                //console.log('Glucose molecule has been created');
    
                break;

            case "allolactose":
                sample = document.querySelectorAll('.allolactose');
                tag = alloLactoseCount++;

                mol.setAttribute('id', 'allolactoseMain_' + tag);

                mol.classList.add("allolactose");

                mol.setAttribute('mol-reactor', '');
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/allolactose.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.1
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main',
                    pickupScale: '0.8 0.8 0.8'
                });

                mol.setAttribute('collision-filter', {
                    group: 'allolactose',
                    collidesWith: 'allolactose, default',
                    collisionForces: 'true'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.35
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.25,
                    z: 0
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
                //console.log('Allolactose molecule has been created');
    
                break;

            case "galactose":
                sample = document.querySelectorAll('.galactose');
                tag = galactoseCount++;

                mol.setAttribute('id', 'galactoseMain_' + tag);

                mol.classList.add("galactose");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/galactose.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.1
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main',
                    pickupScale: '0.8 0.8 0.8'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.3
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.25,
                    z: 0
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
                //console.log('Galactose molecule has been created');
    
                break;

            case "lactose":
                sample = document.querySelectorAll('.lactose');
                tag = lactoseCount++;
                //lactoseCount++;

                mol.setAttribute('id', 'lactoseMain_' + tag);

                mol.classList.add("lactose");

                //mol.setAttribute('mol-reactor', '');
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: (Math.random() * 180),
                        y: (Math.random() * 180),
                        z: (Math.random() * 180)
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/lactose.glb)');
                mol.setAttribute('dynamic-body', { 
                    shape: 'none',
                    angularDamping: 0.3
                });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__left', {
                    shape: 'sphere',
                    radius: 0.1,
                    offset: '-0.09 0 0'
                });
                mol.setAttribute('shape__right', {
                    shape: 'sphere',
                    radius: 0.1,
                    offset: '0.09 0 0'
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__left, shape__right',
                    pickupScale: '0.8 0.8 0.8',
                });
                
                //Make the reactive core!

                var mol_miniCore = document.createElement('a-entity');

                mol_miniCore.setAttribute('mol-reactor', '');

                mol_miniCore.setAttribute('static-body', { 
                    shape: 'none'
                });
    
                mol_miniCore.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.06
                });
    
                mol_miniCore.setAttribute('collision-filter', {
                    group: 'beta-gal',
                    collidesWith: 'beta-gal',
                    collisionForces: 'false'
                });
    
                mol.appendChild(mol_miniCore);

                ///Make the Magnet!

                var mol_core = document.createElement('a-entity');

                mol_core.setAttribute('id', 'magnetTarget_' + tag);
                mol_core.setAttribute('magnet', '');

                mol_core.setAttribute('static-body', { 
                    shape: 'none'
                });
    
                mol_core.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 2
                });
    
                mol_core.setAttribute('collision-filter', {
                    group: 'beta-gal',
                    collidesWith: 'beta-gal',
                    collisionForces: 'false'
                });
    
                mol.appendChild(mol_core);
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.12,
                    width: 0.28
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.2,
                    z: 0
                });

                mol_label.setAttribute('scale', {
                    x: 1,
                    y: 1,
                    z: 1
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                //console.log('Lactose molecule has been created');
                break;
                
            case "permease":
                mol.classList.add("permease");

                mol.setAttribute('mol-reactor', '');
    
                mol.setAttribute('scale', {
                    x: 1,
                    y: 1,
                    z: 1
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/permease.glb)');
                mol.setAttribute('static-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });

                mol.setAttribute('animation', {
                    property: 'position',
                    to: position.x+' 5 '+position.z,
                    dur: 3000,
                    easing: 'linear',
                    loop: 'false'
                });

                if (rotation != "null"){
                    mol.setAttribute('animation__2', {
                        property: 'rotation',
                        to: rotation.x+' '+rotation.y+' '+rotation.z,
                        dur: 3000,
                        easing: 'linear',
                        loop: 'false'
                    });
                }
    
                mol.setAttribute('shape__main', {
                    shape: 'cylinder',
                    height: 0.6,
                    radiusTop: 0.3,
                    radiusBottom: 0.3,
                    numSegments: 16
                });
                mol.setAttribute('shape__bottom', {
                    shape: 'sphere',
                    radius: 0.3,
                    offset: '0 -0.1 0'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.3
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0.3,
                    y: -0.5,
                    z: 0.3
                });

                mol_label.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                //console.log('Permease molecule has been created');
                
                if(!lacRiboTarget){
                    lacRiboTarget = true;
                }
                break;
                
            case "cAMP":
                sample = document.querySelectorAll('.camp');
                tag = sample.length++;

                mol.setAttribute('id', 'campMain_' + tag);

                mol.classList.add("camp");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/camp.glb)');
                mol.setAttribute('dynamic-body', { 
                    shape: 'none',
                    angularDamping: 0.3
                });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'box',
                    halfExtents: '0.05 0.05 0.05'
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main',
                    pickupScale: '0.8 0.8 0.8'
                });

                ///Make the reactive core!

                var mol_miniCore = document.createElement('a-entity');

                mol_miniCore.setAttribute('mol-reactor', '');

                mol_miniCore.setAttribute('position', {
                    x: 0,
                    y: 0,
                    z: 0
                });

                mol_miniCore.setAttribute('static-body', { 
                    shape: 'none'
                });
    
                mol_miniCore.setAttribute('shape__main', {
                    shape: 'box',
                    halfExtents: '0.053 0.053 0.053'
                });
    
                mol_miniCore.setAttribute('collision-filter', {
                    group: 'camp',
                    collidesWith: 'camp, capSite',
                    collisionForces: 'false'
                });
    
                mol.appendChild(mol_miniCore);

                ///Make the Magnet!

                var mol_core = document.createElement('a-entity');

                mol_core.setAttribute('id', 'magnetTarget_' + tag);
                mol_core.setAttribute('magnet', '');

                mol_core.setAttribute('static-body', { 
                    shape: 'none'
                });

                mol_core.setAttribute('position', {
                    x: 0,
                    y: 0,
                    z: 0
                });
    
                mol_core.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 2
                });
    
                mol_core.setAttribute('collision-filter', {
                    group: 'camp',
                    collidesWith: 'camp, capSite',
                    collisionForces: 'false'
                });
    
                mol.appendChild(mol_core);
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.3
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.15,
                    z: 0
                });

                mol_label.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                mol_label.setAttribute('width', '2');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                //console.log('camp molecule has been created');
                break;

            case "beta-gal":
                sample = document.querySelectorAll('.beta-gal');
                tag = sample.length++;

                mol.setAttribute('id', 'beta-galMain_' + tag);
                mol.classList.add("beta-gal");

                mol.setAttribute('mol-reactor', '');
    
                mol.setAttribute('scale', {
                    x: 0.6,
                    y: 0.6,
                    z: 0.6
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/beta-gal.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'cylinder',
                    height: 0.12,
                    radiusTop: 0.35,
                    radiusBottom: 0.35,
                    numSegments: 16
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main',
                    pickupRotation: '45 0 0',
                    pickupScale: '0.8 0.8 0.8',
                    dropScale: '0.6 0.6 0.6',
                    animate: 'false'
                });

                mol.setAttribute('collision-filter', {
                    group: 'beta-gal',
                    collidesWith: 'beta-gal, default'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.3
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.25,
                    z: 0
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                //console.log('Beta-gal molecule has been created');
                break;

            case "mRNA-rep":
                sample = document.querySelectorAll('.mRNA');
                tag = mRNAcount++;
                
                mol.setAttribute('id', 'mRNA-head-' + tag);

                mol.classList.add("mRNA");
                mol.classList.add("rep");

                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('scale', {
                    x: 1,
                    y: 1,
                    z: 1
                });
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/mRNA_rep.glb)');
                mol.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 1,
                    angularDamping: 0.3
                });

                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.12
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main'
                });

                mol.setAttribute('collision-filter', {
                    group: 'ribosome',
                    collidesWith: 'mRNA, default, ribosome'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.7
                });

                mol_label.setAttribute('scale', {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4
                });
    
                mol_label.setAttribute('text', {
                    value: 'repressor mRNA',
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.25,
                    z: 0
                });
    
                mol_label.setAttribute('width', '2');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);

                //Core creation********************************
                // Creating mRNA core
                var mol_core = document.createElement('a-entity');

                mol_core.setAttribute('id', 'mRNA-core-' + tag);
    
                mol_core.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/mRNA_rep.glb)');
                mol_core.setAttribute('static-body', { 
                    shape: 'none'
                });
    
                mol_core.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.13
                });
                
                mol_core.setAttribute('constraint', {
                    target: '#tail-' + tag + '-1',
                    type: 'pointToPoint',
                    pivot: '0 0 0',
                    targetPivot: '0 0.1425 0',
                    maxForce: 1,
                    collideConnected: 'false'
                });
    
                mol_core.setAttribute('visible', 'false');
    
                mol_core.setAttribute('collision-filter', {
                    group: 'mRNA',
                    collidesWith: 'mRNA'
                });
    
                mol.appendChild(mol_core);

                //Create first tail node **********************
                var mol_tail_01 = document.createElement('a-entity');

                mol_tail_01.setAttribute('id', 'tail-' + tag + '-1');

                mol_tail_01.setAttribute('scale', {
                    x: 0.8,
                    y: 1,
                    z: 0.8
                });

                mol_tail_01.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_01.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_01.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_01.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_01.setAttribute('constraint', {
                    target: '#tail-' + tag + '-2',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol.appendChild(mol_tail_01);

                //Create second tail node ******************************************************
                var mol_tail_02 = document.createElement('a-entity');

                mol_tail_02.setAttribute('id', 'tail-' + tag + '-2');

                mol_tail_02.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_02.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_02.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_02.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_02.setAttribute('constraint', {
                    target: '#tail-' + tag + '-3',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_01.appendChild(mol_tail_02);

                //Create third tail node ********************************************************
                var mol_tail_03 = document.createElement('a-entity');

                mol_tail_03.setAttribute('id', 'tail-' + tag + '-3');

                mol_tail_03.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_03.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_03.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_03.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_03.setAttribute('constraint', {
                    target: '#tail-' + tag + '-4',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_02.appendChild(mol_tail_03);

                //Create fourth tail node ********************************************************
                var mol_tail_04 = document.createElement('a-entity');

                mol_tail_04.setAttribute('id', 'tail-' + tag + '-4');

                mol_tail_04.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_04.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_04.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_04.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                
                mol_tail_04.setAttribute('constraint', {
                    target: '#tail-' + tag + '-5',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_03.appendChild(mol_tail_04);

                //Create fifth tail node ********************************************************
                var mol_tail_05 = document.createElement('a-entity');

                mol_tail_05.setAttribute('id', 'tail-' + tag + '-5');

                mol_tail_05.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_05.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_05.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_05.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_05.setAttribute('constraint', {
                    target: '#tail-' + tag + '-6',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_04.appendChild(mol_tail_05);

                //Create sixth tail node ********************************************************
                var mol_tail_06 = document.createElement('a-entity');

                mol_tail_06.setAttribute('id', 'tail-' + tag + '-6');

                mol_tail_06.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_06.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_06.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_06.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_06.setAttribute('constraint', {
                    target: '#tail-' + tag + '-7',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_05.appendChild(mol_tail_06);

                //Create seventh tail node ********************************************************
                var mol_tail_07 = document.createElement('a-entity');

                mol_tail_07.setAttribute('id', 'tail-' + tag + '-7');

                mol_tail_07.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_07.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_07.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_07.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_07.setAttribute('constraint', {
                    target: '#tail-' + tag + '-8',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_06.appendChild(mol_tail_07);

                //Create eigth tail node ********************************************************
                var mol_tail_08 = document.createElement('a-entity');

                mol_tail_08.setAttribute('id', 'tail-' + tag + '-8');

                mol_tail_08.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_08.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_08.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_08.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_08.setAttribute('constraint', {
                    target: '#tail-' + tag + '-9',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_07.appendChild(mol_tail_08);

                //Create ninth tail node ********************************************************
                var mol_tail_09 = document.createElement('a-entity');

                mol_tail_09.setAttribute('id', 'tail-' + tag + '-9');

                mol_tail_09.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_09.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_rep.glb)');
                mol_tail_09.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_09.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
    
                mol_tail_08.appendChild(mol_tail_09);

                //console.log('mRNA molecule has been created');
                if(!repmRNATarget){
                    repmRNATarget = true;
                    console.log("Repressor mRNA Target has been hit!");
                }
    
                break;

            case "mRNA-lac":
                sample = document.querySelectorAll('.mRNA');
                tag = mRNAcount++;
                
                mol.setAttribute('id', 'mRNA-head-' + tag);

                mol.classList.add("mRNA");
                mol.classList.add("lac");

                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('scale', {
                    x: 1,
                    y: 1,
                    z: 1
                });
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/mRNA_lac.glb)');
                mol.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 1,
                    angularDamping: 0.3
                });

                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.12
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main'
                });

                mol.setAttribute('collision-filter', {
                    group: 'ribosome',
                    collidesWith: 'mRNA, default, ribosome'
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.4
                });

                mol_label.setAttribute('scale', {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4
                });
    
                mol_label.setAttribute('text', {
                    value: 'lac mRNA',
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.25,
                    z: 0
                });
    
                mol_label.setAttribute('width', '2');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);

                //Core creation********************************
                // Creating mRNA core
                var mol_core = document.createElement('a-entity');

                mol_core.setAttribute('id', 'mRNA-core-' + tag);
    
                mol_core.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/mRNA_lac.glb)');
                mol_core.setAttribute('static-body', { 
                    shape: 'none'
                });
    
                mol_core.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.13
                });
                
                mol_core.setAttribute('constraint', {
                    target: '#tail-' + tag + '-1',
                    type: 'pointToPoint',
                    pivot: '0 0 0',
                    targetPivot: '0 0.1425 0',
                    maxForce: 1,
                    collideConnected: 'false'
                });
    
                mol_core.setAttribute('visible', 'false');
    
                mol_core.setAttribute('collision-filter', {
                    group: 'mRNA',
                    collidesWith: 'mRNA'
                });
    
                mol.appendChild(mol_core);

                //Create first tail node **********************
                var mol_tail_01 = document.createElement('a-entity');

                mol_tail_01.setAttribute('id', 'tail-' + tag + '-1');

                mol_tail_01.setAttribute('scale', {
                    x: 0.8,
                    y: 1,
                    z: 0.8
                });

                mol_tail_01.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_01.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_01.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_01.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_01.setAttribute('constraint', {
                    target: '#tail-' + tag + '-2',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol.appendChild(mol_tail_01);

                //Create second tail node ******************************************************
                var mol_tail_02 = document.createElement('a-entity');

                mol_tail_02.setAttribute('id', 'tail-' + tag + '-2');

                mol_tail_02.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_02.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_02.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_02.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_02.setAttribute('constraint', {
                    target: '#tail-' + tag + '-3',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_01.appendChild(mol_tail_02);

                //Create third tail node ********************************************************
                var mol_tail_03 = document.createElement('a-entity');

                mol_tail_03.setAttribute('id', 'tail-' + tag + '-3');

                mol_tail_03.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_03.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_03.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_03.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_03.setAttribute('constraint', {
                    target: '#tail-' + tag + '-4',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_02.appendChild(mol_tail_03);

                //Create fourth tail node ********************************************************
                var mol_tail_04 = document.createElement('a-entity');

                mol_tail_04.setAttribute('id', 'tail-' + tag + '-4');

                mol_tail_04.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_04.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_04.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_04.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                
                mol_tail_04.setAttribute('constraint', {
                    target: '#tail-' + tag + '-5',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_03.appendChild(mol_tail_04);

                //Create fifth tail node ********************************************************
                var mol_tail_05 = document.createElement('a-entity');

                mol_tail_05.setAttribute('id', 'tail-' + tag + '-5');

                mol_tail_05.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_05.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_05.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_05.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_05.setAttribute('constraint', {
                    target: '#tail-' + tag + '-6',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_04.appendChild(mol_tail_05);

                //Create sixth tail node ********************************************************
                var mol_tail_06 = document.createElement('a-entity');

                mol_tail_06.setAttribute('id', 'tail-' + tag + '-6');

                mol_tail_06.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_06.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_06.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_06.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_06.setAttribute('constraint', {
                    target: '#tail-' + tag + '-7',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_05.appendChild(mol_tail_06);

                //Create seventh tail node ********************************************************
                var mol_tail_07 = document.createElement('a-entity');

                mol_tail_07.setAttribute('id', 'tail-' + tag + '-7');

                mol_tail_07.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_07.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_07.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_07.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_07.setAttribute('constraint', {
                    target: '#tail-' + tag + '-8',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_06.appendChild(mol_tail_07);

                //Create eigth tail node ********************************************************
                var mol_tail_08 = document.createElement('a-entity');

                mol_tail_08.setAttribute('id', 'tail-' + tag + '-8');

                mol_tail_08.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_08.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_08.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_08.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
                
                mol_tail_08.setAttribute('constraint', {
                    target: '#tail-' + tag + '-9',
                    type: 'pointToPoint',
                    pivot: '0 -0.2 0',
                    targetPivot: '0 0 0',
                    maxForce: 1,
                    collideConnected: 'true'
                });
    
                mol_tail_07.appendChild(mol_tail_08);

                //Create ninth tail node ********************************************************
                var mol_tail_09 = document.createElement('a-entity');

                mol_tail_09.setAttribute('id', 'tail-' + tag + '-9');

                mol_tail_09.setAttribute('position', {
                    x: -0.15,
                    y: 0,
                    z: 0
                });
    
                mol_tail_09.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/tail_lac.glb)');
                mol_tail_09.setAttribute('dynamic-body', { 
                    shape: 'none',
                    mass: 0.25,
                    angularDamping: 0.5
                });
    
                mol_tail_09.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.05,
                    radiusBottom: 0.085,
                    height: 0.2,
                    offset: '0 -0.075 0'
                });
    
                mol_tail_08.appendChild(mol_tail_09);

                //console.log('mRNA molecule has been created');
                if(!lacmRNATarget){
                    lacmRNATarget = true;
                    console.log("lac mRNA Target has been hit!");
                }
    
                break;

            case "repressor":
                sample = document.querySelectorAll('.repressor');
                tag = sample.length++;

                mol.setAttribute('id', 'repressorMain_' + tag);

                mol.classList.add("repressor");
    
                mol.setAttribute('scale', {
                    x: 1,
                    y: 1,
                    z: 1
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (((Math.random() * 8)+ 1) * plusOrMinus),
                        y: ((Math.random() * 5) + 1),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/repressor.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__left, shape__right, shape__top, shape__bottom'
                });
    
                mol.setAttribute('shape__top', {
                    shape: 'cylinder',
                    height: 0.35,
                    radiusTop: 0.05,
                    radiusBottom: 0.2,
                    offset: '-0.075 -0.2 0'
                });
                mol.setAttribute('shape__bottom', {
                    shape: 'cylinder',
                    height: 0.35,
                    radiusTop: 0.05,
                    radiusBottom: 0.2,
                    offset: '0.075 -0.2 0'
                });
                mol.setAttribute('shape__left', {
                    shape: 'sphere',
                    radius: 0.25,
                    offset: '-0.15 0.2 0'
                });
                mol.setAttribute('shape__right', {
                    shape: 'sphere',
                    radius: 0.25,
                    offset: '0.15 0.2 0'
                });

                mol.setAttribute('collision-filter', {
                    group: 'repressor',
                    collidesWith: 'repressor, default',
                    collisionForces: 'true'
                });

                ///Make the reactive core!

                var mol_miniCore = document.createElement('a-entity');

                mol_miniCore.setAttribute('mol-reactor', '');

                mol_miniCore.setAttribute('position', {
                    x: 0,
                    y: -0.4,
                    z: 0
                });

                mol_miniCore.setAttribute('static-body', { 
                    shape: 'none'
                });
    
                mol_miniCore.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 0.06
                });
    
                mol_miniCore.setAttribute('collision-filter', {
                    group: 'allolactose',
                    collidesWith: 'allolactose',
                    collisionForces: 'false'
                });
    
                mol.appendChild(mol_miniCore);

                ///Make the Magnet!

                var mol_core = document.createElement('a-entity');

                mol_core.setAttribute('id', 'magnetTarget_' + tag);
                mol_core.setAttribute('magnet', '');

                mol_core.setAttribute('static-body', { 
                    shape: 'none'
                });

                mol_core.setAttribute('position', {
                    x: 0,
                    y: -0.4,
                    z: 0
                });
    
                mol_core.setAttribute('shape__main', {
                    shape: 'sphere',
                    radius: 1.75
                });
    
                mol_core.setAttribute('collision-filter', {
                    group: 'allolactose',
                    collidesWith: 'allolactose',
                    collisionForces: 'false'
                });
    
                mol.appendChild(mol_core);
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.15,
                    width: 0.3
                });
    
                mol_label.setAttribute('text', {
                    value: type,
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: 0.5,
                    z: 0
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
                //console.log('Glucose molecule has been created');

                if(!repRiboTarget){
                    repRiboTarget = true;
                }
    
                break;

            case "CRP_01":
                mol.setAttribute('id', 'CRP_01');

                mol.classList.add("CRP");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 45,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: -2,
                        y: 2.5,
                        z: -4
                    });
                }

                mol.setAttribute('mol-reactor', '');
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/CRP.glb)');
                mol.setAttribute('dynamic-body', { 
                    shape: 'none',
                    angularDamping: '0.3'
                });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'cylinder',
                    height: 0.25,
                    radiusTop: 0.14,
                    radiusBottom: 0.14,
                    numSegments: 12
                });

                mol.setAttribute('shape__right', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '0 0.135 0',
                });

                mol.setAttribute('shape__left', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '0 -0.135 0',
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main, shape__right, shape__left',
                    pickupScale: '0.8 0.8 0.8',
                    animate: false
                });

                mol.setAttribute('collision-filter', {
                    group: 'capSite',
                    collidesWith: 'default, capSite, camp',
                    collisionForces: true
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.35,
                    width: 0.5
                });
    
                mol_label.setAttribute('text', {
                    value: 'CRP',
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: -0.35,
                    z: 0
                });
    
                mol_label.setAttribute('width', '3.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
                //console.log('CRP_01 molecule has been created');
    
                break;

            case "CRP_02":
                mol.setAttribute('id', 'CRP_02');

                mol.classList.add("CRP");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', rotation);
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 45,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', position);
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: 4.5,
                        y: 1.5,
                        z: -3
                    });
                }

                mol.setAttribute('mol-reactor', '');
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/CRP.glb)');
                mol.setAttribute('dynamic-body', { 
                    shape: 'none',
                    angularDamping: '0.3'
                });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'cylinder',
                    height: 0.25,
                    radiusTop: 0.14,
                    radiusBottom: 0.14,
                    numSegments: 12
                });

                mol.setAttribute('shape__right', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '0 0.135 0',
                });

                mol.setAttribute('shape__left', {
                    shape: 'sphere',
                    radius: 0.14,
                    offset: '0 -0.135 0',
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main, shape__right, shape__left',
                    pickupScale: '0.8 0.8 0.8',
                    animate: false
                });

                mol.setAttribute('collision-filter', {
                    group: 'capSite',
                    collidesWith: 'default, capSite, camp',
                    collisionForces: true
                });
    
                //Label creation********************************
                // Creating mol label
                var mol_label = document.createElement('a-text');
    
                mol_label.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 0.35,
                    width: 0.5
                });
    
                mol_label.setAttribute('text', {
                    value: 'CRP',
                    align: 'center'
                });
    
                mol_label.setAttribute('material', {
                    color: 'black'
                });
    
                mol_label.setAttribute('position', {
                    x: 0,
                    y: -0.35,
                    z: 0
                });
    
                mol_label.setAttribute('width', '3.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
                //console.log('CRP_01 molecule has been created');
    
                break;

            default:
                //code block
                console.log("Molecule type passed doesn't match anything in my books");
    
                break;
        }

        if(type != "permease"){
            // set other necessary attributes
            mol.setAttribute('circles-pickup-object', { physicsObject: 'true' });
        }
        
    
        return mol;
    },

    tick: function(){
        var sampleLactose = document.querySelectorAll('.lactose');
        var sampleAllo = document.querySelectorAll('.allolactose');
        var sampleGal = document.querySelectorAll('.galactose');
        var samplemRNA = document.querySelectorAll('.mRNA');

        if (sampleLactose.length >= 60){
            console.log('Deleted thise item: ' + sampleLactose[0].id);

            sampleLactose[0].parentNode.removeChild(sampleLactose[0]);
        }
        if (lactoseCount >= 300){
            lactoseCount = 1;
        }

        if (sampleAllo.length >= 60){
            console.log('Deleted thise item: ' + sampleAllo[0].id);

            sampleAllo[0].parentNode.removeChild(sampleAllo[0]);
            sampleGal[0].parentNode.removeChild(sampleGal[0]);
        }
        if (alloLactoseCount >= 300){
            alloLactoseCount = 1;
            galactoseCount = 1;
        }

        if (samplemRNA.length >= 40){
            console.log('Deleted thise item: ' + samplemRNA[0].id);

            samplemRNA[0].parentNode.removeChild(samplemRNA[0]);
        }
        if (mRNAcount >= 300){
            mRNAcount = 1;
        }

        if(repRiboTarget && lacRiboTarget && repressorTarget && capSiteTarget && repmRNATarget && lacmRNATarget && !finalTarget){
            console.log("Congrats You've completed this demonstration!");
            document.querySelector('#endText').setAttribute('visible', 'true');
            sample = document.querySelectorAll('.tutorial');

            console.log("Is the tutorial visible: " + sample[0].getAttribute('visible'));

            if(sample[0].getAttribute('visible')){
                tutorialToggle();
                console.log("Tutorial turned off");
            }
            finalTarget = true;
        }
    }
});