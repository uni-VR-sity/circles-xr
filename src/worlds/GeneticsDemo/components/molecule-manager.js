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
            console.log('Current Preset: ' + CONTEXT_AF.currentPreset);
        });

        CONTEXT_AF.el.addEventListener('mol_spawn', function (evt) {

            var scene = document.querySelector('#scene');

            switch (CONTEXT_AF.currentPreset){
                case 'HH':
                    if (evt.detail.value != 'camp'){
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
                    if (evt.detail.value != 'lactose' && evt.detail.value != 'camp'){
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
    },

    createMol: function (type, position, rotation) {

        // Create your empty element
        var mol = document.createElement('a-entity');
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    
        // set the class so you can mass select them later
        mol.classList.add("molecule");
    
        switch (type) {
            case "glucose":
                mol.classList.add("glucose");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', {
                        x: rotation[0],
                        y: rotation[1],
                        z: rotation[2]
                    });
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    });
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (Math.random() * 8 * plusOrMinus),
                        y: (Math.random() * 3),
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
                    shapeNames: 'shape__main'
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
                console.log('Glucose molecule has been created');
    
                break;

            case "allolactose":
                mol.classList.add("allolactose");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', {
                        x: rotation[0],
                        y: rotation[1],
                        z: rotation[2]
                    });
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    });
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (Math.random() * 8 * plusOrMinus),
                        y: (Math.random() * 3),
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
                    shapeNames: 'shape__main'
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
                console.log('Allolactose molecule has been created');
    
                break;

            case "galactose":
                mol.classList.add("galactose");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', {
                        x: rotation[0],
                        y: rotation[1],
                        z: rotation[2]
                    });
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    });
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (Math.random() * 8 * plusOrMinus),
                        y: (Math.random() * 3),
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
                    shapeNames: 'shape__main'
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
                console.log('Galactose molecule has been created');
    
                break;

            case "lactose":
                mol.classList.add("lactose");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', {
                        x: rotation[0],
                        y: rotation[1],
                        z: rotation[2]
                    });
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    });
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (Math.random() * 8 * plusOrMinus),
                        y: (Math.random() * 3),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/lactose.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
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
                    shapeNames: 'shape__left, shape__right'
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

                mol_label.setAttribute('scale', {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                console.log('Lactose molecule has been created');
                break;
                
            case "permease":
                mol.classList.add("permease");
    
                mol.setAttribute('scale', {
                    x: 1,
                    y: 1,
                    z: 1
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', {
                        x: rotation[0],
                        y: rotation[1],
                        z: rotation[2]
                    });
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    });
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (Math.random() * 8 * plusOrMinus),
                        y: (Math.random() * 3),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/permease.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
                mol.setAttribute('shadow', {
                    receive: 'false',
                    cast: 'true'
                });
    
                mol.setAttribute('shape__main', {
                    shape: 'cylinder',
                    radiusTop: 0.3,
                    radiusBottom: 0.3,
                    numSegments: 16
                });
    
                mol.setAttribute('circles-pickup-object', {
                    physicsObject: 'true',
                    shapeNames: 'shape__main'
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
                    y: 0.5,
                    z: 0
                });

                mol_label.setAttribute('scale', {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4
                });
    
                mol_label.setAttribute('width', '1.5');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                console.log('Permease molecule has been created');
                break;
                
            case "camp":
                mol.classList.add("camp");
    
                mol.setAttribute('scale', {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8
                });
    
                // Setting molecule rotation
                if (rotation != "null") {
                    mol.setAttribute('rotation', {
                        x: rotation[0],
                        y: rotation[1],
                        z: rotation[2]
                    });
                } else {
                    mol.setAttribute('rotation', {
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
    
                if (position != "null") {
                    // Set molecule position to provided position
                    mol.setAttribute('position', {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    });
                } else {
                    //Set molecule position to a random position within bounds
                    mol.setAttribute('position', {
                        x: (Math.random() * 8 * plusOrMinus),
                        y: (Math.random() * 3),
                        z: (Math.random() * -7)
                    });
                }
    
                mol.setAttribute('gltf-model', 'url(/worlds/GeneticsDemo/assets/models/camp.glb)');
                mol.setAttribute('dynamic-body', { shape: 'none' });
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
                    shapeNames: 'shape__main'
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
                    y: 0.15,
                    z: 0
                });

                mol_label.setAttribute('scale', {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4
                });
    
                mol_label.setAttribute('width', '2');
    
                mol_label.setAttribute('circles-lookat', {
                    constrainYAxis: 'false'
                });
    
                mol.appendChild(mol_label);
    
                console.log('camp molecule has been created');
                break;
    
            default:
                //code block
                console.log("Molecule type passed doesn't match anything in my books");
    
                break;
        }
    
        // set other necessary attributes
        mol.setAttribute('circles-pickup-object', { physicsObject: 'true' });
    
        return mol;
    },

});