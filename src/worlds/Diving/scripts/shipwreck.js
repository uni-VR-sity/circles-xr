AFRAME.registerComponent('checkpointclick', {
    schema: {},
    init: function () {

        //console.log("shipwreck.js called");

        // const checkpoint1 = document.getElementById('check1');

        //const text = document.getElementById('');
        
        this.el.addEventListener('click', function() {
            // Your code to handle the click event goes here
            window['reached100ft'] =2;
            console.log("depth check number =", reached100ft);

            const text = document.getElementById('start_text');
            text.setAttribute("text", "value", "Warning! Depth: 100+ feet");

            var desc100 = document.getElementById("100ft_desc");
            desc100.setAttribute("text", "value", "Yes");


          });
        

    }

});