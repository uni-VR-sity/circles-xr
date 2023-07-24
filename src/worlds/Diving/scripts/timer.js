AFRAME.registerComponent('timer_old', {
    schema: {},
    init: function () {
      const CONTEXT_AF  = this;
      const button_timer = document.getElementById('down_button');
      const second_button_timer = document.getElementById('second_down_button');
      const timer = document.getElementById('timer');
      let greenbutton = 0;
      console.log("greenbutton is:" + greenbutton);
      second = 0;
      
     
    
      
       //add event listener for the click
      //bool value for the on/off??
      button_timer.addEventListener('click', function () {
    
        console.log("timer called");
        button_timer.setAttribute("visible", false);
        button_timer.remove()
        second_button_timer.setAttribute("visible", true);
        
        runtimer();
      });

      second_button_timer.addEventListener('click', function () {

        greenbutton = 1;
        //second_button_timer.setAttribute("visible", false);

      });
        
      
      function runtimer () {
      
        //console.log("started");

        // Firs twe start by clearing the existing timer, in case of a restart
            //clearInterval(timerInterval);
            // Then we clear the variables
            
            let second = 0,
                   minute = 0,
                   hour = 0;
             // console.log("timer cleared");
             let timerInterval;
            // Next we set a interval every 1000 ms
            timerInterval = setInterval(function () {
    
              // Next, we add a new second since one second is passed
              second++;


              if(greenbutton == 1)
              {
                second += 15;
                console.log("added 15 sec");
                //check th eminute quickly
                if (second == 60) {
                  minute++;
                   second = 0;
                 }  
                greenbutton = 0;            
               
                }


          
              if (second == 60) {
               minute++;
                second = 0;
              }
          
              // If we hit 60 minutes "one hour" we reset the minutes and plus an hour
              if (minute == 60) {
                hour++;
                minute = 0;
              }

              timer.setAttribute("text", "value", (minute + " : " + second));
              console.log("timer changed");

            }, 1000);

          };

     
 
          

    }//,
  
  });
