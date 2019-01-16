import "phaser";

export default class BootScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // load in the spritesheet
        this.load.spritesheet("eek", "assets/eek.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("eek-tumble", "assets/eek-tumble.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("gate", "assets/gate.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("enemy", "assets/enemy.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("HUD", "assets/HUD.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("mute-button", "assets/Mute(64x64).png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.image("power-up", "assets/power-up.png");
        this.load.audio("main-theme", "assets/main-theme.mp3");
        this.load.audio("game-lose", "assets/game-lose.mp3");
        this.load.audio("level-win", "assets/level-win.mp3");
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
            key: "HUD-WarningLR",
            frames: this.anims.generateFrameNames("HUD", {
                frames: [3, 4],
            }),
            frameRate: 2,
            yoyo: false,
            hideOnComplete: true,
        });
        this.anims.create({
            key: "HUD-WarningUD",
            frames: this.anims.generateFrameNames("HUD", {
                frames: [6, 7],
            }),
            frameRate: 2,
            yoyo: false,
            hideOnComplete: true,
        });
        // start game
        this.scene.start("Game", {
            level: 0,
            powerUps: {
                num: 2,
                maxStartDistance: 200,
                minStartDistance: 50,
            },
            enemies: {
                num: 1,
                maxStartDistance: 500,
                minStartDistance: 200,
            },
            bounds: {
                width: 800,
                height: 800,
            },
            player: {
                lives: 2,
            }
        });
    }
}
