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

        // console.log(
        //     "THIS IN ENEMY",
        //     this,
        //     "SCENE",
        //     scene,
        //     "THIS.SCENE",
        //     this.scene,
        // );

        this.scene.events.on("playerPosition", (player, scene) => {
            this.honeTween(player, scene);
        });
        this.scene.events.on("powerupActivated", playerPosition => {
            // console.log(
            //     "powerup activated enemy",
            //     playerPosition,
            //     this.scene.tweens,
            // );
            // distance between enemy and player
            let totalX = playerPosition.x - this.x;
            // console.log("totalX", totalX, playerPosition.x, this.scene.enemy.x);
            this.move = this.scene.tweens.add({
                targets: this.scene.enemy,
                x: 155,
                y: 155,
                duration: 3500,
                paused: true,
                ease: "Sine.easeInOut",
                // getEndValue: enemy => {
                //     this.scene.tweens.hone.restart();
                // },
            });
            this.move.restart();
        });
    }

    honeTween(player, scene) {
        console.log("enemy honing to:", player.x, player.y);
        this.scene = scene;
        if (this.hone) {
            this.hone.restart();
            // this.hone.onComplete(() => {
            // console.log(
            //     "complete",
            //     this.hone.data[0].getEndValue(),
            //     this.hone.data[1].getEndValue(),
            // );
            // this.x = this.hone.data[0].getEndValue();
            // this.y = this.hone.data[1].getEndValue();
            // });
        } else {
            this.hone = this.scene.tweens.add({
                targets: this,
                x: player.x,
                y: player.y,
                duration: 3500,
                paused: true,
                ease: "Sine.easeInOut",
            });
            this.hone.restart();
        }
    }
}

// if (this.x > playerPosition.x) this.x -= 20;
// else this.x += 20;
// if (this.x > playerPosition.y) this.y -= 20;
// else this.y += 20;