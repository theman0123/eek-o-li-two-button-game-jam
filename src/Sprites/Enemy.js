import "phaser";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y) {
        super(world, x, y, "enemy");
        // make scene available to all methods by placing it on 'this'
        this.scene = scene;

        // add our enemy to the scene
        this.scene.add.existing(this);

        // scale enemy
        this.setScale(4);

        // move our enemy based on a timer
        // this.scene.time.addEvent({
        //     delay: 3000,
        //     callback: this.move,
        //     loop: true,
        //     callbackScope: this,
        // });

        this.scene.events.on("playerPosition", playerPosition => {
            console.log("player position", playerPosition, this);
            let move = this.scene.tweens.add({
                targets: this,
                x: playerPosition.x,
                y: playerPosition.y,
                duration: 3500,
                paused: true,
                ease: "Sine.easeInOut",
            });
            move.restart();
        });
    }

    move() {}
}
