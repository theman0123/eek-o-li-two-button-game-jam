import "phaser";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, scene) {
        super(world, x, y, "enemy");
        this.scene = scene;
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

        // this.scene.events.on("powerupActivated", (player, scene) => {
        //     // debugger;
        //     // wrong 'this' context
        //     this.avoidPlayer(player);
        //     this.executeMovement(scene);
        // });
        // alert location to HUD
        this.scene.input.on("pointerup", () => {
            this.scene.events.emit("enemyLocationToHUD", this);
            this.calculateMovement(this.scene.player);
            this.executeMovement(scene);
        });
    }
    // powerup activated: run away from player
    avoidPlayer(player) {
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

    dispatchLocation() {}

    executeMovement(scene) {
        let velocity = this.avoid ? 5 : 2.2;

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

    // emitLocationToHUD(player) {
    //     // this.scene = this.world.scene;
    //     console.log("this", this);
    //     console.log("this:xy", this.x, this.y);
    //     // must set reference to scene
    //     // must pass this as context for emit (or 'this' becomes undefined as an argument)
    // }
}
