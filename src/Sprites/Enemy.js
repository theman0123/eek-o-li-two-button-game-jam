import "phaser";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y) {
        super(world, x, y, "enemy");
        console.log("ENEMY MADE");
        // this.scene = this.world.scene.get("Game");
        // add our enemy to the scene
        this.scene.add.existing(this);
        // fix bounding box
        this.setBody({ shape: "square", width: 10, height: 10 });

        // scale enemy
        this.setScale(4);
        // play animations
        this.play("move-enemy");
        // calculate movement with these
        this.directionToPlayer = {
            up: false,
            down: false,
            left: false,
            right: false,
        };

        this.scene.events.on(
            "playerPosition",
            (scene, player) => {
                this.calculateMovement(scene, player);
                this.executeMovement(scene);
                console.log("enemies on the move");
            },
            this,
        );
    }
    // to make it work on restart : this
    calculateMovement(scene, player) {
        // console.log(enemy, scene);
        console.log(this);
        let distance = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            this.x,
            this.y,
        );
        this.directionToPlayer = {
            up: this.y > player.y,
            down: this.y < player.y,
            left: this.x > player.x,
            right: this.x < player.x,
        };
    }

    executeMovement(scene) {
        // honing movement
        if (this.directionToPlayer.up === true) {
            if (this.directionToPlayer.left === true) {
                this.setVelocity(-2.2);
                console.log("up and left");
            } else {
                this.setVelocity(2.2, -2.2);
                console.log("up and right");
            }
        }
        if (this.directionToPlayer.down === true) {
            if (this.directionToPlayer.left === true) {
                this.setVelocity(-2.2, 2.2);
                console.log("down and left");
            } else {
                this.setVelocity(2.2);
                console.log("down and right");
            }
        }
    }
}
