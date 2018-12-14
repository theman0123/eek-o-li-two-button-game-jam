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
        this.load.spritesheet("eek-tumble", "assets/tex/eek-tumble.png", {
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
        this.load.spritesheet("HUD", "assets/tex/HUD.png", {
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
        // eek tumble movement
        this.anims.create({
            key: "tumble",
            frames: this.anims.generateFrameNames("eek-tumble", {
                frames: [0, 1, 2],
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

        // eek through gate: level win
        this.anims.create({
            key: "levelWin",
            frames: this.anims.generateFrameNames("gate", {
                frames: [4, 5, 6, 7],
            }),
            frameRate: 4,
            yoyo: false,
        });

        // enemy win - eek/player lose
        this.anims.create({
            key: "eek-lose",
            frames: this.anims.generateFrameNames("enemy", {
                frames: [2, 3, 4, 5, 0],
            }),
            frameRate: 4,
            yoyo: false,
        });

        // HUD
        this.anims.create({
            key: "HUD-Warning",
            frames: this.anims.generateFrameNames("HUD", {
                frames: [0, 1, 2, 3, 4],
            }),
            frameRate: 4,
            yoyo: false,
        });
        // start game
        this.scene.start("Game", {
            level: 0,
            powerUps: {
                max: 3,
                distanceFromPlayer: 200,
                setScale: 4,
            },
            enemies: {
                num: 3,
            },
        });
    }
}
