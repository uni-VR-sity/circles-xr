const fs = require('fs');
const path = require('path');

// Test the createPrototypeElement function by manually calling updatePrototypeHTML
const testPrototypeName = 'test-model-prototype';
const prototypePath = path.join(__dirname, 'node_server/public/prototypes/created', testPrototypeName);
const JSONPath = path.join(prototypePath, testPrototypeName + '.json');
const HTMLPath = path.join(prototypePath, testPrototypeName + '.html');

// Read the existing prototype
if (fs.existsSync(JSONPath)) {
  const prototypeData = fs.readFileSync(JSONPath, { encoding: 'utf8', flag: 'r' });
  const prototypeObject = JSON.parse(prototypeData);
  
  console.log('Loaded prototype:', JSON.stringify(prototypeObject, null, 2));
  
  // Now let's manually call the functions to see what happens
  // We'll simulate what updatePrototypeHTML does
  
  // First, let's test the createPrototypeElement function directly
  console.log('\n=== Testing createPrototypeElement function ===');
  
  // Simulate the createPrototypeElement function
  const createPrototypeElement = function(object) {
    console.log('Processing object:', JSON.stringify(object, null, 2));
    
    var element = '<a-entity';

    // Adding id if object has one specified
    if (object.id) {
      element += ' id="' + object.id + '"';
    }

    // Handle 3D models vs primitive shapes
    if (object.model || object.modelPath) {
      // This is a 3D model - prioritize modelPath over model
      let modelPath;
      
      if (object.modelPath) {
        // Use the file path directly
        modelPath = object.modelPath;
        console.log('Using modelPath from object:', modelPath);
      } else if (object.model) {
        // Try to find the model path from the model name
        console.log('Trying to find model path for:', object.model);
        
        // Simplified model library for testing
        const MODEL_LIBRARY = {
          'hair comb': '/asset-library/miscellaneous/hair-comb.glb',
          'comb': '/asset-library/miscellaneous/hair-comb.glb',
        };
        
        modelPath = MODEL_LIBRARY[object.model.toLowerCase()];
        
        if (!modelPath) {
          // Fallback: assume it's already a path
          modelPath = object.model;
          console.log('No model found, using model as path:', modelPath);
        } else {
          console.log('Found model path:', modelPath);
        }
      }
      
      console.log('FINAL MODEL PATH USED:', modelPath);
      
      element += ' gltf-model="' + modelPath + '"';
      
      // Models don't need geometry or material color
    } else {
      // This is a primitive shape
      element += ' geometry="';

      if (object.shape) {
        element += 'primitive:' + object.shape + ';';

        // Adding dimensions
        if (object.height) {
          element += ' height:' + object.height + ';';
        }
        if (object.width) {
          element += ' width:' + object.width + ';';
        }
        if (object.depth) {
          element += ' depth:' + object.depth + ';';
        }
        if (object.radius) {
          element += ' radius:' + object.radius + ';';
        }
      } else {
        element += 'primitive:cube;';
      }

      element += '"';

      // Adding colour if object has one specified
      if (object.colour) {
        element += ' material="color:' + object.colour + ';"';
      }
    }

    // Adding position if object has one specified
    if (object.position) {
      element += ' position="' + object.position[0] + ' ' + object.position[1] + ' ' + object.position[2] + ';"'
    }

    // Adding rotation if object has one specified
    if (object.rotation) {
      element += ' rotation="' + object.rotation[0] + ' ' + object.rotation[1] + ' ' + object.rotation[2] + ';"'
    }

    // Adding scale if object has one specified
    if (object.scale) {
      element += ' scale="' + object.scale[0] + ' ' + object.scale[1] + ' ' + object.scale[2] + ';"'
    }

    element += '></a-entity>';
    
    console.log('Generated element:', element);
    return element;
  };
  
  // Test each scene object
  prototypeObject.sceneObjects.forEach((obj, index) => {
    console.log(`\n--- Processing scene object ${index + 1} ---`);
    const element = createPrototypeElement(obj);
    console.log('Final HTML element:', element);
  });
  
} else {
  console.log('Prototype file not found:', JSONPath);
} 