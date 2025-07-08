AFRAME.registerComponent('morph-targets', 
{
    multiple: true,
    schema: 
    {
        value: {type: 'number', default: 0},
        target: {type: 'number', default: 0},
    },
    init: function() {},
    update: function(oldData)
    {
        if (this.el.getObject3D('mesh'))
        {
            console.log(this.el.getObject3D('mesh').children.length + ' models are being animated');
            //console.log(this.data.target + ' is being changed');

            this.el.getObject3D('mesh').children.forEach(morphAssign, this);
            function morphAssign(item){
                //console.log(item.name);
                //console.log(this.data.target + ' is being changed');
                if(item.name != 'body_lod0_mesh' && item.name != 'Hair_S_Messy'){
                    item.morphTargetInfluences[this.data.target] = this.data.value;
                    console.log(item.name);
                }
            }
        }
    }
});