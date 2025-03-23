'use strict';

AFRAME.registerComponent('circles-model', 
{
    schema: { type: 'string' },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.modelMesh = null;
        this.complete = false;

        // Loading model
        const gltfLoader = new THREE.GLTFLoader();

        gltfLoader.load(schema, (gltf) => 
        {
            this.el.setObject3D('mesh', gltf.scene || gltf.scenes[0]);
            this.complete = true;
        },
        (xhr) => {},
        (error) =>
        {
            console.log('circles-model: ' + schema + " not found");
            this.complete = true;
        });
    },

    // Returning if model is loaded
    isComplete: function()
    {
        return this.complete;
    },
});