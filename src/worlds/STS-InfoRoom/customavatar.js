





// Script for changing the avatar
AFRAME.registerComponent('change-costume', {

    init: function(){

        console.log("running");

        if(CIRCLES.isReady())
        {
            
            CIRCLES.getAvatarElement().querySelector(".user_body").setAttribute('circles-color', {color: 'rgb(227, 94, 11)'});
            CIRCLES.getAvatarElement().querySelector(".user_head").setAttribute('circles-color', {color: 'rgb(47, 47, 47)'});
            //CIRCLES.getAvatarElement().querySelector(".user_hair").setAttribute('circles-color', {color: 'rgb(255, 255, 255)'});
            //CIRCLES.getAvatarElement().querySelector(".user_hair").setAttribute("gltf-model", './assets/models/avatars/helmet.gltf');

            //print(CIRCLES.getAvatarElement().querySelector("#Player1Cam"));
            //.setAttribute('camera', {fov: '44.690'})
           
            console.log("INIT says: Avatar changed");
        }
        else{

            CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, function() {

                CIRCLES.getAvatarElement().querySelector(".user_body").setAttribute('circles-color', {color: 'rgb(227, 94, 11)'});
                CIRCLES.getAvatarElement().querySelector(".user_head").setAttribute('circles-color', {color: 'rgb(47, 47, 47)'});
                //CIRCLES.getAvatarElement().querySelector(".user_hair").setAttribute('circles-color', {color: 'rgb(255, 255, 255)'});
                //CIRCLES.getAvatarElement().querySelector(".user_hair").setAttribute("gltf-model", './assets/models/avatars/helmet.gltf');
            
                //print(CIRCLES.getAvatarElement().querySelector("#Player1Cam"));
                //console.log("Dani says: Avatar changed");

            });

        }

    }
   
});



// circles-head-model="__MODEL_HEAD__"
//             circles-hair-model="__MODEL_HAIR__"
//             circles-body-model="__MODEL_BODY__"
//             circles-head-color="__COLOR_HEAD__"
//             circles-hair-color="__COLOR_HAIR__"
//             circles-body-color="__COLOR_BODY__"