AFRAME.registerComponent('timer', {
    schema: {},
    init: function () {
      const CONTEXT_AF  = this;
     
      const text = document.getElementById('start_text');
      const timer = document.getElementById('timer');

      const button_timer = document.getElementById('down_button');
      const upbutton = document.getElementById('up_button');
      const startbutton = document.getElementById('start_dive');

      var stageCounter = 0;
      var upclickCount =0;

      second = 0;
      minute = 0;
      let add15 = 0;

      //if ther user clicks the down button
      button_timer.addEventListener('click', trackButtonClick);

      upbutton.addEventListener('click', moveup);

      startbutton.addEventListener('click', startDive);
      
      function runtimer () {

        // Firs twe start by clearing the existing timer, in case of a restart
            // clearInterval(timerInterval);
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

             if(add15 ==1)
             {
                second += 15;
              console.log("added 15 sec");
              add15 = 0;
              //really FORCE that minute to change!!
              if (second >= 60) {
                minute += 1;
                second = 0;
               } ; 
             }
              
              if (second == 60 && second >= 60) {
               minute++;
                second = 0;
              }
          
              // If we hit 60 minutes "one hour" we reset the minutes and plus an hour
              if (minute == 60) {
                hour++;
                minute = 0;
              }

              //display the text
              timer.setAttribute("text", "value", (hour + " : " + minute + " : " + second));
              console.log("timer changed");

            }, 1000);

          };

function startDive()
          {
            runtimer();
            console.log("timer started");

            //move player to fake click down 1
            clickCount =1;
            console.log('Button Click Count:', clickCount);   
            stage1();

            button_timer.classList.add("button");
            
            startbutton.setAttribute("visible", "false");
            startbutton.classList.remove("interactive");


            button_timer.classList.add("interactive");
            button_timer.setAttribute("visible", "true");

            upbutton.setAttribute("visible", "true");
            upbutton.classList.add("interactive");

            updateRaycaster();
            

            

          };


function updateRaycaster()
{
  const raycasters = CONTEXT_AF.el.sceneEl.querySelectorAll("[raycaster]");
              raycasters.forEach(rc => {
                if (rc.components.raycaster.data) {
                rc.components.raycaster.refreshObjects();
                }
                });
};


          //function to track what stage the user should be at

function trackButtonClick() {          
            stageCounter++;
            console.log('Button Click Count:', clickCount);           

            
    
            if(stageCounter == 1)
            {
                stage1();
            }
            if(stageCounter == 2)
            {
              stage2();
            }
            if(stageCounter == 3)
            {
                stage3();
            }
        
        };


function moveup()
        {
          upclickCount++;
          console.log('UP Click Count:', upclickCount); 
        
          if(upclickCount == 1)
            {
              document.getElementById('Player1').setAttribute('position', {x:0, y:0.050, z:-12.000});
                document.getElementById('Player1').setAttribute('rotation', {x:0, y:180, z:0});

                //set the down tracker to stage 0
                stageCounter = 0;
                console.log("move up to origin");

                upbutton.setAttribute("visible", "false");
              upbutton.classList.remove("interactive");

              updateRaycaster();
                

            }
          if(upclickCount == 2)
          {
            //set the down tracker to stage 1
            stage1();
          }
          if(upclickCount == 3)
          {
            //set the down tracker to stage 1
            stage2();
          }

        };


        function stage1()
        {
          console.log("stage 1")
          document.getElementById('Player1').setAttribute('position', {x:0, y:-6.99, z:-24.33});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:180, z:0});

          upbutton.setAttribute("visible", "true");
          
              upbutton.classList.add("interactive");

              updateRaycaster();
        
          text.setAttribute("text", "value", "Depth: 15 feet");
          console.log("Moved player 1 to lower position");

          upclickCount = 0;
          console.log('UP Click Count:', upclickCount); 

          stageCounter = 1;
      };


      function stage2()
        {
          console.log("stage 2")
              add15 = 1;
                

                document.getElementById('Player1').setAttribute('position', {x:18.420, y:-3.959, z:-36.642});
                document.getElementById('Player1').setAttribute('rotation', {x:-45, y:-45, z:15});
               
                text.setAttribute("text", "value", "Depth: 30 feet");

                upclickCount = 1;
                console.log('UP Click Count:', upclickCount); 

                clickCount = 2;
          
        };
      function stage3()
        {
          add15 = 1;
                console.log("stage 3")

                document.getElementById('Player1').setAttribute('position', {x:19, y:-3.95, z:-100.16});
                document.getElementById('Player1').setAttribute('rotation', {x:-45, y:-45, z:15});

                text.setAttribute("text", "value", "Depth: 90 feet");

                upclickCount = 2;
                console.log('UP Click Count:', upclickCount); 

                stageCounter = 3;
              
      };





        

        // function add15sec()
        // {
        //     second += 15;
        //         console.log("added 15 sec");
        //         //check th eminute quickly
        //         if (second >= 60) {
        //           minute += 1;
        //         //    second = 0;
        //          } ; 
        // };
   

    }//,
  
  });
