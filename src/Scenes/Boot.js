import "phaser";

export default class BootScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // load in the spritesheet
        this.load.spritesheet("eek", "assets/tex/eek.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("gate", "assets/tex/gate.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("enemy", "assets/tex/enemy.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("power-up", "assets/tex/power-up.png");
    }

    // ALPHABETICAL BY METHOD

    create() {
        // Animations

        // motor engaged animation
        this.anims.create({
            key: "engage",
            frames: this.anims.generateFrameNames("eek", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7],
            }),
            frameRate: 8,
            yoyo: true,
            repeat: -1,
        });

        // enemy movement
        this.anims.create({
            key: "move-enemy",
            frames: this.anims.generateFrameNames("enemy", {
                frames: [0, 1],
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1,
        });

        // gate flash
        this.anims.create({
            key: "flash",
            frames: this.anims.generateFrameNames("gate", {
                frames: [0, 1, 2, 3],
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1,
        });

        // start game
        this.scene.start("Game");
    }
}
