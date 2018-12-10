import "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, frame) {
        super(scene, x, y, "enemy");
        // make scene available to all methods by placing it on 'this'
        this.scene = scene;

        // enable physics
        this.scene.physics.world.enable(this);
        // add our enemy to the scene
        this.scene.add.existing(this);

        // scale enemy
        this.setScale(4);

        // move our enemy based on a timer
        // this.timedEvent = this.scene.time.addEvent({
        //     delay: 3000,
        //     callback: this.move,
        //     loop: true,
        //     callbackScope: this,
        // });
    }
}
