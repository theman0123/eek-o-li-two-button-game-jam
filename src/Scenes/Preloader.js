import "phaser";

// display tap to play AFTER Load is 100% - maybe just have tweens not repeat....
// make background interactive
// on click => start gameScene

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        this.ready = 0;
    }

    preload() {
        // load in the spritesheet
        this.loadSprites();

        // images
        this.load.image("power-up", "assets/power-up.png");
        this.load.image("button-yes", "assets/button-yes.png");

        // audio
        this.loadAudio();

        // title background
        this.background = this.add
            .image(this.width / 2, this.height / 2, "title-sprites", 0)
            .setDisplaySize(300, 500);
        // enemy
        this.enemy = this.add.image(
            this.width / 2 - this.background.displayWidth / 2 + 50,

            this.height / 2 + this.background.displayHeight / 2 - 50,
            "title-sprites",
            2,
        );
        // eek
        this.eek = this.add
            .image(
                this.width / 2 + this.background.displayWidth / 2 - 50,
                this.height / 2 + this.background.displayHeight / 2 - 50,
                "title-sprites",
                3,
            )
            .setScale(2);

        // Text
        this.setupText();
        // TWEENS
        this.setupTweens();
        //
        // loading
        // update progress bar
        this.load.on("progress", value => {
            // this.eek.setX(parseInt(value * 100));
            // this.eekTweenMovement.updateTo("x", parseInt(value * 100));
            console.log(parseInt(value * 100) + "%", value);
            if (value === 1) {
                this.loadingAssetsText.destroy();
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
        // tap to play!
        this.tapToPlayText = this.add
            .text(
                this.width / 2 - this.background.displayWidth / 2,
                this.height - 150,
                "Tap To Play!",
                {
                    fontSize: "40px",
                    fill: "#d8a6cc",
                    strokeThickness: 5,
                },
            )
            .setDepth(1);
    }
    setupTweens() {
        // text
        this.textAlphaTween = this.tweens.add({
            targets: this.titleText,
            duration: 5000,
            repeat: 0,
            alpha: 1,
        });
        // enemy movement
        this.enemyTweenMovement = this.tweens.add({
            targets: this.enemy,
            x: this.width / 2, // '+=100'
            y: this.background.displayHeight / 2, // '+=100'
            ease: "Power2", // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear, 'Sine', 'Ease'
            duration: 3000,
            repeat: -1, // -1: infinity
            yoyo: true,
        });
        this.enemyTweenSize = this.tweens.add({
            targets: this.enemy,
            scaleX: 2,
            scaleY: 2,
            ease: "Power2", // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear, 'Sine', 'Ease'
            duration: 3000,
            repeat: -1, // -1: infinity
            yoyo: true,
        });
        // eek movement
        this.eekTweenMovement = this.tweens.add({
            targets: this.eek,
            x: this.width / 2 - this.background.displayWidth / 2, // '+=100'
            y: this.height / 2 - this.background.displayHeight / 2, // '+=100'
            ease: "Power2", // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear, 'Sine', 'Ease'
            duration: 3000,
            repeat: -1, // -1: infinity
            yoyo: true,
            // paused: true,
        });
        this.eekTweenSize = this.tweens.add({
            targets: this.eek,
            scaleX: 0.5,
            scaleY: 0.5,
            ease: "Power2", // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear, 'Sine', 'Ease'
            duration: 3000,
            repeat: -1, // -1: infinity
            yoyo: true,
        });
        this.eekTweenTwist = this.tweens.add({
            targets: this.eek,
            rotation: 2,
            ease: "Linear",
            duration: 3000,
            repeat: -1,
            yoyo: true,
        });
        this.eekTweenAlpha = this.tweens.add({
            targets: this.eek,
            alpha: 0,
            duration: 3000,
            repeat: -1,
            yoyo: true,
        });
    }
}
