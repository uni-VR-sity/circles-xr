'use strict';

AFRAME.registerComponent('circles-model', 
{
    schema: { type: 'array' },

    init: function()
    {
        const element = this.el;
        const schema = this.data;

        this.increaseQuality = this.increaseQuality.bind(this);

        this.model = null;
        this.format = null;
        this.complete = false;
        this.currentQuality = 0;

        // Loading model
        this.loadModel();

        // Adding event listener to increase model quality
        element.sceneEl.addEventListener('increase-model-quality', this.increaseQuality);
    },

    // Loading model based on file type
    loadModel: function()
    {
        const element = this.el;
        const schema = this.data;

        if (schema[this.currentQuality].endsWith('.gltf') || schema[this.currentQuality].endsWith('.glb'))
        {
            this.format = 'gltf';
            this.gltfLoader();
        }
        else if (schema[this.currentQuality].endsWith('.fbx'))
        {
            this.format = 'fbx';
            this.fbxLoader();
        }
        else
        {
            console.log('circles-model: ' + schema[this.currentQuality] + ' invalid file type');
        }
    },

    // Loading gltf or glb model
    gltfLoader: function()
    {
        const element = this.el;
        const schema = this.data;

        const gltfLoader = new THREE.GLTFLoader();

        gltfLoader.load(schema[this.currentQuality], (gltf) => 
        {
            this.model = gltf;
            this.complete = true;

            element.emit('model-loaded', {model: gltf, format: 'gltf'});
        },
        undefined,
        (error) =>
        {
            console.log('circles-model: ' + schema[this.currentQuality] + " not found");
            this.complete = true;
        });
    },

    // Loading fbx model
    fbxLoader: function()
    {
        const element = this.el;
        const schema = this.data;

        const fbxLoader = new THREE.FBXLoader();

        fbxLoader.load(schema[this.currentQuality], (fbx) => 
        {
            this.model = fbx;
            this.complete = true;

            element.emit('model-loaded', {model: fbx, format: 'fbx'});
        },
        undefined,
        (error) =>
        {
            console.log('circles-model: ' + schema[this.currentQuality] + " not found");
            this.complete = true;
        });
    },

    // Loading next model quality
    increaseQuality: function()
    {
        const element = this.el;
        const schema = this.data;

        if (this.currentQuality != (schema.length - 1))
        {
            this.currentQuality++;
            this.complete = false;

            this.loadModel();
        }
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
    },

    // Returning the max quality avaliable
    getMaxQuality: function()
    {
        const element = this.el;
        const schema = this.data;

        return schema.length - 1;
    }
});