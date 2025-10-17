
There are dozens of components created for use within this framework, but the following will likely be the most used, and thus the most significant.

First, some useful functions that may be useful for the creation of your own components:

```js
//get the name of the group we are in (users in a group can only see each other)
CIRCLES.getCirclesGroupName();

//get the name of the Circles' world the user is in
CIRCLES.getCirclesWorldName();

//get the name of the current user
CIRCLES.getCirclesUserName();

//find out if Circles is ready i.e., your avatar is constructed.
CIRCLES.isReady();

//return the avatar element (perhaps we want to add something to the avatar or query for body elements to change their colour).
CIRCLES.getAvatarElement();

//return the rig of the avatar (when we want to move our avatar i.e., teleport them somewhere. or access things like aframe-extra's "movement-controls" to adjust speed, enable/disble etc.)
CIRCLES.getAvatarRigElement();

//return the camera element (from the avatar's point of view, if you want parent things to the camera e.g., adding UIs))
CIRCLES.getMainCameraElement();

//get reference to the Circles manager entity
CIRCLES.getCirclesManagerElement();

//get reference to the Circles manager component
CIRCLES.getCirclesManagerComp();

//returns reference to held element, or null if no held object on this player/client  
CIRCLES.getPickedUpElement();

//to get the non-networked id of an elem (queries the 'circles-object-world' component for the original "id") 
CIRCLES.getNonNetworkedID(elem);

//get communication socket
CIRCLES.getCirclesWebsocket();

//return all avatars in the scene. Yourself and other networked-aframe avatar entities
CIRCLES.getNetworkedAvatarElements();

//return all networked-aframe networked entities (includes avatars and any other objects). You may have to dig into children for the geometry, materials etc.
CIRCLES.getAllNetworkedElements();
```

And now the components available for you.

- [circles-artefact](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-artefact.js):
This is a core component in our framework that explores learning around tools and objects. The circles-artefact allows you to create an object that has textual (and audio) descriptions and narratives, that can be picked up by an user's avatar and manipulated.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | inspectPosition | Vec3            | Adjust the position of artefact when picked up.           | 0 0 0                |
  | inspectRotation | vec3, degrees   | Adjust rotation of artefact when picked up.               | 0 0 0                |
  | inspectScale    | Vec3            | Adjust the size of artefact when picked up.               | 1 1 1                |
  | textRotationY   | number, degrees | Adjust the rotation of the description text. Degrees.     | 0                    |
  | label_on        | boolean         | Whether label is visible/used.                            | true                 |
  | label_text      | string          | Label text.                                               | 'label_text'         |
  | label_offset    | vec3            | Position relative to artefact it is attached to.          | 0 0 0                |
  | label_arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']         | Which way the labels points.                 | 'up'         |
  | description_on  | boolean         | Whether description is visible/used.                            | true                 |
  | descriptionLookAt  | boolean         | Whether description rotates to follow avatar.                            | false                 |
  | description_offset    | vec3            | Position relative to artefact it is attached to.          | 0 1.22 0                |
  | desc_arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']         | Which way the labels points.                 | 'up'         |
  | title           | string          | Title of description.                                     | 'No Title Set'       |
  | title_back      | string          | Title of description on back.                                     | ''       |
  | description     | string          | Description text.                                         | 'No decription set'  |
  | description_back | string          | Description text on back.                                         | ''  |
  | audio           | audio           | Narration audio that can be added to play when artefact picked up.        | ''         |
  | volume          | number          | If there is narration audio attached to this, this controls volume.       | '1.0'         |

  *Example 'circles-artefact' code: Note we are loading in a gltf model sing A-Frame's [gltf-model loader](https://github.com/aframevr/aframe/blob/master/docs/components/gltf-model.md), setting position, rotation, scale, and then setting several properties for the 'circles-artefact.'*

  ```html
  <a-entity id="Artefact_ID"
            position="0 0 0" 
            rotation="0 0 0" 
            scale="1 1 1"
            gltf-model="#model_gltf"
            circles-artefact="
                inspectPosition:      0.0 0.0 0.0;
                inspectScale:         0.5 0.5 0.5;
                inspectRotation:      0 0 0;
                textRotationY:        90;
                descrption_offset:    0 1 0;
                description_on:       true;
                desc_arrow_position:  down;
                label_text:           Some Label;
                label_offset:         0 1 0;
                label_on:             true;
                label_arrow_position: down;
                title:                Some Title;
                description:          Some description text.;
                title_back:           Some Title;
                description_back:     Some description text.;
                audio:                #some-snd; 
                volume:               0.4;" >
  </a-entity>
  ```

- [circles-button](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-button.js): This is a general purpose button that we can use to listen for click events on and trigger our own code or use in combination with another Circles' component i.e., '[circles-sendpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-sendpoint.js), see next below'.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | type               | string, oneOf:['box', 'cylinder']            | Set whether the button pedastal is a cylinder or box shape.                                             | 'box'                  |
  | button_color       | color           | colour of button                                          | 'rgb(255, 100, 100)'                  |
  | button_color_hover | color           | colour of button on mouseover/hover.                      | 'rgb(255, 0, 0)'                      |
  | pedastal_color     | color           | colour of button pedestal                                 | 'rgb(255, 255, 255)'                  |
  | diameter           | number          | set the size of the button                                | 0.5                                   |

  *Example 'circles-button' used in combination with 'circles-sendpoint' to send the player to a far-off checkpoint elsewhere in the world.*
  
  ```html
  <a-entity circles-button="pedastal_color:rgb(74, 87, 95);" circles-sendpoint="target:#door;" position="0 0 0" rotation="90 0 0" scale="0.8 0.8 0.8"></a-entity>
  ```

- [circles-checkpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-checkpoint.js): Attach to to an entity that you wish to act as a navigation checkpoint. Appearance is automatically set.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | offset          | vec3            | Adjust where the player is positioned, relative to checkpoint position.               | 0 0 0                |
  | useDefaultModel | boolean         | Whether the default "green cylinder" used (set false to use your own model).          | true               |

  *Example 'circles-checkpoint' code: Note we are setting position of the checkpoint to also denote where the player is placed after clicking on this checkpoint.*

  ```html
  <a-entity circles-checkpoint position="10 0 9.5"></a-entity>
  ```
- [circles-description](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-description.js): Used to create a large two-sided element to have textual descriptions.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | title_text_front       | string         | Front title text.                                         | '[~20-25 chars] title_front'                |
  | title_text_back        | string         | Back title text.                                          | ''                |
  | description_text_front | string         | Front title text.                                         | '[~240-280 chars] description_front'                |
  | description_text_back  | string         | Front title text.                                         | ''                |
  | offset          | vec3            | Adjust where the label is positioned, relative to rotation origin.               | 0 0 0                |
  | arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']            | Adjust where the player is positioned, relative to checkpoint position.               | 'up'               |
  | lookAtCamera    | boolean            | Whether the label rotates to face the camera.               | true               |
  | updateRate      | number            | How often the lookAtCamera rotates the label, in ms.               | 20                |

  *Example 'circles-description' code: Note that if no back title and description provided the rotate button above is not shown.*

  ```html
  <a-entity id="description_box" position="1.0 2.0 3.0" rotation="0 90 0"
            circles-description=" title_text_front:       Hello!;
                                  description_text_front: I am saying hello.;
                                  title_text_back:        Good-bye!;
                                  description_text_back:  I am saying good-bye.;
                                  offset:                 2 0 0;
                                  arrow_position:         left;
                                  lookAtCamera            :true; "></a-entity>
  ```
- [circles-interactive-object](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-interactive-object.js): Attach to an entity that you wish to be interactive, and add some visual feedback to the object i.e., hover effects like scale, highlight, or an outline. Also have teh ability to quickly add a sound effect to be played during click here.

  _NOTE!!: There needs to be a material on the model before we "extend" it with a "highlight" using the "circles-material-extend-fresnel" component. A gltf likely already has one, but make sure if manually defining a metrial that the "material" attribute is listed **before** this component is added._

    | Property           | Type            | Description                                               | Default Value        |
    |--------------------|-----------------|-----------------------------------------------------------|----------------------|
    | type               | string, oneOf:['outline', 'scale', 'highlight']    | set the hover effect type  | ''               |
    | highlight_color    | color           | colour of highlight                                       | 'rgb(255, 255, 255)' |
    | neutral_scale      | number          | scale of outline highlight with no interaction            | 1.0                  |
    | hover_scale        | number          | scale of outline highlight with a "hover" i.e., mouseover | 1.08                 |
    | click_scale        | number          | scale of outline highlight with a "click"                 | 1.10                 |
    | click_sound        | audio           | sound asset for sound played during click                 | ''                   |
    | click_volume       | number          | volume of sound played during click                       | 0.5                  |
    | enabled            | boolean         | to turn on/off interactivity                              | true                 |

    *Example 'circles-interactive-object'*

    ```html
    <!-- allows us to interact with this element and listen for events i.e., "click", "mouseover", and "mouseleave" -->
    <!-- Important: note that "material" is listed before "circles-interactive-object" because it uses "circles-material-extend-fresnel" -->
    <a-entity material="color:rgb(101,6,23);" geometry="primitive:sphere; radius:0.4" circles-interactive-object="type:highlight"></a-entity>
    ```
- [circles-interactive-visible](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-interactive-visible.js): Attach to an entity that (or one or more of its child nodes) is interactive already, using _circles-interactive-object_, so that when we make it visible/non-visible, all interaction are enabled/disabled also. Otherwise, if you just use A-frame's ['visible' component](https://github.com/aframevr/aframe/blob/master/docs/components/visible.md), you can still click on invisible entities.

  _NOTE: This component attempts to look through all child elements also, o toggle interactive components._  

    | Value              | Description                                                                       |
    |--------------------|-----------------------------------------------------------------------------------|
    | true               | The entity will be rendered and visible (and interactive); the default value.     |
    | false              | The entity will not be rendered and visible (and not interactive).                |

    *Example 'circles-interactive-visible'*

    ```html
    <!-- allows us to hide/show and interactuve object without it being stil interactuve when invisible -->
    <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object circles-interactive-visible="false"></a-entity>

    <!-- child node example -->
    <a-entity id="controls" circles-interactive-visible="false">
      <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object></a-entity>
      <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object></a-entity>
      <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object></a-entity>
    </a-entity>
    ```
- [circles-label](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-label.js): Used to create a small visual label.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | text            | string          | Label test [20-24 characters].               | 'label_text'               |
  | offset          | vec3            | Adjust where the label is positioned, relative to rotation origin.               | 0 0 0                |
  | arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']            | Adjust where the player is positioned, relative to checkpoint position.               | 'up'               |
  | lookAtCamera    | boolean            | Whether the label rotates to face the camera.               | true               |
  | updateRate      | number            | How often the lookAtCamera rotates the label, in ms.               | 20                |

  *Example 'circles-label' code.*

  ```html
  <a-entity circles-label="text:click here; visible:true; offset:1.1 0.2 0; arrow_position:left;"></a-entity>
  ```
- [circles-lookat](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-lookat.js): Attch to an object to have it always facing another element.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | targetElement   | selector        | The element you "this" element to always point towards.                         | null, reverts to player camera  |
  | enabled         | boolean         | Are we still rotating this element towards the target element.                  | 0 0 0                |
  | constrainYAxis  | boolean         | Do we only want the roptation to happen on the y-axis.                          | 0 0 0                |
  | updateRate      | number          | How often the new position is upfdated (in milliseconds).                       | 200               |
  | smoothingOn     | boolean         | Are we smoothing motion between updates.                                        | true                |
  | smoothingAlpha  | number          | How aggressively are we smoothing. Range [0.0, 1.0]. Smaller is more smoothing. | 0.05                |

  *Example 'circles-lookat' code:*

  ```html
  <a-entity id="lookyElement" circles-lookat="targetElement:#myCam; constrainYAxis:true;"></a-entity>
  ```

- [circles-networked-basic](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-networked-basic.js): **_[ Experimental ]_** This component allows the any object to be shared with other connected clients. It also attempts to handle cases of when clients disconnecting, and remove the duplication of networked object basic networked-aframe objects have. Unlike _circles-pickup-networked_ these objects do not need to be interactive and cannot be picked up. This networked component also enables A-Frame's _[text](https://github.com/aframevr/aframe/blob/master/docs/components/text.md)_ to be synched.

  _NOTE!!: ALl circles-networked objects require an element id_

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | networkedEnabled   | boolean         | turn off and on networking of this object to others       | true |
  | networkedTemplate  | string          | Name of networked template                                | CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT |

  *Example 'circles-networked-basic'*

  ```html
  <!-- this object will be synched by the networked between multiple clients -->
  <a-entity id="required-id" circles-networked-basic geometry="primitive:sphere; radius:0.3;"></a-entity>
  ```

- [circles-pickup-object](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pickup-object.js): This component allows you to pickup and drop objects on click.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | pickupPosition     | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep position relative to camera_ |
  | pickupScale        | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep rotation relative to camera_ |
  | dropPosition       | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep scale relative to camera_    |
  | dropPosition       | vec3            | position of object, relative to original parent node, when released      | _if unset, will keep position relative to camera_ |
  | dropRotation       | vec3            | rotation(deg) of object, relative to original parent node, when released | _if unset, will keep rotation relative to camera_ |
  | dropScale          | vec3            | scale of object, relative to original parent node, when released         | _if unset, will keep scale relative to camera_    |
  | animate            | boolean         | whether the object animates between different positions                  | false                        |
  | animateDurationMS  | number          | how long animations take if animate=true               | 400                          |

  *Example 'circles-pickup-object'*

  ```html
  <!-- make sure the object is also interactive -->
  <a-entity circles-pickup-object="animate:false;" circles-interactive-object="type:highlight;"></a-entity>
  ```
- [circles-pickup-networked](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pickup-object.js): **_[ Experimental ]_** This component allows the _circles-pickup-object_ to be shared with other connected clients. It also attempts to handle cases of when clients disconnecting, and remove the duplication of networked object basic networked-aframe objects have.

  _NOTE!!: ALl circles-networked objects require an element id_

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | networkedEnabled   | boolean         | turn off and on networking of this object to others       | true |
  | networkedTemplate  | string          | Name of networked template                                | CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT |

  *Example 'circles-pickup-networked'*

  ```html
  <!-- make sure the object is also interactive and has the circles-pickup-object component -->
  <a-entity id="required-id" circles-pickup-object="animate:false;" circles-interactive-object="type:highlight;" circles-pickup-networked></a-entity>
  ```

- [circles-pdf-loader](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pdf-loader.js): **_[ Experimental ]_** A component to load in PDFs with basic next page annd previous page controls.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | src                | string          | the url to the PDF to be loaded                           | ''                   |
  | scale              | number          | increasing scale increases the resolution of rendered pdf | 1.5                  |

  *Example 'circles-pdf-loader'*

  ```html
  <a-entity circles-pdf-loader="src:/global/assets/pdfs/Scavarelli2020_Article_VirtualRealityAndAugmentedReal.pdf;"></a-entity>
  ```

- [circles-portal](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-portal.js): A simple component that creates a sphere that can be used as clickable hyperlinks to jump between virtual environments.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | img_src            | asset           | a equirectangular texture map                             | CIRCLES.CONSTANTS.DEFAULT_ENV_MAP               |
  | title_text         | string          | an optional label                                         | '' |
  | link_url           | string          | hyperlink of url users will travel to on click            | ''                   |
  | useDefaultModel    | boolean         | Whether the default sphere with outline is used (set false to use your own model).          | true               |

  *Example 'circles-portal'*

  ```html
  <!-- allows us enter the wardrobe "world" to change avatar appearance. Note that it is using a built-in equirectangular texture "WhiteBlue.jpg" -->
  <a-entity id="Portal-Wardrobe" circles-portal="img_src:/global/assets/textures/equirectangular/WhiteBlue.jpg; title_text:Wardrobe; link_url:/w/Wardrobe"></a-entity>
  ```

- [circles-sendpoint](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-sendpoint.js): Attach to to a circles-button or circles-interactive-object entity when you want that button to send them to any checkpoint (with an id that we can point to).

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | target          | selector        | The id of the checkpoint you want to send the player to.  | null                 |

  *Example 'circles-button' used in combination with 'circles-sendpoint' to send the player to a far-off checkpoint elsewhere in the world.*

  ```html
  <a-entity id="checkpoint_far" circles-checkpoint position="30 0 0"></a-entity>

  <!-- click on this button to be sent to the checkpoint above -->
  <a-entity circles-button circles-sendpoint="target:#checkpoint_far;" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
  ```
- [circles-sound](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-sound.js): This is a component that extends A-Frame's [sound component](https://github.com/aframevr/aframe/blob/master/docs/components/sound.md), and connects to enter experience events, so that autoplay sounds do play after enter a Circles world.

    | Property           | Type            | Description                                               | Default Value        |
    |--------------------|-----------------|-----------------------------------------------------------|----------------------|
    | src                | audio          | audio asset                               | ''                  |
    | autoplay           | boolean        | will it play when the app starts.         | false               |
    | type               | string, oneOf: ['basic', 'basic-diegetic', 'basic-nondiegetic', 'dialogue', 'music', 'soundeffect', 'foley', 'ambience', 'artefact']           | By changing type it changes how sound is played i.e., whthere it is spatial (in the world, diegetic) or not spatial (not in the world, a UI element, non-diegetic)                                       | 'basic' |
    | loop                | boolean          | does this sound loop           | false                  |
    | volume              | number          | how loud the sound is | 1.0                 |
    | state               | string, oneOf: ['play', 'stop', 'pause']          | Whether the sound is playing, stopped, or paused                 | 'stop                 |
    | poolSize            | number          | number of simultaneous instances of _this_ sound that can be playing at the same time                | 1                   |

    *Example 'circles-sound'*

    ```html
    <!-- ambient music/sound -->
    <a-entity circles-sound="type:music; src:#ambient_music; autoplay:true; loop:true; volume:0.02;"></a-entity>
    ```
- [circles-spawnpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-spawnpoint.js): Attach to to a circles-checkpoint entity that you wish to act as a spawn point when entering the world. If there are multiple spawnpoints in a single world one is chosen randomly to position the player on.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | n/a             | n/a             | no properties                                             | n/a                  |

  *Example 'circles-checkpoint' set as a 'circles-spawnpoint'*

  ```html
  <a-entity circles-checkpoint circles-spawnpoint position="10 0 9.5"></a-entity>
  ```

  ```html
  <a-entity id="checkpoint_far" circles-checkpoint position="30 0 0"></a-entity>

  <!-- click on this button to be sent to the checkpoint above -->
  <a-entity circles-button circles-sendpoint="target:#checkpoint_far;" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
  ```

- [circles-sphere-env-map](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-sphere-env-map.js): In the [Physical-Based Rendering (PBR)](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/) workflow of A-frame, any "metal" objects will reflect their environment. To make sure metal objects are not reflecting black we must set a [environment map](https://www.reindelsoftware.com/Documents/Mapping/Mapping.html). A common format is to use a [spherical-environment map](https://www.zbrushcentral.com/t/100-free-spherical-environment-maps-200-sky-backgrounds-1000-textures/328672), and this component allows you to add a spherical-env-map to any model. In particular, [gltf models](https://github.com/aframevr/aframe/blob/master/docs/components/gltf-model.md). If not using gltf models you may use the standard A-Frame [material component](https://github.com/aframevr/aframe/blob/master/docs/components/material.md). If while using gltf models you would like to affect some other material properties, i.e, transparency, please consider the [circles-material-override](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-material-override.js) component. 

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | src             | asset           | The id of the spherical environment map image asset.      | ''                 |
  | format          | string          | The format of the image. You likely don't have to change this.      | 'RGBFormat'                 |

  *Example 'circles-sphere-env-map' uses the 'sphericalEnvMap' image asset in the gltf 'model_gltf' reflections below. *

  ```html
  <a-assets>
    <img id='sphericalEnvMap' src='/worlds/ExampleWorld/assets/textures/above_clouds.jpg' crossorigin="anonymous">

    <a-asset-item id="model_gltf"  src="/worlds/ExampleWorld/assets/models/model/scene.gltf" response-type="arraybuffer" crossorigin="anonymous"></a-asset-item>

    <!-- Circles' built-in assets [REQUIRED] -->
    <circles-assets/>
  </a-assets>

  <!-- a gltf model with the spherical-env-map applied -->
  <a-entity gltf-model="#model_gltf" circles-sphere-env-map="src:#sphericalEnvMap"></a-entity>
  ```
