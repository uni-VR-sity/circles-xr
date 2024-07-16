'use strict';

AFRAME.registerComponent('circles-pickup-object', {
  schema: {
    pickupPosition:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //where do we want this relative to the camera
    pickupRotation:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //what orientation relative to teh camera
    pickupScale:        { type: "vec3", default:{x:1.0, y:1.0, z:1.0} },   //what scale relative to the camera
    dropPosition:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to end up after it is released
    dropRotation:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to orient as after it is released
    dropScale:          { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //what scale after it is released
    animate:            { type: "boolean", default:true },                     //whether we animate
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

    CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickFunc);
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
  },
  release : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF  = (passedContext) ? passedContext : this;
    const data        = CONTEXT_AF.data;
    const SAME_DIFF   = 0.001;

    //release
    CONTEXT_AF.origParent.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release
    
    const releaseEventFunc = function() {
      //send off event for others
      CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
      if (data.animate === true) {
        CONTEXT_AF.el.removeEventListener('animationcomplete__cpo_position', releaseEventFunc);
      }
    };
    if ((data.animate === true) && (data.dropPosition.x < 100001.0 || data.dropRotation.x < 100001.0 || data.dropScale.x < 100001.0)) {
      CONTEXT_AF.el.addEventListener('animationcomplete__cpo_position', releaseEventFunc);
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

    CONTEXT_AF.pickedUp = false;

    //sending a "pre" event to turn off controls before any animations might be done
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, null, true);
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
  setPickUpAnimations : function()
  {
    const CONTEXT_AF = this;
    const data = this.data;

    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_position', { property:'position', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.pickupPosition.x, y:data.pickupPosition.y, z:data.pickupPosition.z}, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_rotation', { property:'rotation', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.pickupRotation.x, y:data.pickupRotation.y, z:data.pickupRotation.z}, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
    CONTEXT_AF.el.setAttribute('animation__cpo_pickup_scale', { property:'scale', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.pickupScale.x, y:data.pickupScale.y, z:data.pickupScale.z}, easing:'easeInOutQuad', startEvents:'cpo_pickup'});
  },
  setDropAnimations : function()
  {
    const CONTEXT_AF = this;
    const data = this.data;

    CONTEXT_AF.el.setAttribute('animation__cpo_position', { property:'position', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z}, easing:'easeInOutQuad', startEvents:'cpo_drop_position'});
    CONTEXT_AF.el.setAttribute('animation__cpo_rotation', { property:'rotation', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropRotation.x, y:data.dropRotation.y, z:data.dropRotation.z}, easing:'easeInOutQuad', startEvents:'cpo_drop_rotation'});
    CONTEXT_AF.el.setAttribute('animation__cpo_scale', { property:'scale', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z}, easing:'easeInOutQuad', startEvents:'cpo_drop_scale'});
  }
});