AFRAME.registerComponent('safetyclick', {
    schema: {},
    init: function () {
        window['safetydone'] = false;

        const button = document.getElementById('safety-check');
        const final_safetytext = document.getElementById('donesafety_response');

        button.addEventListener('mouseover', function() {
            // Change the background color when the element is hovered
            button.setAttribute("material", "color", "light green");
          });

        
          button.addEventListener('click', function() {
            // Your code to handle the click event goes here
            //window['reached100ft'] =2;
            console.log("safety done");

            button.setAttribute("material", "color", "grey");

            window['safetydone'] = true;
            //window['addminute'] = true;
            console.log("safety variable now:",   window['safetydone'] );
            //console.log("add minute now:",   window['addminute'] );
         
            final_safetytext.setAttribute("text", "value", "Yes");
         


          });

        

    }

});