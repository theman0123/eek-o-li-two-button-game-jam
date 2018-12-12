import "phaser";

export default class Gate extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, texture) {
        super(world, x, y, texture);

        // add to scene
        this.scene.add.existing(this);
        // modify size
        this.setScale(5);
        // change body shape
        this.setBody({ shape: "circle" });
        console.log(this);
    }
}
