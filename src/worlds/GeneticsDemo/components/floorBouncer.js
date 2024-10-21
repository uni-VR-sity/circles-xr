AFRAME.registerComponent('bouncer', {
    init: function () {
        // Setup self references
        const CONTEXT_AF = this;
        console.log('Bouncer exists');

        CONTEXT_AF.attacker = "null";

        // Setup trigger event listeners
        CONTEXT_AF.el.addEventListener('collide', function (e) {
            e.detail.target.el;  // Original entity (holder).
            //console.log('Original entity= ' + e.detail.target.el.id);
            e.detail.body.el;    // Other entity, which (holder) touched.
            //console.log('Touched entity= ' + e.detail.body.el.id);

            //e.detail.body.el.removeAttribute('dynamic-body');
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

                //CONTEXT_AF.attacker.setAttribute('visible', 'false');
                //CONTEXT_AF.attacker.removeAttribute('dynamic-body');

                //tempPos.set(tempPos.x, 1, tempPos.z);
                setTimeout(() => { setDynamicLocation( tempObj.id, { x: tempPos.x, y: tempPos.y + 1, z: tempPos.z }, 'null'); }, 10);
                
                console.log('This object was put through the floor= ' + tempObj.id);
                console.log('At this position= ' + tempPos.x + ', ' + tempPos.y + ', ' + tempPos.z);
            }
        });
    },

});