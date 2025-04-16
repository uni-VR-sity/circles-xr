'use strict';

AFRAME.registerComponent('circles-pickup-object', {
  schema: {
    pickupPosition:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //where do we want this relative to the camera
    pickupRotation:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //what orientation relative to teh camera
    pickupScale:        { type: "vec3", default:{x:1.0, y:1.0, z:1.0} },   //what scale relative to the camera
    dropPosition:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to end up after it is released
    dropRotation:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to orient as after it is released
    dropScale:          { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //what scale after it is released
    physicsObject:      { type: "boolean", default:false },
    shapeNames:         { type: "array" },
    animate:            { type: "boolean", default:false },                     //whether we animate
    animateDurationMS:  { type: "number", default:400 },                        //how long animation is
    enabled:            { type: "boolean", default:true },                      //whethere this works
  },
  init: function() {
    const CONTEXT_AF          = this;
    const data                = CONTEXT_AF.data;
    CONTEXT_AF.pickedUp       = false;
    CONTEXT_AF.rotationFudge  = 0.1;   //seems to be required to have some rotation on inspect so that it animates properly back to orig/dropRotation

    CONTEXT_AF.playerHolder   = null;
    CONTEXT_AF.origParent     = null;

    CONTEXT_AF.physicsAttributes = null;

    if (CONTEXT_AF.el.hasAttribute('circles-interactive-object') === false) {
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {});
    }

    if (CIRCLES.isReady()) {
      CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
      CONTEXT_AF.origParent = CONTEXT_AF.el.parentNode;
    }
    else {
      const readyFunc = function() {
        CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
        CONTEXT_AF.origParent   = CONTEXT_AF.el.parentNode;
        CIRCLES.getCirclesSceneElement().removeEventListener(CIRCLES.EVENTS.READY, readyFunc);
      };
      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, readyFunc);
    }

    if (data.animate == true)
    {
      CONTEXT_AF.setPickUpAnimations();
      CONTEXT_AF.setDropAnimations();
    }

    if (data.physicsObject)
    {
      CONTEXT_AF.physicsAttributes = CONTEXT_AF.el.getAttribute('dynamic-body');
    }

    CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickFunc);
    CONTEXT_AF.el.addEventListener('throw', CONTEXT_AF.throwFunc);
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;
    const SAME_DIFF = 0.001;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.enabled !== data.enabled) && (data.enabled !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {enabled:data.enabled});
    }

    if (data.animate == true && oldData.animate)
    {
      if (oldData.animate == false)
      {
        CONTEXT_AF.setPickUpAnimations();
        CONTEXT_AF.setDropAnimations();
      }

      if (!CIRCLES.UTILS.isTheSameXYZ(oldData.pickupPosition, data.pickupPosition, SAME_DIFF) || !CIRCLES.UTILS.isTheSameXYZ(oldData.pickupRotation, data.pickupRotation, SAME_DIFF) || !CIRCLES.UTILS.isTheSameXYZ(oldData.pickupScale, data.pickupScale, SAME_DIFF))
      {
        CONTEXT_AF.setPickUpAnimations();
      }

      if (!CIRCLES.UTILS.isTheSameXYZ(oldData.dropPosition, data.dropPosition, SAME_DIFF) || !CIRCLES.UTILS.isTheSameXYZ(oldData.dropRotation, data.dropRotation, SAME_DIFF) || !CIRCLES.UTILS.isTheSameXYZ(oldData.dropScale, data.dropScale, SAME_DIFF))
      {
        CONTEXT_AF.setDropAnimations();
      }
    }
  },
  remove : function() {
    this.el.removeEventListener('click', this.clickFunc);
  },
  pickup : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF    = (passedContext) ? passedContext : this;
    const data          = CONTEXT_AF.data;
    const SAME_DIFF     = 0.001;

    if (data.physicsObject)
    {
      CONTEXT_AF.physicsAttributes = CONTEXT_AF.el.getAttribute('dynamic-body');
      CONTEXT_AF.el.removeAttribute('dynamic-body');
    }

    CONTEXT_AF.playerHolder.object3D.attach(CONTEXT_AF.el.object3D);

    //set pickup transforms
    if (data.animate === true) {
      this.el.emit('cpo_pickup', null, false);
    }
    else {
      CONTEXT_AF.el.object3D.position.set(data.pickupPosition.x, data.pickupPosition.y, data.pickupPosition.z);
      CONTEXT_AF.el.object3D.rotation.set(data.pickupRotation.x, data.pickupRotation.y, data.pickupRotation.z);
      CONTEXT_AF.el.object3D.scale.set(data.pickupScale.x, data.pickupScale.y, data.pickupScale.z);
    }

    CONTEXT_AF.pickedUp = true;

    //let others know
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
    CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
  },
  release : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF  = (passedContext) ? passedContext : this;
    const data        = CONTEXT_AF.data;
    const SAME_DIFF   = 0.001;

    //release
    CONTEXT_AF.origParent.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release

    const thisPos = {x:CONTEXT_AF.el.object3D.position.x, y:CONTEXT_AF.el.object3D.position.y, z:CONTEXT_AF.el.object3D.position.z};
    const thisRot = {x:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.x), y:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.y), z:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.z)};
    const thisSca = {x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z};

    const dropPos  = (data.dropPosition.x < 100001.0) ? {x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z} : thisPos;
    const dropRot  = (data.dropRotation.x < 100001.0) ? {x:data.dropRotation.x, y:data.dropRotation.y, z:data.dropRotation.z} : thisRot;
    const dropSca  = (data.dropScale.x < 100001.0) ? {x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z} : thisSca;

    let artReleaseTimeout = null;

    const releaseEventFunc = function() {
      //console.log('releaseEventFunc');

      CONTEXT_AF.el.setAttribute('position', {x:dropPos.x, y:dropPos.y, z:dropPos.z});
      CONTEXT_AF.el.setAttribute('rotation', {x:dropRot.x, y:dropRot.y, z:dropRot.z});
      CONTEXT_AF.el.setAttribute('scale', {x:dropSca.x, y:dropSca.y, z:dropSca.z});

      //send off event for others
      CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
      CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
      if (data.animate === true && artReleaseTimeout !== null) {
        clearTimeout(artReleaseTimeout);
        //CONTEXT_AF.el.removeEventListener('animationcomplete__cpo_position', releaseEventFunc);
      }
    };
    
    if ((data.animate === true)  && (data.dropPosition.x < 100001.0 || data.dropRotation.x < 100001.0 || data.dropScale.x < 100001.0)) {
      //need to set release after all animations are done as they were not completing when expected leading to artefacts not dropping to the right place.
      artReleaseTimeout = setTimeout(function() {
        releaseEventFunc();
      }, data.animateDurationMS + 300);
      //CONTEXT_AF.el.addEventListener('animationcomplete__cpo_position', releaseEventFunc);
    }
    else {
      releaseEventFunc();
    }

    //set drop transforms, if any
    if (data.dropPosition.x < 100001.0)
    {
      if (data.animate === true) {
        this.el.emit('cpo_drop_position', null, false);
      }
      else {
        CONTEXT_AF.el.object3D.position.set(data.dropPosition.x, data.dropPosition.y, data.dropPosition.z);
      }
    }

    if (data.dropRotation.x < 100001.0)
    {
      if (data.animate === true) {
        this.el.emit('cpo_drop_rotation', null, false);
      }
      else {
        CONTEXT_AF.el.object3D.rotation.set(data.dropRotation.x, data.dropRotation.y, data.dropRotation.z);
      }
    }

    if (data.dropScale.x < 100001.0)
    {
      if (data.animate === true) {
        this.el.emit('cpo_drop_scale', null, false);
      }
      else {
        CONTEXT_AF.el.object3D.scale.set(data.dropScale.x, data.dropScale.y, data.dropScale.z);
      }
    }

    if (data.physicsObject)
    {
      CONTEXT_AF.el.setAttribute('dynamic-body', {shape: CONTEXT_AF.physicsAttributes.shape, mass: CONTEXT_AF.physicsAttributes.mass, angluarDamping: CONTEXT_AF.physicsAttributes.angluarDamping, linearDamping: CONTEXT_AF.physicsAttributes.linearDamping, sphereRadius: CONTEXT_AF.physicsAttributes.sphereRadius, cylinderAxis: CONTEXT_AF.physicsAttributes.cylinderAxis});

      if (data.shapeNames.length > 0)
      {
        // Resetting shape components
        for (var i = 0; i < data.shapeNames.length; i++)
        {
          var shape = CONTEXT_AF.el.getAttribute(data.shapeNames[i]);
          
          // Will throw error (aframe-physics-system.min.js:1 removing shape component not currently supported) but will break if removed
          CONTEXT_AF.el.removeAttribute(data.shapeNames[i]);
  
          CONTEXT_AF.el.setAttribute(data.shapeNames[i], {shape: shape.shape, offset: shape.offset, orientation: shape.orientation, radius: shape.radius, halfExtents: shape.halfExtents, radiusTop: shape.radiusTop, radiusBottom: shape.radiusBottom, height: shape.height, numSegments: shape.numSegments, });
        }
      }
    }

    CONTEXT_AF.pickedUp = false;

    //sending a "pre" event to turn off controls before any animations might be done
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, null, true);
  },
  throwRelease : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF  = (passedContext) ? passedContext : this;
    const data        = CONTEXT_AF.data;
    const SAME_DIFF   = 0.001;

    //release
    CONTEXT_AF.origParent.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release
    
    const throwReleaseEventFunc = function() {
      //send off event for others
      //CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
      if (data.animate === true) {
        CONTEXT_AF.el.removeEventListener('animationcomplete__cpo_position', throwReleaseEventFunc);
      }
    };
    if ((data.animate === true) && (data.dropPosition.x < 100001.0 || data.dropRotation.x < 100001.0 || data.dropScale.x < 100001.0)) {
      CONTEXT_AF.el.addEventListener('animationcomplete__cpo_position', throwReleaseEventFunc);
    }
    else {
      throwReleaseEventFunc();
    }

    //set drop transforms, if any
    if (data.dropPosition.x < 100001.0)
    {
      if (data.animate === true) {
        this.el.emit('cpo_drop_position', null, false);
      }
      else {
        CONTEXT_AF.el.object3D.position.set(data.dropPosition.x, data.dropPosition.y, data.dropPosition.z);
      }
    }

    if (data.dropRotation.x < 100001.0)
    {
      if (data.animate === true) {
        this.el.emit('cpo_drop_rotation', null, false);
      }
      else {
        CONTEXT_AF.el.object3D.rotation.set(data.dropRotation.x, data.dropRotation.y, data.dropRotation.z);
      }
    }

    if (data.dropScale.x < 100001.0)
    {
      if (data.animate === true) {
        this.el.emit('cpo_drop_scale', null, false);
      }
      else {
        CONTEXT_AF.el.object3D.scale.set(data.dropScale.x, data.dropScale.y, data.dropScale.z);
      }
    }

    if (data.physicsObject)
    {
      CONTEXT_AF.el.setAttribute('dynamic-body', {shape: CONTEXT_AF.physicsAttributes.shape, mass: CONTEXT_AF.physicsAttributes.mass, angluarDamping: CONTEXT_AF.physicsAttributes.angluarDamping, linearDamping: CONTEXT_AF.physicsAttributes.linearDamping, sphereRadius: CONTEXT_AF.physicsAttributes.sphereRadius, cylinderAxis: CONTEXT_AF.physicsAttributes.cylinderAxis});

      if (data.shapeNames.length > 0)
      {
        // Resetting shape components
        for (var i = 0; i < data.shapeNames.length; i++)
        {
          var shape = CONTEXT_AF.el.getAttribute(data.shapeNames[i]);
          
          // Will throw error (aframe-physics-system.min.js:1 removing shape component not currently supported) but will break if removed
          CONTEXT_AF.el.removeAttribute(data.shapeNames[i]);
  
          CONTEXT_AF.el.setAttribute(data.shapeNames[i], {shape: shape.shape, offset: shape.offset, orientation: shape.orientation, radius: shape.radius, halfExtents: shape.halfExtents, radiusTop: shape.radiusTop, radiusBottom: shape.radiusBottom, height: shape.height, numSegments: shape.numSegments, });
        }
      }
    }

    CONTEXT_AF.pickedUp = false;

    //sending a "pre" event to turn off controls before any animations might be done
    //CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, null, true);
  },
  clickFunc : function(e) {
    const CONTEXT_AF = (e) ? e.srcElement.components['circles-pickup-object'] : this;
    if (CONTEXT_AF.pickedUp === true) {
      CONTEXT_AF.release(true, CONTEXT_AF);
    }
    else {
      CONTEXT_AF.pickup(true, CONTEXT_AF);
    }
  },
  throwFunc : function(e) {
    const CONTEXT_AF = (e) ? e.srcElement.components['circles-pickup-object'] : this;
    if (CONTEXT_AF.pickedUp === true) {
      CONTEXT_AF.release(true, CONTEXT_AF);
    }else{
      CONTEXT_AF.throwRelease(true, CONTEXT_AF);
    }
    //CONTEXT_AF.throwRelease(true, CONTEXT_AF);
  },
  setPickUpAnimations : function()
  {
    const CONTEXT_AF = this;
    const data = this.data;

    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_position', { property:'position', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.pickupPosition.x, y:data.pickupPosition.y, z:data.pickupPosition.z}, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
    
    // Single animation for rotation does not work (ex. property:rotation), has to be split up
    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_rotationX', { property:'object3D.rotation.x', dur:data.animateDurationMS, isRawProperty:true, to:data.pickupRotation.x, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_rotationY', { property:'object3D.rotation.y', dur:data.animateDurationMS, isRawProperty:true, to:data.pickupRotation.y, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_rotationZ', { property:'object3D.rotation.z', dur:data.animateDurationMS, isRawProperty:true, to:data.pickupRotation.z, easing:'easeInOutQuad', startEvents:'cpo_pickup'});

    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_scale', { property:'scale', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.pickupScale.x, y:data.pickupScale.y, z:data.pickupScale.z}, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
  },
  setDropAnimations : function()
  {
    const CONTEXT_AF = this;
    const data = this.data;

    CONTEXT_AF.el.setAttribute('animation__cpo_position', { property:'position', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z}, easing:'easeInOutQuad', startEvents:'cpo_drop_position'});

    // Single animation for rotation does not work (ex. property:rotation), has to be split up
    CONTEXT_AF.el.setAttribute('animation__cpo_rotationX', { property:'object3D.rotation.x', dur:data.animateDurationMS, isRawProperty:true, to:data.dropRotation.x, easing:'easeInOutQuad', startEvents:'cpo_drop_rotation'});
    CONTEXT_AF.el.setAttribute('animation__cpo_rotationY', { property:'object3D.rotation.y', dur:data.animateDurationMS, isRawProperty:true, to:data.dropRotation.y, easing:'easeInOutQuad', startEvents:'cpo_drop_rotation'});
    CONTEXT_AF.el.setAttribute('animation__cpo_rotationZ', { property:'object3D.rotation.z', dur:data.animateDurationMS, isRawProperty:true, to:data.dropRotation.z, easing:'easeInOutQuad', startEvents:'cpo_drop_rotation'});

    CONTEXT_AF.el.setAttribute('animation__cpo_scale', { property:'scale', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z}, easing:'easeInOutQuad', startEvents:'cpo_drop_scale'});
  }
});