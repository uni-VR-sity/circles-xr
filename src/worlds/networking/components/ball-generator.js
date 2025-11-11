'user strict'

AFRAME.registerComponent('ball-generator', {
    
    schema: {
        color:                      {type:'color'},                             // Ball color
        ball_radius:                {type:'number', default:0.2},               // Radius of size
        ball_radius_deviation:      {type:'number', default:0.0},               // Radius of size
        spawn_position:             {type:'vec3', default:{x:0, y:2, z:0}},     // Where the balls spawn
        spawn_position_deviation:   {type:'number', default:0.0},               // Radius of size
    },

    init() {

        const CONTEXT_AF = this;

        CONTEXT_AF.el.addEventListener('click', (e) => {
            let newBall = document.createElement('a-entity');
            
            newBall.setAttribute('geometry', { primitive:'dodecahedron', radius:CONTEXT_AF.data.ball_radius + THREE.MathUtils.randFloat(-CONTEXT_AF.data.ball_radius_deviation,CONTEXT_AF.data.ball_radius_deviation) });
            newBall.setAttribute('material', { color:CIRCLES.getRandomColor() });
            
            newBall.setAttribute('position', { x:CONTEXT_AF.data.spawn_position.x + THREE.MathUtils.randFloat(-CONTEXT_AF.data.spawn_position_deviation, CONTEXT_AF.data.spawn_position_deviation), 
                                               y:CONTEXT_AF.data.spawn_position.y + THREE.MathUtils.randFloat(-CONTEXT_AF.data.spawn_position_deviation, CONTEXT_AF.data.spawn_position_deviation), 
                                               z:CONTEXT_AF.data.spawn_position.z + THREE.MathUtils.randFloat(-CONTEXT_AF.data.spawn_position_deviation, CONTEXT_AF.data.spawn_position_deviation) });
                
            newBall.setAttribute('circles-pickup-object', {});
            newBall.setAttribute('circles-pickup-networked', {});
            
            CONTEXT_AF.el.sceneEl.append(newBall);
        });
    }
});