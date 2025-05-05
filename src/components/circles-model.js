'use strict';

AFRAME.registerComponent('circles-model', 
{
    schema: { type: 'string' },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.model = null;
        this.format = null;
        this.complete = false;

        // Loading model based on file type
        if (schema.endsWith('.gltf') || schema.endsWith('.glb'))
        {
            this.format = 'gltf';
            this.gltfLoader();
        }
        else if (schema.endsWith('.fbx'))
        {
            this.format = 'fbx';
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
            this.model = gltf;
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
            this.model = fbx;
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
    getModel: function()
    {
        return this.model;
    },
    // Returning model format
    getFormat: function()
    {
        return this.format;
    }
});