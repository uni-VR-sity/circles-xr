'user strict'

AFRAME.registerComponent('testing-events', {
    
    init : function() {
        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, (e) => {
            console.log('CIRCLES.EVENTS.READY!');
        });

        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.EXPERIENCE_ENTERED, (e) => {
            console.log('CIRCLES.EVENTS.EXPERIENCE_ENTERED!');
        });

        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.PICKUP_OBJECT, (e) => {
            console.log('CIRCLES.EVENTS.PICKUP_OBJECT! ' + e.detail.id);
        });

        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.RELEASE_OBJECT, (e) => {
            console.log('CIRCLES.EVENTS.RELEASE_OBJECT! ' + e.detail.id);
        });

        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.USER_CONNECTED, (e) => {
            console.log('CIRCLES.EVENTS.USER_CONNECTED! id' + e.detail.id + ' world:' + e.detail.world + ' device:' + e.detail.device);
        });

        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.USER_DISCONNECTED, (e) => {
            console.log('CIRCLES.EVENTS.USER_DISCONNECTED! id' + e.detail.id + ' world:' + e.detail.world + ' device:' + e.detail.device);
        });
    }
});