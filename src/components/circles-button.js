'use strict';

AFRAME.registerComponent('circles-button', {
  schema: {
    type:               {type:'string', default:'box', oneOf:['box', 'cylinder']},
    button_color:       {type:'color', default:'rgb(255, 100, 100)'},
    button_color_hover: {type:'color', default:'rgb(255, 0, 0)'},
    pedastal_color:     {type:'color', default:'rgb(255, 255, 255)'},
    diameter:           {type:'number', default:0.5},
    pedastal_visible:   {type:'boolean', default:true},
    click_on_event:     {type:'string', default:''},
    click_on_event_details:     {type:'string', default:''}, // Ex. "key":"value",
    click_off_event:    {type:'string', default:''},
    click_off_event_details:     {type:'string', default:''}, // Ex. "key":"value",
    target:             {type:'string', default:''},
  },
  init: function () {
    const CONTEXT_AF = this;
    const data = this.data;

    this.clickEvent = this.clickEvent.bind(this);

    CONTEXT_AF.on = false;

    //add classes
    if (!CONTEXT_AF.el.classList.contains('circles-button')) {
      CONTEXT_AF.el.classList.add('circles-button');
    }

    //create button
    CONTEXT_AF.button = document.createElement('a-entity');
    CONTEXT_AF.button.classList.add('button');
    CONTEXT_AF.button.classList.add('interactive');
    CONTEXT_AF.button.setAttribute('position', {x:0, y:0.1, z:0});
    CONTEXT_AF.button.setAttribute('geometry', {primitive:'cylinder', radius:0.3, height:0.2});
    CONTEXT_AF.button.setAttribute('material', {color:'rgb(255,100,100)'});
    CONTEXT_AF.button.setAttribute('animation__mouseenter', {property:'material.color', type:'color', to:'rgb(255, 0, 0)', startEvents:'mouseenter', dur:200});
    CONTEXT_AF.button.setAttribute('animation__mouseleave', {property:'material.color', type:'color', to:'rgb(255, 100, 100)', startEvents:'mouseleave', dur:200});
    CONTEXT_AF.button.setAttribute('animation__click', {property:'position.y', from:0.05, to:0.1, startEvents:'click', dur:300});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.button);  

    //create button pedastal
    CONTEXT_AF.button_pedastal = document.createElement('a-entity');
    CONTEXT_AF.button_pedastal.classList.add('button_pedastal');
    CONTEXT_AF.button_pedastal.setAttribute('position', {x:0, y:0, z:0});
    CONTEXT_AF.button_pedastal.setAttribute('geometry', {primitive:'box', width:0.5, depth:0.5, height:0.6});
    CONTEXT_AF.button_pedastal.setAttribute('material', {color:'rgb(255,255,255)'});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.button_pedastal);

    //if there is a click on event, adding event listener
    if (data.target)
    {
      CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickEvent);
    }
  },
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.type !== data.type) && (data.type !== '') ) {
      if (data.type === 'box') {
        CONTEXT_AF.button_pedastal.setAttribute('geometry', {primitive:'box', width:1.0, depth:1.0, height:0.2});
      }
      else if (data.type === 'cylinder') {
        CONTEXT_AF.button_pedastal.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.2});
      }
      else {
        console.warn("No valid type give for circles-button");
      }
    }

    if ( (oldData.button_color !== data.button_color) && (data.button_color !== '') ) {
      CONTEXT_AF.button.setAttribute('material', {color:data.button_color});
      CONTEXT_AF.button.setAttribute('animation__mouseleave', {property:'material.color', type:'color', to:data.button_color, startEvents:'mouseleave', dur:200});
    }

    if ( (oldData.button_color_hover !== data.button_color_hover) && (data.button_color_hover !== '') ) {
      CONTEXT_AF.button.setAttribute('animation__mouseenter', {property:'material.color', type:'color', to:data.button_color_hover, startEvents:'mouseenter', dur:200});
    }

    if ( (oldData.pedastal_color !== data.pedastal_color) && (data.pedastal_color !== '') ) {
      CONTEXT_AF.button_pedastal.setAttribute('material', {color:data.pedastal_color});
    }

    if ( (oldData.diameter !== data.diameter) && (data.diameter !== '') ) {
      CONTEXT_AF.button.setAttribute('scale', {x:data.diameter, y:1, z:data.diameter});
      CONTEXT_AF.button_pedastal.setAttribute('scale', {x:data.diameter, y:1, z:data.diameter});
    }

    if ( (oldData.pedastal_visible !== data.pedastal_visible) && (data.pedastal_visible !== '') ) {
      CONTEXT_AF.button_pedastal.setAttribute('visible', data.pedastal_visible);
    }

    if (oldData.target !== data.target)
    {
      CONTEXT_AF.el.removeEventListener('click', CONTEXT_AF.clickEvent);

      if (data.target)
      {
        CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickEvent);
      }
    }
  },
  clickEvent : function()
  {
    const CONTEXT_AF = this;
    const data = this.data;

    const targetElement = document.querySelector(data.target);

    if (targetElement)
    {
      if (CONTEXT_AF.on)
      {
        if (data.click_off_event)
        {
          targetElement.emit(data.click_off_event, JSON.parse("{" + data.click_off_event_details + "}"), false);
        }
        else
        {
          targetElement.emit(data.click_on_event, JSON.parse("{" + data.click_on_event_details + "}"), false);
        }
      }
      else
      {
        targetElement.emit(data.click_on_event, JSON.parse("{" + data.click_on_event_details + "}"), false);
      }
  
      CONTEXT_AF.on = !CONTEXT_AF.on;
    }
  }
});