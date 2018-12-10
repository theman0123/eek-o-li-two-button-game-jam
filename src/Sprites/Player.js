import "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "eek");
        // make scene available to all methods by placing it on 'this'
        this.scene = scene;

        // enable physics
        this.scene.physics.world.enable(this);
        // add our player to the scene
        this.scene.add.existing(this);

        // scale player
        this.setScale(4);
        // set depth
        this.depth = 1;
    }
}
