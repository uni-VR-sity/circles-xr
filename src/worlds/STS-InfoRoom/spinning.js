'use strict'

// when you click on the red button the wall start to spin
//and click again stops the animation
AFRAME.registerComponent('spinning-effect', {
    
    
    schema:{
        duration:{type:'number', default:'20000'}
    },
    init: function(){
        console.log("spinning");
       var walls = this; //get the wall element

        //add the animation
        walls.setAttribute('animation', {property:'rotation.y', to:360, loop:true, dur: 20000, easing:'linear', enabled:false})
    
    
    }

    
});