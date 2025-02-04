import * as THREE from 'three'; // Importing the Three.js library
import { Scene } from '../lib'; // Importing the base Scene class
import Box from '../constructs/Box'; // Importing the Box construct
import Room from '../constructs/Room'; // Importing the Room construct
import Player from '../constructs/Player'; // Importing the Player construct
import { GroceryItem } from '../constructs/GroceryItem';
import { CustomInteractManager } from '../lib/customLib/CustomInteractManager';

// Class representing the ModelInteractionScene, extending the base Scene class
export class ModelIteractionScene extends Scene {
    camera!: THREE.PerspectiveCamera; // Camera for the scene
    loading!: number; // Placeholder for loading state (currently not used)

    room!: Room; // Room object
    player!: Player; // Player object
    peanutButter!: GroceryItem; // PeanutButter object
    redWine!: GroceryItem;
    redCube!: Box; // Box used as a pickup spot for the peanut butter
    greenCube!: Box; // Box used as a placement spot for the peanut butter
    blueCube!:Box;

    // Constructor initializes the scene with a unique key and the Ammo physics library
    constructor(AmmoLib: any) {
        super('model-interaction', AmmoLib); // Call the parent constructor with the scene key and Ammo library

        this.interactions = new CustomInteractManager();

        // Create and add the player construct to the scene
        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.player);

        // Create and add the room construct to the scene
        this.room = new Room(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.room);

        // Create and add a box to serve as a pickup spot for the peanut butter
        this.redCube = new Box(this.graphics, this.physics, this.interactions, this.userInterface, [0, 0, 0], 2, 0xff0000);
        this.addConstruct(this.redCube);

        // Create and add the peanut butter construct to the scene
        this.peanutButter = new GroceryItem(this.graphics, this.physics, this.interactions, this.userInterface, "peanut_butter", 3);
        this.addConstruct(this.peanutButter);

        this.redWine = new GroceryItem(this.graphics, this.physics, this.interactions, this.userInterface,
        "red_wine", 3);
        this.addConstruct(this.redWine);

        // Create and add a box to serve as a placement spot for the peanut butter
        this.greenCube = new Box(this.graphics, this.physics, this.interactions, this.userInterface, [0, 0, 0], 2, 0x00ff00);
        this.addConstruct(this.greenCube);

        this.blueCube = new Box(this.graphics, this.physics, this.interactions, this.userInterface, [0, 0, 0], 2, 0x00000ff);
        this.addConstruct(this.blueCube);
    }

    // Lifecycle method to create the scene elements
    create(): void {
        // Set the position for the pickup spot
        this.redCube.root.position.set(-20, 2, 0);
        // Add interaction for picking up the peanut butter from the pickup spot
        this.redCube.interactions.addPickupSpot(this.redCube.root, 5, (placeObject: THREE.Object3D) => {
            this.redCube.root.add(placeObject); // Add the object to the pickup spot
            placeObject.position.set(0, 1, 0); // Set the position of the placed object
            placeObject.scale.setScalar(1); // Reset the scale of the placed object
        });

        // Set the position for the placement spot
        this.greenCube.root.position.set(20, 2, 0);
        // Add interaction for placing the peanut butter at the placement spot
        this.greenCube.interactions.addPickupSpot(this.greenCube.root, 5, (placeObject: THREE.Object3D) => {
            this.greenCube.root.add(placeObject); // Add the object to the placement spot
            placeObject.position.set(0, 1, 0); // Set the position of the placed object
            placeObject.scale.setScalar(1); // Reset the scale of the placed object
        });

        this.blueCube.root.position.set(20, 2, 2);
        // Add interaction for placing the peanut butter at the placement spot
        this.blueCube.interactions.addPickupSpot(this.blueCube.root, 5, (placeObject: THREE.Object3D) => {
            this.blueCube.root.add(placeObject); // Add the object to the placement spot
            placeObject.position.set(0, 1, 0); // Set the position of the placed object
            placeObject.scale.setScalar(1); // Reset the scale of the placed object
        });

        // Set the position for the peanut butter object
        this.greenCube.addConstruct(this.peanutButter);
        this.peanutButter.root.position.set(0, 1, 0);
        this.peanutButter.interactions.addPickupObject(this.peanutButter.root, 5, 1, () => {
            // Currently empty callback for the pickup action
        });

        this.blueCube.addConstruct(this.redWine);
        this.redWine.root.position.set(0, 1, 0);
        this.redWine.interactions.addPickupObject(this.redWine.root, 5, 1, () => {
        });
    }

    // Asynchronous method to load resources for the scene (currently empty)
    async load(): Promise<void> {}

    // Method to build the scene after loading resources
    build(): void {
        // Create a perspective camera and set its properties
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        this.graphics.mainCamera = this.camera; // Set the main camera in the graphics context
        this.graphics.mainCamera.position.set(0, 40, 0); // Position the camera
        this.graphics.mainCamera.lookAt(0, 0, 0); // Set the camera to look at the origin

        // Create a point light and set its position
        const light = new THREE.PointLight(0xffff00, 1, 50, 0);
        light.position.set(0, 20, 5);

        this.graphics.add(light); // Add the light to the graphics context
    }

    // Method to update the scene on each frame (currently empty)
    update(time: number, delta: number): void {
        this.player.checkLookingAtGroceryItem([this.peanutButter, this.redWine]);
        this.player.checkLookingAtPickupSpot([this.redCube, this.greenCube, this.blueCube]);
    }

    // Method to clean up resources when the scene is destroyed (currently empty)
    destroy(): void {}
}
