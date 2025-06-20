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
            this.el.getObject3D('mesh').children[0].children[1].morphTargetInfluences[this.data.target] = this.data.value;
        }
    }
});