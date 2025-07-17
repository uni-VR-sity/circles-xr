AFRAME.registerComponent('teleport-click', {
	init: function () {
    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    this.el.addEventListener('raycaster-intersected', evt => {
        this.raycaster = evt.detail.el;
    });
    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      this.raycaster = null;
    });

    // mkaing the teleport pad
    //create a teleport pad, then we'll move it to the interseting point
    let sceneEl = document.querySelector('a-scene');
    let newLocation = document.createElement('a-entity');
    newLocation.setAttribute('id', 'teleport-cursor');
    newLocation.setAttribute('circles-checkpoint', {});
    sceneEl.appendChild(newLocation);
  },

  tick: function () {
      
    if (!this.raycaster) { 
      //console.log('not intersecting'); 
      return; 
    }  // Not intersecting.
    
    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
    if (!intersection) { 
      //console.log('intersecting!'); 
      return; 
    }
    
    // move the cursor
    let teleportCursor = document.querySelector('#teleport-cursor');
    if(teleportCursor) {
        teleportCursor.setAttribute('position', {x:intersection.point.x, y:intersection.point.y, z:intersection.point.z});
    }
    else {
        //console.log(document.querySelector('teleport-cursor'));
    }
    
    //console.log(intersection.point);
  }
});