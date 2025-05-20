// This tutorial was used to make this interaction: https://www.youtube.com/watch?v=2cQWMHwACJM
AFRAME.registerComponent('rock-marker', {
    init: function() {

        this.addRock = function(e) {
            // the point on surface that we click on
            let p = e.detail.intersection.point;
            let scene = document.querySelector('a-scene');

            let newRock = document.createElement('a-entity');
            // NOTE: we might have to refernece a rock model instead of creating a new model each time we want a new rock in the scene
            newRock.setAttribute('geometry', {
                primitive: 'sphere'
            });
            newRock.setAttribute('material', 'color: grey');
            newRock.setAttribute('scale', '0.2 0.2 0.2');
            // puts the rock on the surface we click on
            newRock.setAttribute('position', p);
            // this lets us attach rocks on rocks, 
            // NOTE: don't forget to add the empty parameters '{}' otherwise adding this component doesn't work 
            newRock.setAttribute('rock-marker', {});
            // makes it so we can click on the rock
            newRock.setAttribute('circles-interactive-object', {});
            // add a class to each rock, so we can clear them later
            newRock.setAttribute('class', 'rock');
            scene.appendChild(newRock);
        }
        // detect when we click on the surface we can attach rocks on
        this.el.addEventListener('click', this.addRock);
    },
    remove: function() {
        this.el.removeListener('click', this.addRock);
    }
})