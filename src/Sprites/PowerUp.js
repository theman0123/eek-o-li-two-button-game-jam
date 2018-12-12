import "phaser";
import { castDie } from "../utils";

export default class PowerUp extends Phaser.Physics.Matter.Image {
    constructor(world, scene, x, y) {
        super(world, x, y, "power-up");
        // make scene available to all methods by placing it on 'this'
        this.scene = scene;
        this.originalX = this.x;
        this.originalY = this.y;

        // add our powerUp to the scene
        this.scene.add.existing(this);

        // scale powerUp
        this.setScale(4);
        // fix bounding box
        this.setBody({ shape: "circle" });
        // move our powerUp based on a timer
        this.scene.time.addEvent({
            delay: 3000,
            callback: this.move,
            loop: true,
            callbackScope: this,
        });
    }

    activatePowerUp(player, powerup, scene) {
        this.scene.time.removeAllEvents();
        console.log("player in powerup", player);
        // dispatch powerup-activated event
        scene.events.emit("powerupActivated", { X: player.x, y: player.y });
        // this.remove(powerup);
        powerup.destroy();
        this.sway.stop();
    }

    move() {
        this.sway = this.scene.tweens.add({
            targets: this,
            x: castDie(this.originalX - 100, this.originalX + 150),
            y: castDie(this.originalY - 100, this.originalY + 150),
            duration: 5000,
            angle: castDie(100),
            paused: true,
            ease: "Sine.easeInOut",
        });

        this.sway.restart();
    }
}
