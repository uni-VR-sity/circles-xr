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

        // Loading model based on file type
        if (schema.endsWith('.gltf') || schema.endsWith('.glb'))
        {
            this.gltfLoader();
        }
        else if (schema.endsWith('.fbx'))
        {
            this.fbxLoader();
        }
        else
        {
            console.log('circles-model: ' + schema + ' invalid file type');
        }
    },
    // Loading gltf or glb model
    gltfLoader: function()
    {
        const element = this.el;
        const schema = this.data;

        const gltfLoader = new THREE.GLTFLoader();

        gltfLoader.load(schema, (gltf) => 
        {
            this.modelMesh = gltf.scene || gltf.scenes[0];
            this.complete = true;
        },
        undefined,
        (error) =>
        {
            console.log('circles-model: ' + schema + " not found");
            this.complete = true;
        });
    },
    // Loading fbx model
    fbxLoader: function()
    {
        const element = this.el;
        const schema = this.data;

        const fbxLoader = new THREE.FBXLoader();

        fbxLoader.load(schema, (fbx) => 
        {
            this.modelMesh = fbx;
            this.complete = true;
        },
        undefined,
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

    // Returning model mesh
    getMesh: function()
    {
        return this.modelMesh;
    }
});