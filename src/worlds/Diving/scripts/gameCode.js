AFRAME.registerComponent('timer', {
    schema: {},
    init: function () {
      const CONTEXT_AF  = this;
     
      //~~~~~~~~~~~~~~~~~~~~text
      const text = document.getElementById('start_text');
      const timer = document.getElementById('timer');
      const endtext = document.getElementById('end_text');
      const bg = document.getElementById('end_bg');
      const endtexts = document.getElementById('end-texts-grp');
      //const totaltime =document.getElementById('endtime');
      const safetytext = document.getElementById('safety-text');

      //~~~~~~~~~~~~~~~~~~~buttons
      const button_timer = document.getElementById('down_button');
      const upbutton = document.getElementById('up_button');
      const startbutton = document.getElementById('start_dive');
      const end_button = document.getElementById('end_button');
      const safetybutton = document.getElementById('safety-check');
      

      //~~~~~~~~~~~~~~~~~~~user variables
      //var diveprofile;
      var safety = false;
      window['reached100ft'] =1;
      console.log("window variable=", reached100ft);

      let timerInterval;

      var stageCounter = 0;
      var upclickCount =0;
      var clickCount;
      var cancelFlag = false;

      window['second'] = 0;
      window['minute'] = 0;
      let add15 = 0;

      //if ther user clicks the buttons
      button_timer.addEventListener('click', trackButtonClick);

      upbutton.addEventListener('click', moveup);

      startbutton.addEventListener('click', startDive);

      end_button.addEventListener('click', endstage);
      

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TIMER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      function runtimer () {

        // Firs twe start by clearing the existing timer, in case of a restart
            // clearInterval(timerInterval);
            // Then we clear the variables
            
                let second = 0,
                   minute = 0,
                   hour = 0;
             // console.log("timer cleared");
           
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

              //  if(window['addminute'] == true)
              //  {
              //   minute++;
              //   console.log("added 1 min");

              //   window['addminute'] = false;
              
              //  }
                
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
         
            
              if(cancelFlag == true)
              {
                clearInterval(timerInterval);
              };
           

          };

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~GAME START~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function startDive()
          {
            //this function is run ONCE to start the game (special 'fake' conditions)
            cancelFlag = 0;
            runtimer();
            console.log("timer started");

            //move player to fake click down 1
            clickCount = 1;
            console.log('Button Click Count:', clickCount);   
            stage1();

            button_timer.classList.add("button");
            
            //start turned on
            startbutton.setAttribute("visible", "false");
            startbutton.classList.remove("interactive");

            safetybutton.setAttribute("visible", "true");
            safetytext.setAttribute("visible", "true");


            button_timer.classList.add("interactive");
            button_timer.setAttribute("visible", "true");

            upbutton.setAttribute("visible", "false");
            upbutton.classList.remove("interactive");

            

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
            console.log('Button Click Count:', stageCounter);           

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
            if(stageCounter == 4)
            {
                stage4();
            }
            if(stageCounter == 5)
            {
              stage5();
            }
            if(stageCounter == 6)
            {
                stage6();
            }
            if(stageCounter == 7)
            {
                stage7();
            }
            if(stageCounter == 8)
            {
                stage8();
            }
            if(stageCounter == 9)
            {
                stage9();
            }
            if(stageCounter == 10)
            {
                stage10();
            }
        
        };


function moveup()
        {
          upclickCount++;
          console.log('UP Click Count:', upclickCount); 
        
          //special origin condition
          if(upclickCount == 1)
          {
              
              document.getElementById('Player1').setAttribute('position', {x:-0.060 , y:24.662, z:-2.317});
              document.getElementById('Player1').setAttribute('rotation', {x:0, y:180, z:0});

                //set the down tracker to stage 0
              stageCounter = 0;
              console.log("move up to origin");

              upbutton.setAttribute("visible", "false");
              upbutton.classList.remove("interactive");

                   //end button off
              end_button.setAttribute("visible", "false");
              end_button.classList.remove("interactive");
              endtext.setAttribute("visible", "false");

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
          if(upclickCount == 4)
          {
            //set the down tracker to stage 1
            stage3();
          }
          if(upclickCount == 5)
          {
            //set the down tracker up a stage
            stage4();
          }
          if(upclickCount == 6)
          {
            //set the down tracker up a stage
            stage5();
          }
          if(upclickCount == 7)
          {
            //set the down tracker up a stage
            stage6();
          }
          if(upclickCount == 8)
          {
            //set the down tracker up a stage
            stage7();
          }
          if(upclickCount == 9)
          {
            //set the down tracker up a stage
            stage8();
          }
          if(upclickCount == 10)
          {
            //set the down tracker up a stage
            stage9();
          }


        };


        function stage1()
        {
          console.log("stage 1")
          document.getElementById('Player1').setAttribute('position', {x:-0.060, y:21, z:-11.47});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

          //end button on
          end_button.setAttribute("visible", "true");
          end_button.classList.add("interactive");
         endtext.setAttribute("visible", "true");

         //up button off
         upbutton.setAttribute("visible", "false");
         upbutton.classList.remove("interactive");
             

              updateRaycaster();
        
          text.setAttribute("text", "value", "Depth: 10 feet");
          //console.log("Moved player 1 to lower position");

          upclickCount = 0;
          console.log('UP Click Count:', upclickCount); 

          stageCounter = 1;
      };


      function stage2()
        {
          console.log("stage 2")
              add15 = 1;
                

                document.getElementById('Player1').setAttribute('position', {x:-0.06, y:16.397, z:-11.47});
                document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});
               
                text.setAttribute("text", "value", "Depth: 15 feet");

                upclickCount = 1;
                console.log('UP Click Count:', upclickCount); 

                //turn up button on
                upbutton.setAttribute("visible", "true");
                upbutton.classList.add("interactive");

                //turn end off
                end_button.setAttribute("visible", "false");
                end_button.classList.remove("interactive");
                endtext.setAttribute("visible", "false");
                
                updateRaycaster();

                clickCount = 2;
          
        };
      function stage3()
        {
          add15 = 1;
                console.log("stage 3")

                document.getElementById('Player1').setAttribute('position', {x:-0.06, y:11, z:-11.47});
                document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

                text.setAttribute("text", "value", "Depth: 20 feet");

                upclickCount = 2;
                console.log('UP Click Count:', upclickCount); 

                stageCounter = 3;
              
      };

      function stage4()
      {
        add15 = 1;
              console.log("stage 4")

              document.getElementById('Player1').setAttribute('position', {x:-0.06, y:7, z:-11.47});
              document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

              text.setAttribute("text", "value", "Depth: 30 feet");

              upclickCount = 3;
              console.log('UP Click Count:', upclickCount); 

              stageCounter =  4;
            
    };

    function stage5()
    {
      add15 = 1;
            console.log("stage 5")

            document.getElementById('Player1').setAttribute('position', {x:-0.06, y:4, z:-3.019});
            document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

            text.setAttribute("text", "value", "Depth: 40 feet");

            upclickCount = 4;
            console.log('UP Click Count:', upclickCount); 

            stageCounter =  5;
          
  };

  function stage6()
  {
    add15 = 1;
          console.log("stage 6")

          document.getElementById('Player1').setAttribute('position', {x:-0.06, y:-3, z:1.273});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

          text.setAttribute("text", "value", "Depth: 50 feet");

          stageCounter =  6;
          upclickCount = stageCounter - 1;
          console.log('UP Click Count:', upclickCount);   
  };

  function stage7()
  {
    add15 = 1;
          console.log("stage 7")

          document.getElementById('Player1').setAttribute('position', {x:15.428, y:-7.035, z:1.27});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

          text.setAttribute("text", "value", "Depth: 60 feet");

          stageCounter =  7;
          upclickCount = stageCounter - 1;
          console.log('UP Click Count:', upclickCount);   
  };

  function stage8()
  {
    add15 = 1;
          console.log("stage 8")

          document.getElementById('Player1').setAttribute('position', {x:16.436, y:-9.421, z:-4.64});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:153, z:0});

          text.setAttribute("text", "value", "Depth: 70 feet");

          stageCounter =  8;
          upclickCount = stageCounter - 1;
          console.log('UP Click Count:', upclickCount);   
  };

  function stage9()
  {
    add15 = 1;
          console.log("stage 9")

          document.getElementById('Player1').setAttribute('position', {x:18, y:-11, z:-31});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:90, z:0});

          text.setAttribute("text", "value", "Depth: 80 feet");

          stageCounter =  9;
          upclickCount = stageCounter - 1;
          console.log('UP Click Count:', upclickCount);   
  };
  function stage10()
  {
    add15 = 1;
          console.log("stage 10")

          document.getElementById('Player1').setAttribute('position', {x:18, y:-20, z:-39});
          document.getElementById('Player1').setAttribute('rotation', {x:0, y:90, z:0});

          text.setAttribute("text", "value", "Depth: 90 feet");

          stageCounter =  10;
          upclickCount = stageCounter - 1;
          console.log('UP Click Count:', upclickCount);   

          
          upbubutton_timertton.setAttribute("visible", "false");
          button_timer.classList.remove("interactive");

          updateRaycaster();
  };

  
  // function stage10()
  // {
  //   add15 = 1;
  //         console.log("stage 10")

  //         document.getElementById('Player1').setAttribute('position', {x:0, y:-1.7, z:-8.8});
  //         document.getElementById('Player1').setAttribute('rotation', {x:0, y:90, z:0});

  //         text.setAttribute("text", "value", "Depth: 90 feet");

  //         stageCounter =  10;
  //         upclickCount = stageCounter - 1;
  //         console.log('UP Click Count:', upclickCount);   
  // };

  function endstage()
  {
 
    cancelInterval();

     //move to the boat
     document.getElementById('Player1').setAttribute('position', {x:-0.060 , y:24.662, z:-2.317});
     document.getElementById('Player1').setAttribute('rotation', {x:0, y:180, z:0});

       //set the down tracker to stage 0
     stageCounter = 0;
     console.log("move up to origin");

     //turn off the button
      //end button off
      end_button.setAttribute("visible", "false");
      end_button.classList.remove("interactive");
      endtext.setAttribute("visible", "false");

      button_timer.setAttribute("visible", "false");
      button_timer.classList.remove("interactive");

      safetybutton.setAttribute("visible", "false");
      safetybutton.classList.remove("interactive");
      safetytext.setAttribute("visible", "false");

      text.setAttribute("visible", "false");

      const pamphelt = document.getElementById('table_ui');
      pamphelt.setAttribute("visible", false);
      updateRaycaster();
 
    //END GAME SCREEN ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    bg.setAttribute('visible', "true");
    endtexts.setAttribute('visible', "true");

    //var dive profile
    // ----> see experiment functions
    //bool safety
    //bool plus100
   

    
  };

  function cancelInterval() {
    clearInterval(timerInterval);
    console.log('Interval canceled.');
  }

 



    }//,
  
  });
