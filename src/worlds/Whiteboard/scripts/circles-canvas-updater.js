'use strict';

// Refreshing canvas texture:
// https://aframe.io/docs/1.4.0/components/material.html#canvas-textures
// https://aframe.io/aframe/examples/test/canvas-texture/

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Component
AFRAME.registerComponent('circles-canvas-updater', 
{
    dependencies: ['geometry', 'material'],
  
    tick: function () 
    {
      var el = this.el;
      var material;
  
      material = el.getObject3D('mesh').material;

      if (!material.map) 
      { 
        return; 
      }

      material.map.needsUpdate = true;
    }
});