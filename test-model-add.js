const fs = require('fs');
const path = require('path');

// Create a test prototype first
const testPrototypeName = 'test-model-prototype';
const prototypePath = path.join(__dirname, 'node_server/public/prototypes/created', testPrototypeName);
const JSONPath = path.join(prototypePath, testPrototypeName + '.json');
const HTMLPath = path.join(prototypePath, testPrototypeName + '.html');

// Create directory if it doesn't exist
if (!fs.existsSync(prototypePath)) {
  fs.mkdirSync(prototypePath, { recursive: true });
}

// Create test prototype JSON with a model object (simulating what the AI would generate)
const testPrototype = {
  title: "Test Model Prototype",
  sceneObjects: [
    {
      shape: "box",
      colour: "red",
      position: ["0", "1", "-5"],
      rotation: ["0", "0", "0"],
      width: "1",
      height: "1",
      depth: "1"
    },
    {
      model: "hair comb",
      modelPath: "/asset-library/miscellaneous/hair-comb.glb",
      position: ["3", "1", "-5"],
      rotation: ["0", "0", "0"],
      scale: ["0.5", "0.5", "0.5"],
      type: "model"
    }
  ]
};

fs.writeFileSync(JSONPath, JSON.stringify(testPrototype, null, 2));

// Create test HTML
const testHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Test Model Prototype</title>
  <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</head>
<body>
  <a-scene>
    <a-box position="0 1 -5" color="red"></a-box>
    <a-entity gltf-model="/asset-library/miscellaneous/hair-comb.glb" position="3 1 -5" scale="0.5 0.5 0.5"></a-entity>
  </a-scene>
</body>
</html>`;

fs.writeFileSync(HTMLPath, testHTML);

console.log('Test prototype created at:', prototypePath);
console.log('JSON content:', JSON.stringify(testPrototype, null, 2));

// Now let's test the createPrototypeElement function directly
const centralServerController = require('./node_server/controllers/centralServerController');

// We can't directly access the function since it's not exported, but we can test by 
// simulating the updatePrototypeHTML call

console.log('\nNow access the prototype at: http://localhost:1111/prototyping');
console.log('Then open the test-model-prototype to see if the hair comb model loads correctly.'); 