var isOpen = false;

AFRAME.registerComponent('divetable', {
    schema: {},
    init: function () {
      const CONTEXT_AF  = this;
    

      const divetable = document.getElementById('divetable_button');
      divetable.addEventListener('click', trackClick);
    
    
    
    
    }

    
}
);


function trackClick () {

    console.log("dive tbale");
    if (isOpen) {
        // Close action (e.g., hide or reset)
        console.log("Object closed");
        divetable.setAttribute("animation", {
            property: "scale",
            to: "1.0 1.0 1.0",
            dur: 200
          });

          divetable.setAttribute("animation__2", {
            property: "position",
            to: "-0.65 1.6 -0.5",
            dur: 200
          });
          //animation__mouseleave="property:scale; to:1.0 1.0 1.0; startEvents:mouseleave; dur:200"
          //animation__mouseleave__2="property:position; to:-0.65 1.6 -0.5; startEvents:mouseleave; dur:200">
     
    } else {
        // Open action (e.g., show or perform an action)
        console.log("Object opened");

        divetable.setAttribute("animation", {
            property: "scale",
            to: "5 5 5",
            dur: 200
          });

          divetable.setAttribute("animation__2", {
            property: "position",
            to: "0.023 1.6 -0.483",
            dur: 200
          });

          //animation__mouseenter="property:scale; to:5 5 5; startEvents:mouseenter; dur:200"
                            //animation__mouseenter__2="property:position; to:0.023 1.6 -0.483; startEvents:mouseenter; dur:200"
    
      
    }
      isOpen = !isOpen; // Toggle the state

};