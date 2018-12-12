import "phaser";
import { castDie } from "../utils";

export default class PowerUp extends Phaser.Physics.Matter.Image {
    constructor(scene, x, y) {
        super(scene, x, y, "power-up");
        // make scene available to all methods by placing it on 'this'
        this.scene = scene;
        this.originalX = this.x;
        this.originalY = this.y;
        // enable physics
        this.scene.physics.world.enable(this);
        // add our powerUp to the scene
        this.scene.add.existing(this);

        // scale powerUp
        this.setScale(4);
        // move our powerUp based on a timer
        this.timedEvent = this.scene.time.addEvent({
            delay: 5000,
            callback: this.move,
            loop: true,
            callbackScope: this,
        });
    }

    activatePowerUp(player, powerup) {
        this.remove(powerup);
        powerup.destroy();
        // dispatch powerup-activated event
        this.scene.events.emit("powerupActivated");
    }

    move() {
        const sway = this.scene.tweens.add({
            targets: this,
            x: castDie(this.originalX - 100, this.originalX + 150),
            y: castDie(this.originalY - 100, this.originalY + 150),
            duration: 5000,
            angle: castDie(100),
            paused: true,
            ease: "Sine.easeInOut",
        });

        sway.restart();
    }
}
