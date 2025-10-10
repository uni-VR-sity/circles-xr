# 🤖 NLP Model Insertion System for CirclesXR

## Overview

This system allows users to add 3D models to their CirclesXR prototype scenes using natural language descriptions. Instead of manually selecting and placing models, users can simply describe what they want, and the AI will automatically identify, locate, and insert the appropriate 3D models from your asset library.

## Features

### ✨ Key Capabilities

1. **Natural Language Processing**: Parse user descriptions to identify model requests
2. **Intelligent Model Mapping**: Map natural language terms to specific .glb files
3. **Automatic Positioning**: Smart placement of new models to avoid overlaps
4. **Mixed Content Support**: Works with both primitive shapes and 3D models
5. **Existing Scene Integration**: Add models to existing prototypes without overwriting

## How It Works

### 1. Enhanced NLP Scene Generator

The system extends the existing `nlp-scene-generator.js` with:

- **Model Library Mapping**: Dictionary that maps natural language terms to file paths
- **Intelligent Parsing**: AI recognizes both primitive shapes and model names
- **Validation**: Ensures requested models exist in the asset library

### 2. Model Library Integration

Currently supports the **Miscellaneous Collection**:

```javascript
const MODEL_LIBRARY = {
  'chopstick': '/asset-library/miscellaneous/chopstick.glb',
  'hair comb': '/asset-library/miscellaneous/hair-comb.glb',
  'lipstick': '/asset-library/miscellaneous/lipstick.glb',
  'mannequin': '/asset-library/miscellaneous/mannequin.glb',
  'mirror': '/asset-library/miscellaneous/mirror.glb',
  'pendant': '/asset-library/miscellaneous/pendant.glb',
  'plate': '/asset-library/miscellaneous/plate.glb',
  'traffic cone': '/asset-library/miscellaneous/traffic-cone.glb',
  // ... and many more aliases
};
```

### 3. Smart Model Recognition

The system includes multiple aliases for each model:
- `'hair comb'`, `'comb'` → `hair-comb.glb`
- `'mannequin'`, `'dummy'`, `'model'` → `mannequin.glb`
- `'traffic cone'`, `'cone'`, `'road cone'` → `traffic-cone.glb`

## API Endpoints

### 🔗 `/add-model-to-prototype` (POST)

Add models to an existing prototype using natural language.

**Request Body:**
```json
{
  "prototypeName": "my-prototype",
  "description": "Add a hair comb and a mirror to the scene"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Added 2 object(s) to prototype",
  "addedObjects": [
    {
      "model": "hair comb",
      "modelPath": "/asset-library/miscellaneous/hair-comb.glb",
      "position": ["2", "1", "-5"],
      "rotation": ["0", "0", "0"],
      "type": "model"
    }
  ],
  "sceneElements": "<a-entity gltf-model=\"url:/asset-library/miscellaneous/hair-comb.glb\" position=\"2 1 -5\" rotation=\"0 0 0\"></a-entity>"
}
```

### 🔗 `/generate-scene-from-text` (Enhanced)

The existing endpoint now supports both primitives and models.

**Example Request:**
```json
{
  "description": "Create a red cube next to a mannequin with a mirror behind them"
}
```

## Usage Examples

### 📝 Natural Language Examples

**Simple Model Addition:**
- "Add a hair comb to the scene"
- "Put a mannequin in the center"
- "Place a mirror on the wall"

**Multiple Models:**
- "Add chopsticks and a plate for dining"
- "Put a mannequin with jewelry - pendant and necklace"
- "Create a makeup station with lipstick and a mirror"

**Mixed Content (Primitives + Models):**
- "Add a red box next to a hair comb"
- "Put a blue sphere and a traffic cone in the scene"
- "Create a room with walls and add a mannequin inside"

### 🛠️ Programmatic Usage

```javascript
// Add models to existing prototype
const response = await fetch('/add-model-to-prototype', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prototypeName: 'my-scene',
    description: 'Add a hair comb and lipstick to the scene'
  })
});

// Generate new scene with models
const sceneResponse = await fetch('/generate-scene-from-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Create a beauty salon with mannequin, mirror, and cosmetics'
  })
});
```

## JSON Structure

### Primitive Objects (Existing)
```json
{
  "shape": "box",
  "colour": "red",
  "position": ["0", "1", "-5"],
  "rotation": ["0", "0", "0"],
  "width": "2",
  "height": "1",
  "depth": "1",
  "type": "primitive"
}
```

### Model Objects (New)
```json
{
  "model": "hair comb",
  "modelPath": "/asset-library/miscellaneous/hair-comb.glb",
  "position": ["3", "1", "-5"],
  "rotation": ["0", "0", "0"],
  "type": "model"
}
```

## A-Frame Integration

Models are automatically converted to A-Frame elements:

```html
<!-- Primitive Shape -->
<a-entity geometry="primitive:box; width:2; height:1; depth:1;" 
          material="color:red;" 
          position="0 1 -5" 
          rotation="0 0 0">
</a-entity>

<!-- 3D Model -->
<a-entity gltf-model="url:/asset-library/miscellaneous/hair-comb.glb" 
          position="3 1 -5" 
          rotation="0 0 0">
</a-entity>
```

## Smart Positioning

The system includes automatic positioning logic:

1. **Existing Scene Analysis**: Analyzes current object positions
2. **Conflict Avoidance**: Places new objects to avoid overlaps
3. **Logical Spacing**: Maintains reasonable distances between objects
4. **Y-Axis Awareness**: Ensures objects are placed above ground level

## Extending the Model Library

To add new model collections:

```javascript
// In nlp-scene-generator.js
const MODEL_LIBRARY = {
  // Existing miscellaneous models...
  
  // Add new collections
  'classroom': {
    'desk': '/asset-library/classroom/desk.glb',
    'chair': '/asset-library/classroom/chair.glb',
    'whiteboard': '/asset-library/classroom/whiteboard.glb',
  },
  
  'science': {
    'beaker': '/asset-library/science-props/beaker.glb',
    'microscope': '/asset-library/science-props/microscope.glb',
  }
};
```

## Error Handling

The system provides comprehensive error handling:

- **Model Not Found**: "No valid objects could be generated from the description"
- **Prototype Missing**: "Prototype not found"
- **Invalid Input**: "Prototype name and description are required"
- **File System Errors**: "Failed to save updated prototype"

## Demo Interface

A demo HTML page is available at `/prototypes/nlp-model-demo.html` that provides:

- Interactive testing interface
- Model library documentation
- Example prompts
- Real-time API testing
- Response visualization

## Performance Considerations

- **Model Validation**: Only validated models are added to scenes
- **Object Limits**: Maximum 50 objects per scene to prevent performance issues
- **Efficient Mapping**: Fast dictionary lookups for model resolution
- **Smart Caching**: Model paths are resolved once and cached

## Future Enhancements

### Planned Features

1. **Advanced Positioning**: Room-aware placement, surface detection
2. **Model Scaling**: Automatic size adjustment based on context
3. **Relationship Understanding**: "Put X next to Y", "Place Z on top of A"
4. **Multi-Collection Support**: Expand beyond miscellaneous models
5. **Voice Integration**: Voice-to-text for hands-free model addition
6. **Undo/Redo**: Scene modification history
7. **Model Variants**: Support for different versions of the same model

### Technical Improvements

1. **Dynamic Model Discovery**: Auto-scan asset library for new models
2. **Semantic Similarity**: Use embeddings for better model matching
3. **Context Awareness**: Remember previous additions for better positioning
4. **Batch Operations**: Add multiple model sets in single operations

## Usage Statistics

Track usage patterns to improve the system:

```javascript
// Example metrics to collect
{
  "popular_models": ["mannequin", "mirror", "hair comb"],
  "common_phrases": ["add to scene", "put in center", "place next to"],
  "success_rate": 0.95,
  "average_models_per_request": 2.1
}
```

---

## Quick Start

1. **Add models to existing prototype:**
   ```bash
   curl -X POST http://localhost:3000/add-model-to-prototype \
   -H "Content-Type: application/json" \
   -d '{"prototypeName": "test", "description": "Add a hair comb"}'
   ```

2. **Test with demo interface:**
   Visit `/prototypes/nlp-model-demo.html` in your browser

3. **Extend model library:**
   Edit `MODEL_LIBRARY` in `nlp-scene-generator.js`

This NLP Model Insertion System transforms how users interact with 3D content creation, making it as easy as describing what you want in plain English! 🚀 