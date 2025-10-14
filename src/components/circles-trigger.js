'use strict';

AFRAME.registerComponent('circles-trigger', 
{
    schema:
    {
        color:              {type:'color',      default:'rgb(0,255,0)'},
        isEnabled:          {type:'bool',       default:true},
        isEventsEnabled:    {type:'bool',       default:true},
        isVisible:          {type:'bool',       default:true},
        opacity:            {type:'float',      default:'0.5'},
        radius:             {type:'float',      default:2.0},
        targetId:           {type:'string',     default:'#Player1'}
    }, 
    init: function ()
    {      
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;

        CONTEXT_AF.isEventsEnabled = data.isEventsEnabled;
        CONTEXT_AF.isEnabled = data.isEnabled;
        CONTEXT_AF.isEnabled = data.isEnabled;
        CONTEXT_AF.radius = data.radius;
        CONTEXT_AF.radiusSq = CONTEXT_AF.radius * CONTEXT_AF.radius;
        // Cache element and object3D references. Avoid reading attributes every frame.
        CONTEXT_AF.targetElement = document.querySelector(data.targetId);
        CONTEXT_AF.targetObj3D = CONTEXT_AF.targetElement && CONTEXT_AF.targetElement.object3D;
        CONTEXT_AF.triggerObj3D = CONTEXT_AF.el && CONTEXT_AF.el.object3D;

        // Pre-allocate vectors for distance calculations to avoid per-frame allocations.
        CONTEXT_AF.targetPos = new THREE.Vector3();
        CONTEXT_AF.triggerPos = new THREE.Vector3();
        
        // Read world positions into pre-allocated vectors to avoid object creation
        CONTEXT_AF.triggerObj3D.getWorldPosition(CONTEXT_AF.triggerPos);

        // add classes
        if (!CONTEXT_AF.el.classList.contains('circles-trigger')) 
        {
            CONTEXT_AF.el.classList.add('circles-trigger');
        }

        // create, init, and append trigger visual
        let triggerVisual = document.createElement('a-entity');
        triggerVisual.setAttribute('geometry', {primitive:'ring', radiusInner:CONTEXT_AF.radius - 0.1, radiusOuter:CONTEXT_AF.radius, segmentsTheta:64});
        triggerVisual.setAttribute('material', {color:data.color, side:'double', opacity:data.opacity});
        triggerVisual.setAttribute('rotation', {x:-90, y:0, z:0});
        triggerVisual.setAttribute('visible', data.isVisible);
        CONTEXT_AF.el.appendChild(triggerVisual);
    },
    tick: function ()
    {
        const CONTEXT_AF = this;

        if (!CONTEXT_AF.isEnabled) return;
            
        CONTEXT_AF.checkDistance();
    },
    checkDistance: function()
    {
        const CONTEXT_AF = this;

        // Ensure object3D references exist
        if (!CONTEXT_AF.targetObj3D || !CONTEXT_AF.triggerObj3D) return;

        // Read world positions into pre-allocated vectors to avoid object creation
        CONTEXT_AF.targetObj3D.getWorldPosition(CONTEXT_AF.targetPos);

        // Use squared distance to avoid the expensive Math.sqrt call
        let distanceSq = CONTEXT_AF.targetPos.distanceToSquared(CONTEXT_AF.triggerPos);

        if (distanceSq < CONTEXT_AF.radiusSq)
            {
            if (!CONTEXT_AF.isTriggered)
            {
                CONTEXT_AF.isTriggered = true;

                this.emitEvent(CIRCLES.EVENTS.TRIGGER_ENTER);
            }
        }
        else if (CONTEXT_AF.isTriggered)
        {
            CONTEXT_AF.isTriggered = false;

            this.emitEvent(CIRCLES.EVENTS.TRIGGER_EXIT);
        }
    }, 
    setEnabled: function(isEnabled)
    {
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;

        CONTEXT_AF.isEnabled = isEnabled;

        CONTEXT_AF.el.setAttribute('visible', CONTEXT_AF.isEnabled && data.isVisible);
    },
    emitEvent: function(eventName)
    {
        const CONTEXT_AF = this;

        if (!CONTEXT_AF.isEventsEnabled) return;

        CONTEXT_AF.el.emit(eventName, {triggerId: CONTEXT_AF.el.id});
    }
});