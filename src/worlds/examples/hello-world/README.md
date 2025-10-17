
Below is the most basic example, with only a Circles' avatar networked into a scene. Feel free to use [A-Frame](https://aframe.io) components to add [geometry](https://github.com/aframevr/aframe/blob/master/docs/components/geometry.md), [3D models](https://aframe.io/docs/1.4.0/introduction/models.html), [animations](https://github.com/aframevr/aframe/blob/master/docs/components/animation.md), [lights](https://github.com/aframevr/aframe/blob/master/docs/components/light.md), and [load assets](https://aframe.io/docs/1.4.0/core/asset-management-system.html). You may also want to add some [Circles specific components](#circles-components) for navigation, artefacts, buttons etc. 

```html
<html>
    <head>
        <!-- Circles' head scripts [REQUIRED] -->
        <circles-start-scripts/>
    </head>
    <body>
        <!-- this is used to create our enter UI that creates a 2D overlay to capture a user gesture for sound/mic access etc. -->
        <circles-start-ui/>

        <!-- a-scene with 'circles-properties' component [REQUIRED] -->
        <a-scene circles_scene_properties>
            <a-assets>

                <!-- Circles' built-in assets [REQUIRED] -->
                <circles-assets/>
            </a-assets>

            <!-- Circles' built-in manager and avatar [REQUIRED] -->
            <circles-manager-avatar/>
        </a-scene>

        <!-- Circles' end scripts [REQUIRED] -->
        <circles-end-scripts/>
    </body>
</html>
```