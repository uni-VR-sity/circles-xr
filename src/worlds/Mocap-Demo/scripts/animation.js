AFRAME.registerComponent('animation_button', {
    init() {
      const model = document.getElementById('model');
      const CONTEXT_AF = this;
      var currentvalue = 0;
 
      CONTEXT_AF.el.addEventListener('click', () => {
      
        console.log("clicked");
            
            if(currentvalue == 0){

              //animation
              model.setAttribute('animation-mixer', {
                timeScale: 1, });
                //turn the button on
                currentvalue = 1;
                console.log("button pressed on");

            }else{
              
              //animation
              model.setAttribute('animation-mixer', {
                timeScale: 0, });

                currentvalue = 0;
                console.log("button pressed off");
            }
     
      })
    }
  })


  // button for the male dancer (the code needs to be optimized tbh)
  AFRAME.registerComponent('animation_button2', {
    init() {
      const model = document.getElementById('model2');
      const CONTEXT_AF = this;
      var currentvalue = 0;
    // var check = model.querySelector('animation-mixer')
      CONTEXT_AF.el.addEventListener('click', () => {
      
        console.log("clicked");
            
            if(currentvalue == 0){

              //animation
              model.setAttribute('animation-mixer', {
                timeScale: 1, });
                //turn the button on
                currentvalue = 1;
                console.log("button pressed on");

            }else{
              
              //animation
              model.setAttribute('animation-mixer', {
                timeScale: 0, });

                currentvalue = 0;
                console.log("button pressed off");
            }
     
      })
    }
  })

    // button for the second female dancer (the code needs to be optimized tbh)
    AFRAME.registerComponent('animation_button3', {
      init() {
        const model = document.getElementById('model3');
        const CONTEXT_AF = this;
        var currentvalue = 0;
      // var check = model.querySelector('animation-mixer')
        CONTEXT_AF.el.addEventListener('click', () => {
        
          console.log("clicked");
              
              if(currentvalue == 0){
  
                //animation
                model.setAttribute('animation-mixer', {
                  timeScale: 1, });
                  //turn the button on
                  currentvalue = 1;
                  console.log("button pressed on");
  
              }else{
                
                //animation
                model.setAttribute('animation-mixer', {
                  timeScale: 0, });
  
                  currentvalue = 0;
                  console.log("button pressed off");
              }
       
        })
      }
    })


        // button for the second male dancer (the code needs to be optimized tbh)
        AFRAME.registerComponent('animation_button4', {
          init() {
            const model = document.getElementById('model4');
            const CONTEXT_AF = this;
            var currentvalue = 0;
          // var check = model.querySelector('animation-mixer')
            CONTEXT_AF.el.addEventListener('click', () => {
            
              console.log("clicked");
                  
                  if(currentvalue == 0){
      
                    //animation
                    model.setAttribute('animation-mixer', {
                      timeScale: 1, });
                      //turn the button on
                      currentvalue = 1;
                      console.log("button pressed on");
      
                  }else{
                    
                    //animation
                    model.setAttribute('animation-mixer', {
                      timeScale: 0, });
      
                      currentvalue = 0;
                      console.log("button pressed off");
                  }
           
            })
          }
        })