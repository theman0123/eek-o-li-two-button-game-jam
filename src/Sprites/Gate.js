import "phaser";
import { castDie } from "../utils";
export default class Gate extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, texture, level) {
        super(world, x, y, texture);

        // add to scene
        this.scene.add.existing(this);
        // modify size
        this.setScale(5);
        // change body shape
        this.setBody({ type: "circle", radius: 30 });
        this.play("flash");
        // move gate
        this.setFriction(0, 0, 0);
        level > 5 ? this.setVelocity(castDie(1, 3), castDie(1, 3)) : null;
    }
}
