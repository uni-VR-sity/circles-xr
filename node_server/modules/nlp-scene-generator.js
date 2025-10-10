const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const env = require('./env-util');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY, // Make sure to add this to your .env file
});

// Model mapping for natural language to file paths
const MODEL_LIBRARY = {
  // Miscellaneous models
  'chopstick': '/asset-library/miscellaneous/chopstick.glb',
  'chopsticks': '/asset-library/miscellaneous/chopstick-pair.glb',
  'chopstick pair': '/asset-library/miscellaneous/chopstick-pair.glb',
  'hair comb': '/asset-library/miscellaneous/hair-comb.glb',
  'comb': '/asset-library/miscellaneous/hair-comb.glb',
  'lipstick': '/asset-library/miscellaneous/lipstick.glb',
  'makeup': '/asset-library/miscellaneous/lipstick.glb',
  'mah jong': '/asset-library/miscellaneous/mah-jong-cube.glb',
  'mahjong': '/asset-library/miscellaneous/mah-jong-cube.glb',
  'mah-jong': '/asset-library/miscellaneous/mah-jong-cube.glb',
  'game cube': '/asset-library/miscellaneous/mah-jong-cube.glb',
  'mannequin': '/asset-library/miscellaneous/mannequin.glb',
  'dummy': '/asset-library/miscellaneous/mannequin.glb',
  'model': '/asset-library/miscellaneous/mannequin.glb',
  'mannequin with necklace': '/asset-library/miscellaneous/mannequin-pendant-necklace.glb',
  'mirror': '/asset-library/miscellaneous/mirror.glb',
  'looking glass': '/asset-library/miscellaneous/mirror.glb',
  'pendant': '/asset-library/miscellaneous/pendant.glb',
  'jewelry': '/asset-library/miscellaneous/pendant.glb',
  'necklace': '/asset-library/miscellaneous/pendant-necklace.glb',
  'pendant necklace': '/asset-library/miscellaneous/pendant-necklace.glb',
  'plate': '/asset-library/miscellaneous/plate.glb',
  'dish': '/asset-library/miscellaneous/plate.glb',
  'dinner plate': '/asset-library/miscellaneous/plate.glb',
  'traffic cone': '/asset-library/miscellaneous/traffic-cone.glb',
  'cone': '/asset-library/miscellaneous/traffic-cone.glb',
  'road cone': '/asset-library/miscellaneous/traffic-cone.glb',
  'orange cone': '/asset-library/miscellaneous/traffic-cone.glb',
};

// Model-specific scale settings to ensure consistent sizes
const MODEL_SCALES = {
  '/asset-library/miscellaneous/chopstick.glb': ["1.0", "1.0", "1.0"],
  '/asset-library/miscellaneous/chopstick-pair.glb': ["1.0", "1.0", "1.0"],
  '/asset-library/miscellaneous/hair-comb.glb': ["0.8", "0.8", "0.8"],
  '/asset-library/miscellaneous/lipstick.glb': ["0.6", "0.6", "0.6"],
  '/asset-library/miscellaneous/mah-jong-cube.glb': ["0.5", "0.5", "0.5"],
  '/asset-library/miscellaneous/mannequin.glb': ["0.3", "0.3", "0.3"],
  '/asset-library/miscellaneous/mannequin-pendant-necklace.glb': ["0.3", "0.3", "0.3"],
  '/asset-library/miscellaneous/mirror.glb': ["0.4", "0.4", "0.4"],
  '/asset-library/miscellaneous/pendant.glb': ["0.7", "0.7", "0.7"],
  '/asset-library/miscellaneous/pendant-necklace.glb': ["0.7", "0.7", "0.7"],
  '/asset-library/miscellaneous/plate.glb': ["0.5", "0.5", "0.5"],
  '/asset-library/miscellaneous/traffic-cone.glb': ["0.4", "0.4", "0.4"],
};

// Function to find model based on natural language input
const findModelByDescription = (description) => {
  const lowerDesc = description.toLowerCase();
  
  // Direct match first
  if (MODEL_LIBRARY[lowerDesc]) {
    return MODEL_LIBRARY[lowerDesc];
  }
  
  // Partial match - find the best match
  const matches = Object.keys(MODEL_LIBRARY).filter(key => 
    lowerDesc.includes(key) || key.includes(lowerDesc)
  );
  
  if (matches.length > 0) {
    // Return the longest match (most specific)
    const bestMatch = matches.reduce((a, b) => a.length > b.length ? a : b);
    return MODEL_LIBRARY[bestMatch];
  }
  
  return null;
};

// Function to get the appropriate scale for a model
const getModelScale = (modelPath) => {
  return MODEL_SCALES[modelPath] || ["0.5", "0.5", "0.5"]; // Default fallback
};

// Function to get available models list for AI prompt
const getAvailableModelsString = () => {
  const modelNames = Object.keys(MODEL_LIBRARY);
  return modelNames.join(', ');
};

const convertTextToSceneJSON = async (description) => {
  const availableModels = getAvailableModelsString();
  
  const systemPrompt = `You are a VR scene generator. Convert natural language descriptions to CirclesXR JSON format.

  IMPORTANT: Reply ONLY with valid JSON. No markdown, no explanation, just JSON.
  
  You can create two types of objects:
  1. PRIMITIVE SHAPES: box, sphere, cylinder, cone, plane, ring, torus
  2. 3D MODELS: ${availableModels}
  
  For PRIMITIVE SHAPES:
  - Use "shape" property
  - Position format: [x, y, z] where y is height, x/z are horizontal
  - Colors: Use standard color names or hex codes
  - Size properties: width, height, depth (for box), radius (for sphere, cylinder)
  
  For 3D MODELS:
  - Use "model" property instead of "shape"
  - Set "model" to the model name (e.g., "hair comb", "lipstick", "mannequin")
  - No size properties needed for models
  - Position and rotation still apply
  - Colors may not apply to models
  
  Rules:
  - Always return a JSON object with "sceneObjects" array
  - Position values must be strings
  - Y position should be > 0 for objects on ground
  - Space objects reasonably (2-5 units apart)
  - Use reasonable sizes (1-3 units typically)
  - When user mentions a specific model name, use the "model" property
  
  Example output with mixed objects:
  {
    "sceneObjects": [
      {
        "shape": "box",
        "colour": "red",
        "position": ["0", "1", "-5"],
        "rotation": ["0", "0", "0"],
        "width": "2",
        "height": "1",
        "depth": "1"
      },
      {
        "model": "hair comb",
        "position": ["3", "1", "-5"],
        "rotation": ["0", "0", "0"]
      }
    ]
  }
  
  Remember: Respond with ONLY JSON, nothing else.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: description }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    let content = response.choices[0].message.content.trim();
    
    // Remove any markdown code blocks if present
    if (content.startsWith('```json')) {
      content = content.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/```\s*/, '').replace(/\s*```$/, '');
    }
    
    const result = JSON.parse(content);
    return result.sceneObjects || [];
  } catch (error) {
    console.error('OpenAI API Error:', error);
    if (error.message.includes('JSON')) {
      throw new Error('AI returned invalid JSON format. Please try again.');
    }
    throw new Error('Failed to generate scene from description');
  }
};

const validateSceneJSON = (sceneObjects) => {
  const validShapes = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'ring', 'torus'];
  const maxObjects = 50; // Prevent performance issues
  
  if (!Array.isArray(sceneObjects)) {
    return [];
  }

  return sceneObjects
    .filter(obj => obj && typeof obj === 'object')
    .filter(obj => {
      // Must have either shape or model property
      return obj.shape || obj.model;
    })
    .filter(obj => {
      // If has shape, must be valid shape
      if (obj.shape && !validShapes.includes(obj.shape)) {
        return false;
      }
      // If has model, must be available in library
      if (obj.model && !findModelByDescription(obj.model)) {
        return false;
      }
      return true;
    })
    .slice(0, maxObjects)
    .map(obj => {
      // Ensure required fields exist with defaults
      const validated = {
        position: obj.position || ["0", "1", "-5"],
        rotation: obj.rotation || ["0", "0", "0"]
      };

      // Handle models vs shapes
      if (obj.model) {
        validated.model = obj.model;
        validated.modelPath = findModelByDescription(obj.model);
        validated.type = 'model';
        // Use model-specific scale for consistent sizing
        validated.scale = obj.scale || getModelScale(validated.modelPath);
      } else {
        validated.shape = obj.shape || 'box';
        validated.colour = obj.colour || obj.color || 'grey';
        validated.type = 'primitive';
        
        // Add size properties based on shape
        if (validated.shape === 'box') {
          validated.width = obj.width || "1";
          validated.height = obj.height || "1";
          validated.depth = obj.depth || "1";
        } else if (['sphere', 'cylinder'].includes(validated.shape)) {
          validated.radius = obj.radius || "0.5";
          if (validated.shape === 'cylinder') {
            validated.height = obj.height || "1";
          }
        }
      }

      // Ensure position values are strings
      if (Array.isArray(validated.position)) {
        validated.position = validated.position.map(val => String(val));
      }

      // Ensure rotation values are strings
      if (Array.isArray(validated.rotation)) {
        validated.rotation = validated.rotation.map(val => String(val));
      }

      // Add ID if provided
      if (obj.id) {
        validated.id = obj.id;
      }

      return validated;
    });
};

module.exports = {
  convertTextToSceneJSON,
  validateSceneJSON,
  findModelByDescription,
  getModelScale,
  MODEL_LIBRARY,
  MODEL_SCALES
};


