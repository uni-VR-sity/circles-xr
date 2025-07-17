AFRAME.registerComponent('video-bar', {
    schema: {
        //the video that we have for this demo is 52 seconds long
        video_length: {type: 'int', default: 52},
        //video bar length total size
        video_bl: {type: 'number', default: 2.0},
        //video bar lenght current amount progress filled
        video_blc: {type: 'number', default: 0.0},
        //current time in video
        curTime: {type: 'number', default: 0.0}
    },

    init: function () {
        let sceneEl = document.querySelector('a-scene');
        let curtimeTxt = document.createElement('a-entity');
        let progressBar = document.querySelector('#videoProgressBar');
        let pbp = progressBar.getAttribute('position');
        let data = this.data;
        let h = progressBar.getAttribute('scale').y;
        curtimeTxt.setAttribute('text', {value: Math.floor(data.curTime).toString() + ' / ' + data.video_length.toString()});
        curtimeTxt.setAttribute('position', {x:data.video_bl, y:pbp.y, z:pbp.z})
        curtimeTxt.setAttribute('transparent', 'false'); //by default its true
        curtimeTxt.setAttribute('geometry', {primitive: 'plane', height: h, width: 0});
        curtimeTxt.setAttribute('material', {color: '#888888'});
        curtimeTxt.setAttribute('id', 'curTimeTxt');
        sceneEl.appendChild(curtimeTxt);
    },
    tick: function () {
        let myVideo = document.querySelector('#video3D');
        let progressBar = document.querySelector('#videoProgressBar');
        let curTimeTxt = document.querySelector('#curTimeTxt');
        let data = this.data;

        //only update the bar if it's changing
        if (data.curTime != myVideo.currentTime) {
            //console.log("init time " + data.curTime);
            
            // calculate the new length of the progress bar
            // (curTime / video_length) = percenatge of how far we're in the video
            data.video_blc = (data.curTime / data.video_length) * data.video_bl;
    
            //set the scale of the progress bar
            let pbs = progressBar.getAttribute('scale');
            progressBar.setAttribute('scale', {x:data.video_blc, y:pbs.y, z:pbs.z});

            //set the position of the progressbar
            let pbp = progressBar.getAttribute('position');
            let pbpPosX = (-data.video_bl / 2) + (pbs.x / 2);
            progressBar.setAttribute('position', {x:pbpPosX, y:pbp.y, z:pbp.z});

            //update the time text
            curTimeTxt.setAttribute('text', {value: Math.floor(data.curTime).toString() + ' / ' + data.video_length.toString()});
        };
        //update the time
        data.curTime = myVideo.currentTime;

    }
})