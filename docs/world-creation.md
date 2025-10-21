# World Creation

<br>

## Getting Started

To get started, if you have not done so already, create a worlds folder in your project folder. Inside that worlds folder, create a folder for your new world with the following files:
- index.html
- profile.jpg (optional)
- settings.json (optional)

<br>

## index.html

index.html contains all the objects in your world. 

<br>

### Circles' Entities

The following are the Circles' HTML entities that are required for the world to properly connect to the framework:

| Entity                                | Description                                                                       |
| :---                                  | :---                                                                              |
| `<circles-start-scripts/>`            | Adds required header scripts                                                      |
| `<circles-basic-ui/>`                 | (Optional) Creates user options UI (ex. home button)                              |
| `<circles-start-ui/>`                 | (Optional) Creates enter UI to capture a user gesture for sound/mic access etc.   |
| `<a-scene circles_scene_properties>`  | Adds Circles scene properties                                                     |
| `<circles-assets/>`                   | Adds Circles built-in assets                                                      |
| `<circles-manager-avatar/>`           | Creates default player avatar and adds its manager                                |
| `<circles-end-scripts/>`              | Adds required end scripts                                                         |

<br>

By default, your world will have a player avatar and avatar networking. 

To remove the player avatar, replace:
- `<circles-start-ui/>` -> `<circles-NA-start-ui>`
- `<circles-manager-avatar/>` -> `<circles-NA-manager-avatar>`

To remove networking, replace:
- `<a-scene circles_scene_properties>` -> `<a-scene circles_NN_scene_properties>`
- `<circles-end-scripts/>` -> `<circles-NN-end-scripts/>`

<br>

### File Structure

The following is how index.html should be structured with the circles' entities:

```html
<html>

    <head>

        <!-- Circles' head scripts [REQUIRED] -->
        <circles-start-scripts/>

        <!-- Add your scripts here -->

    </head>

    <body>

        <!-- 2D UI elements overylayed on the 3D scene for user options -->
        <circles-basic-ui/>

        <!-- 2D enter UI overylayed on the 3D scene to capture a user gesture for sound/mic access etc. -->
        <circles-start-ui/>

        <!-- a-scene with 'circles-properties' component [REQUIRED] -->
        <a-scene circles_scene_properties>

            <a-assets>

                <!-- Add your assets here -->

                <!-- Circles' built-in assets [REQUIRED] -->
                <circles-assets/>

            </a-assets>

            <!-- Circles' built-in manager and avatar [REQUIRED] -->
            <circles-manager-avatar/>

            <!-- Add your code here (A-frame, Circles XR, and custom components) -->

        </a-scene>

        <!-- Circles' end scripts [REQUIRED] -->
        <circles-end-scripts/>

    </body>

<html>
```

<br>

## profile.jpg

profile.jpg is the image that appears on the explore page. If it is not specified, a default image will be used.

<br>

## settings.json

settings.json contains the world description that appears on the explore page. The following are the default section options:

```json
{
    "world": {
        "name": "",
        "credit": "",
        "description": "",
        "contact": [ "" ]
    }
}
```

<br>

Additional sections can be specified under `extraInfo`:
```json
{
    "world": {
        "extraInfo": [
            {
                "title": "",
                "description": ""
            }
        ]
    }
}
```

<br>