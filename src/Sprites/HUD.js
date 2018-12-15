import "phaser";

export default class HUD extends Phaser.GameObjects.Sprite {
    constructor(world, x, y) {
        super(world, x, y, "HUD", 0);
        // add to scene
        this.scene.add.existing(this);
        // modify size
        this.setDisplaySize(window.innerWidth, window.innerHeight);
        // place on top layer
        this.setDepth(2);
        this.setDisplayOrigin(0, 0);
        // window.innerWidth
        // this.play("HUD-Warning");
    }
}
