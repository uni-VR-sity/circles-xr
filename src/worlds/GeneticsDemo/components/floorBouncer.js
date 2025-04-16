/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   Project - Genetics Interactive Demo
//   Filename - floorBouncer.js
//   Author - Elis Joynes
//   Date - October 21st 2024
//
//   Description - This component is an attempt to keep users from losing objects by putting them inside the floor. So far it's working but nothing is perfect. :)
//
/////////////////////////////////////////////////////////////////////////////////////////////////////

AFRAME.registerComponent('bouncer', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;
        //console.log('Bouncer exists');

        CONTEXT_AF.attacker = "null";

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            e.detail.target.el;  // Original entity (holder).
            //console.log('Original entity= ' + e.detail.target.el.id);
            e.detail.body.el;    // Other entity, which (holder) touched.
            //console.log('Touched entity= ' + e.detail.body.el.id);

            let isMolecule = e.detail.body.el.classList.contains("molecule");
            let isCRP = e.detail.body.el.classList.contains("CRP");
            let isRibosome = e.detail.body.el.classList.contains("ribosome");
            let isRNA = e.detail.body.el.classList.contains("RNApoly");
            let isDNA = e.detail.body.el.classList.contains("DNA");

            if (CONTEXT_AF.attacker == 'null' && (isMolecule || isCRP || isRibosome || isRNA || isDNA)){
                let tempObj = document.querySelector('#' + e.detail.body.el.id);
                let tempPos = new THREE.Vector3();
                tempPos = tempObj.object3D.position;

                CONTEXT_AF.attacker = e.detail.body.el;
                setTimeout(() => { CONTEXT_AF.attacker = "null"; }, 500);

                setTimeout(() => { setDynamicLocation( tempObj.id, { x: tempPos.x, y: tempPos.y + 1, z: tempPos.z }, 'null'); }, 10);
                
                //console.log('This object was put through the floor and has been respawned: ' + tempObj.id);
                //console.log('At this position= ' + tempPos.x + ', ' + tempPos.y + ', ' + tempPos.z);
            }
        });
    },

});