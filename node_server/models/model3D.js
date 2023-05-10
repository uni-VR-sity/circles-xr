'use strict';

//database
const mongoose  = require('mongoose');

const Model3DSchema = new mongoose.Schema({
  name: {
    type:       String,
    unique:     true,
    required:   true,
    trim:       true
  },
  url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  type: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  },
  format3D: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  }
});

const Model3D = mongoose.model('model3D', Model3DSchema);

const addModels = async function()
{
  let count = await Model3D.countDocuments();

  if (count > 0)
  {
    console.log('Models already added to database');
  }
  else
  {
    let modelsToAdd = new Array();

    //head
    modelsToAdd.push({
      name:           "Head_Circle",
      url:            '/global/assets/models/gltf/head/Head_Circle.glb',
      type:           CIRCLES.MODEL_TYPE.HEAD,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Head_Jaw",
      url:            '/global/assets/models/gltf/head/Head_Jaw.glb',
      type:           CIRCLES.MODEL_TYPE.HEAD,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Head_Oval",
      url:            '/global/assets/models/gltf/head/Head_Oval.glb',
      type:           CIRCLES.MODEL_TYPE.HEAD,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Head_Square",
      url:            '/global/assets/models/gltf/head/Head_Square.glb',
      type:           CIRCLES.MODEL_TYPE.HEAD,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Head_Thin",
      url:            '/global/assets/models/gltf/head/Head_Thin.glb',
      type:           CIRCLES.MODEL_TYPE.HEAD,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    //hairs
    modelsToAdd.push({
      name:           "Hair_Curly",
      url:            '/global/assets/models/gltf/hair/Hair_Curly.glb',
      type:           CIRCLES.MODEL_TYPE.HAIR,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Hair_Hat",
      url:            '/global/assets/models/gltf/hair/Hair_Hat.glb',
      type:           CIRCLES.MODEL_TYPE.HAIR,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Hair_Long",
      url:            '/global/assets/models/gltf/hair/Hair_Long.glb',
      type:           CIRCLES.MODEL_TYPE.HAIR,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Hair_PonyTail",
      url:            '/global/assets/models/gltf/hair/Hair_PonyTail.glb',
      type:           CIRCLES.MODEL_TYPE.HAIR,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Hair_Bald",
      url:            "", //empty string - easy to compare later
      type:           CIRCLES.MODEL_TYPE.HAIR,
      format3D:       CIRCLES.MODEL_FORMAT.NONE //don't show/render
    });

    //bodies
    modelsToAdd.push({
      name:           "Body_Belly",
      url:            '/global/assets/models/gltf/body/Body_Belly.glb',
      type:           CIRCLES.MODEL_TYPE.BODY,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Body_HourGlass",
      url:            '/global/assets/models/gltf/body/Body_Hourglass.glb',
      type:           CIRCLES.MODEL_TYPE.BODY,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Body_Rectangle",
      url:            '/global/assets/models/gltf/body/Body_Rectangle.glb',
      type:           CIRCLES.MODEL_TYPE.BODY,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Body_Strong",
      url:            '/global/assets/models/gltf/body/Body_Strong.glb',
      type:           CIRCLES.MODEL_TYPE.BODY,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    modelsToAdd.push({
      name:           "Body_Thin",
      url:            '/global/assets/models/gltf/body/Body_Thin.glb',
      type:           CIRCLES.MODEL_TYPE.BODY,
      format3D:       CIRCLES.MODEL_FORMAT.GLTF
    });

    let model   = null;
    let error   = null;
    async function findModel(modelToAdd) {
      try {
        model = await Model3D.findOne(modelToAdd).exec();
      } catch(err) {
        error = err;
      }
    }
    async function createModel(modelToAdd) {
      try {
        model = await Model3D.create(modelToAdd);
      } catch(err) {
        error = err;
      }
    }

    for (let i = 0; i < modelsToAdd.length; i++) {
      findModel(modelsToAdd[i]).then(function() {
        if (error) {
          console.log("findModel error on [" + modelsToAdd[i].name + "]: " + error.message);
        }
        else {
          //add model
          createModel(modelsToAdd[i]).then(function() {
            if (error) {
              console.log("createModel error on [" + modelsToAdd[i].name + "]: " + error.message);
            } else {
              console.log("successfully added model: " + model.name);
            }
          });
        }
      });
    }

    console.log('Added models to database');
  }
}

addModels();
module.exports = Model3D;
