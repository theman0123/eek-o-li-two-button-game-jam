import "phaser";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;

        this.ready = 0;
    }

    preload() {
        // eek
        this.titleEek = this.add
            .sprite(this.width / 2 - 170, 0, "title-sprites")
            .play("eek-title")
            .setScale(4)
            .setOrigin(0);
        // load in the spritesheet
        this.loadSprites();

        // images
        this.load.image("power-up", "assets/power-up.png");
        this.load.image("button-yes", "assets/button-yes.png");

        // audio
        this.loadAudio();

        // Text
        this.setupText();

        // loading
        // update progress bar
        this.load.on("progress", value => {
            if (value === 1) {
                this.loadingAssetsText.destroy();
                this.loadingText.destroy();
                // tap to play!
                this.tapToPlayText = this.add
                    .text(
                        this.width / 2 - 150,
                        this.height - 150,
                        "Tap To Play!",
                        {
                            fontSize: "40px",
                            fill: "#0d8c92",
                            strokeThickness: 5,
                        },
                    )
                    .setDepth(1);
            }
        });

        // update file progress text
        this.load.on("fileprogress", file => {
            this.loadingAssetsText.setText(`Loading asset: ${file.key}`);
        });
    }

    create() {
        // ANIMATIONS
        this.createAnims();

        this.time.addEvent({
            delay: 3000,
            callback: this.ready++,
        });

        // start game
        this.input.on("pointerdown", () => {
            if (this.ready === 1) {
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
                        lives: 0,
                    },
                });
            }
        });
    }

    createAnims() {
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
    }
    loadSprites() {
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
    }
    loadAudio() {
        this.load.audio("main-theme", "assets/main-theme.mp3");
        this.load.audio("game-lose", "assets/game-lose.mp3");
        this.load.audio("level-win", "assets/level-win.mp3");
    }
    setupText() {
        // EEK!
        this.titleText = this.add
            .text(this.width / 2, 100, "EEK!", {
                fontSize: "60px",
                fill: "#d8a6cc",
                strokeThickness: 5,
            })
            .setDepth(1)
            .setAlpha(0);
        // loading...
        this.loadingText = this.add
            .text(this.width / 2, 170, "Loading...", {
                fontSize: "25px",
                fill: "#ffffff",
                strokeThickness: 2,
            })
            .setDepth(1)
            .setAlpha(0.7);
        // show files as they load
        this.loadingAssetsText = this.add
            .text(this.width / 2, 220, "", {
                fontSize: "20px",
                fill: "#ffffff",
                strokeThickness: 1,
            })
            .setDepth(1)
            .setAlpha(0.7);
    }
}
