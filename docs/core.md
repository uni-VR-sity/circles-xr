# Circles Core

<br>

## Functions

| Function                                  | Description                                                                           |
| :---                                      | :---                                                                                  |
| `CIRCLES.getCirclesGroupName();`          | Gets the name of the group the user is in (users in a group can only see each other)  |
| `CIRCLES.getCirclesWorldName();`          | Gets the name of the Circles' world the user is in                                    |
| `CIRCLES.getCirclesUserName();`           | Gets the name of the current user                                                     |
| `CIRCLES.isReady();`                      | Gets if Circles is ready                                                              |
| `CIRCLES.getAvatarElement();`             | Gets the avatar element (ex. to add something to the avatar or query the body)        |
| `CIRCLES.getAvatarRigElement();`          | Gets the avatar rig (ex. to move the avatar)                                          |
| `CIRCLES.getMainCameraElement();`         | Gets the camera element                                                               |
| `CIRCLES.getCirclesManagerElement();`     | Gets the circles-manager entity                                                       |
| `CIRCLES.getCirclesManagerComp();`        | Gets the circles-manager component                                                    |
| `CIRCLES.getPickedUpElement();`           | Gets held element, or null if no held object on the player                            |
| `CIRCLES.getNonNetworkedID(elem);`        | Gets the non-networked id of an element                                               |
| `CIRCLES.getCirclesWebsocket();`          | Gets communication socket                                                             |
| `CIRCLES.getNetworkedAvatarElements();`   | Gets all avatars in the scene (yourself and other networked-aframe avatar entities)   |
| `CIRCLES.getAllNetworkedElements();`      | Gets all networked-aframe networked entities (includes avatars and any other objects) |

<br>

## Events

| Event                                 | Description                                                               |
| :---                                  | :---                                                                      |
| `CIRCLES.EVENTS.READY`                | Emitted when Circles has loaded                                           |
| `CIRCLES.EVENTS.EXPERIENCE_ENTERED`   | Emitted when the user clicks on 'Enter Circles' button                    |
| `CIRCLES.EVENTS.PICKUP_OBJECT`        | Emitted when the user picked up an object (returns id)                    |
| `CIRCLES.EVENTS.RELEASE_OBJECT`       | Emitted when the user releases an object (returns id)                     |
| `CIRCLES.EVENTS.USER_CONNECTED`       | Emitted when a networked user connects (returns id, world, and device)    |
| `CIRCLES.EVENTS.USER_DISCONNECTED`    | Emitted when a networked user disconnects (returns id, world, and device) |