function init(){
    var controls = {
        influence: 0
    };

    var morphTarget = new THREE.BoxGeometry(5, 20, 5);
    var cub
    var cube = new THREE.Mesh()
    var gui = new dat.GUI();
    gui.add(controls, 'influence', 0, 1)
}