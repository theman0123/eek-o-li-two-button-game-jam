import "phaser";
import { castDie } from "../utils";

export default class PowerUp extends Phaser.Physics.Matter.Image {
    constructor(world, x, y) {
        super(world, x, y, "power-up");
        // make scene available to all methods by placing it on 'this'
        // this.scene = scene;
        this.originalX = this.x;
        this.originalY = this.y;
        // this.setInteractive(true);
        // add our powerUp to the scene
        this.scene.add.existing(this);

        // scale powerUp
        this.setScale(4);
        // fix bounding box
        this.setBody({ shape: "circle" });
    }

    activatePowerUp(player, powerup, scene) {
        // dispatch powerup-activated event
        scene.events.emit("powerupActivated", player);
        // this.remove(powerup);
        powerup.destroy();
    }
}
