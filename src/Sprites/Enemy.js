import "phaser";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y) {
        super(world, x, y, "enemy");
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
        // powerups when activated change this (see this.executeMovement)
        this.avoid = false;

        this.scene.events.on(
            "playerPosition",
            (scene, player) => {
                this.calculateMovement(player);
                this.executeMovement(scene);
            },
            this,
        );
        this.scene.events.on(
            "powerupActivated",
            (scene, player) => {
                this.avoidPlayer(player, this);
                this.executeMovement(scene);
            },
            this,
        );
    }
    // powerup activated: run away from player
    avoidPlayer(player) {
        console.log(this);
        this.directionToPlayer = {
            up: !(this.y > player.y),
            down: !(this.y < player.y),
            left: !(this.x > player.x),
            right: !(this.x < player.x),
        };
        this.avoid = true;
    }

    // to make it work on restart : this
    calculateMovement(player) {
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
        let velocity;
        this.avoid ? (velocity = 5) : (velocity = 2.2);

        // honing movement
        if (this.directionToPlayer.up === true) {
            if (this.directionToPlayer.left === true) {
                this.setVelocity(-velocity);
            } else {
                this.setVelocity(velocity, -velocity);
            }
        }
        if (this.directionToPlayer.down === true) {
            if (this.directionToPlayer.left === true) {
                this.setVelocity(-velocity, velocity);
            } else {
                this.setVelocity(velocity);
            }
        }
        this.avoid = false;
    }
}
