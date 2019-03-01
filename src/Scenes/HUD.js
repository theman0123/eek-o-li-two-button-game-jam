import "phaser";
import HUD from "../Sprites/HUD";
import MuteButton from "../Sprites/MuteButton";
import { castDie } from "../utils";

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: "HUD", active: true });
    }

    init() {}

    // ALPHABETICAL BY METHOD

    create() {
        // get a reference to game scene
        this.gameScene = this.scene.get("Game");

        // get info - USE AS INITIALIZER
        this.gameScene.events.on("info", info => {
            this.info = info;
            // create/handle graphics
            this.handleGraphics(info);
            // create/handle HUD
            this.createHUD();
            // start music
            this.mainTheme = this.sound.add("main-theme");
            this.mainTheme.play({
                mute: false,
                volume: 1,
                rate: 1,
                detune: 0,
                seek: castDie(45, 1),
                loop: true,
                delay: 1,
            });
            // HUD enemy
            this.gameScene.events.on("enemyLocationToHUD", enemy => {
                this.hudEnemyLocation(enemy, this.gameScene.player);
            });
            // HUD gate
            this.gameScene.events.on("gateSense", player => {
                // logic for executing gateSense
                this.hudGateLocation(player);
            });

            // create Game Start Text
            this.createGameStartText();

            // set timer for game start
            this.gameStartsInTimer = this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.gameCountDownText.setText(
                        `${this.gameStartsInTimer.getRepeatCount()}`,
                    );
                    if (this.gameStartsInTimer.getRepeatCount() === 0) {
                        this.removeCountdownElements();
                        this.gameScene.player.isAlive = true;
                    }
                },
                repeat: 2,
            });
        });
    }

    createGameStartText() {
        // 'ready' text
        this.gameStartText = this.add.text(
            this.game.config.width / 2 - 100,
            this.game.config.height / 2 - 100,
            "Ready: ",
            {
                fontFamily: "Arial",
                fontSize: "56px",
                color: "#fff",
                strokeThickness: 3,
            },
        );
        // countdown number
        this.gameCountDownText = this.add.text(
            this.game.config.width / 2 - 50,
            this.game.config.height / 2 - 50,
            "",
            {
                fontFamily: "Arial",
                fontSize: "70px",
                color: "#fff",
                strokeThickness: 3,
            },
        );
    }

    // create HUD
    createHUD() {
        // don't create more HUD instances on level ups/restarts
        if (this.hudLR) {
            return;
        } else {
            // HUD for enemy
            this.hudLR = new HUD(this);
            this.hudUD = new HUD(this);

            // hud for gate location
            this.hudGateLR = new HUD(this);
            this.hudGateUD = new HUD(this);
        }
    }

    // handle graphics
    // break into seperate parts
    handleGraphics(info) {
        // setup grid sizer
        let color = "0xffffff";
        // create grid
        this.UIGrid = this.rexUI.add
            .gridSizer({
                column: 3,
                row: 1,
                width: this.sys.game.config.width,
                height: 125,
            })
            .setOrigin(0);
        //create lives
        this.handleLives(info.player.lives);
        // create level text
        this.levelText = this.add
            .text(0, 0, info.level, {
                fontSize: "50px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 4,
            })
            .setAlpha(0.7)
            .setDepth(1);
        // create mute button
        this.handleMute();
        this.muteButton.setOrigin(0);

        // this.UIGrid.columnWidth[0] = 100;
        // this.UIGrid.columnWidth[1] = 100;
        // this.UIGrid.columnWidth[2] = 100;
        this.UIGrid.add(this.muteButton, 1, 0);
        this.UIGrid.add(this.levelText, 0, 0);
        this.UIGrid.add(this.livesGraphic.getChildren(), 2, 0);
        this.UIGrid.layout();
        this.UIGrid.drawBounds(this.add.graphics(), color);
        debugger;
    }

    // handle mute
    handleMute() {
        // no duplicate creations
        if (this.muteButton === true) {
            return;
        }
        // mute button
        this.muteButton = new MuteButton(this, 0, 0, 1);
        this.muteButton.on("pointerdown", this.muteButton.handleMuteSettings);
    }
    handleLives(lives) {
        // clear images if they exist
        if (this.livesGraphic) {
            if (this.livesGraphic.children != undefined) {
                this.livesGraphic.clear(true, true);
            }
        }

        // draw image for lives
        this.livesGraphic = this.add.group();
        for (let i = 0; i < lives; i++) {
            // lives graphic and position
            let life = this.add
                .image(0, 0, "eek-tumble", 0)
                .setScale(3)
                .setOrigin(0);
            this.livesGraphic.add(life);
        }
    }
    // hud enemy
    hudEnemyLocation(enemy, player) {
        // set tint to RED
        this.hudLR.setTint(0xfc1026);
        this.hudUD.setTint(0xfc1026);
        if (enemy.x > player.x) {
            this.hudLR.setFlipX(true);
            this.hudLR.setVisible(true);
            this.hudLR.anims.play("HUD-WarningLR");
        }
        if (enemy.x < player.x) {
            this.hudLR.setFlipX(false);
            this.hudLR.setVisible(true);
            this.hudLR.anims.play("HUD-WarningLR");
        }
        if (enemy.y > player.y) {
            this.hudUD.setFlipY(false);
            this.hudUD.setVisible(true);
            this.hudUD.anims.play("HUD-WarningUD");
        }
        if (enemy.y < player.y) {
            this.hudUD.setFlipY(true);
            this.hudUD.setVisible(true);
            this.hudUD.anims.play("HUD-WarningUD");
        }
    }
    // hud gate
    hudGateLocation(player) {
        // set tint to LIGHT-BLUE
        this.hudGateLR.setTint("0x00FFFF");
        this.hudGateUD.setTint("0x00FFFF");
        if (player.x < this.gameScene.gate.x) {
            this.hudGateLR.setFlipX(true);
            this.hudGateLR.setVisible(true);
            this.hudGateLR.anims.play("HUD-WarningLR");
        }
        if (player.x > this.gameScene.gate.x) {
            this.hudGateLR.setFlipX(false);
            this.hudGateLR.setVisible(true);
            this.hudGateLR.anims.play("HUD-WarningLR");
        }
        if (player.y < this.gameScene.gate.y) {
            this.hudGateUD.setFlipY(false);
            this.hudGateUD.setVisible(true);
            this.hudGateUD.anims.play("HUD-WarningUD");
        }
        if (player.y > this.gameScene.gate.y) {
            this.hudGateUD.setFlipY(true);
            this.hudGateUD.setVisible(true);
            this.hudGateUD.anims.play("HUD-WarningUD");
        }
    }

    gameOver() {
        console.log("gamescene", this.gameScene);

        this.maskDimensions = new Phaser.Geom.Rectangle(
            0,
            0,
            window.innerWidth,
            window.innerHeight,
        );
        this.maskDisplay = this.add.graphics().setScrollFactor(0);

        this.maskDisplay
            .fillGradientStyle(0xea4141)
            .setDepth(0)
            .setAlpha(0.7);
        this.maskDisplay.fillRectShape(this.maskDimensions);

        this.gameOverText = this.add.text(
            this.gameScene.cameras.main.centerX,
            this.gameScene.cameras.main.centerY / 2,
            `GAME OVER`,
            {
                fontSize: "50px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 3,
            },
        );
        // in order to center 'game over' it had to be created first^^
        this.gameOverText.setX(
            this.gameScene.cameras.main.centerX - this.gameOverText.width / 2,
        );
        // try again text
        this.tryAgainText = this.add.text(
            this.gameScene.cameras.main.centerX,
            this.gameScene.cameras.main.centerY,
            "Try Again?",
            {
                fontSize: "40px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 2,
            },
        );
        this.tryAgainText.setX(
            this.gameScene.cameras.main.centerX - this.tryAgainText.width / 2,
        );
        // create restart button
        this.restartButton = this.add.image(
            this.gameScene.cameras.main.centerX,
            this.gameScene.cameras.main.centerY +
                this.gameScene.cameras.main.centerY / 4,
            "button-yes",
        );
        this.restartButton.setScale(4);
        this.restartButton.setInteractive();
        this.restartButton.on("pointerdown", () => {
            this.removeTextElements();
            this.gameScene.restart(true);
        });
        this.handleLives(this.info);
    }
    removeCountdownElements() {
        this.gameStartText.destroy();
        this.gameCountDownText.destroy();
    }
    removeTextElements() {
        this.levelText.destroy();
        !!this.maskDisplay ? this.maskDisplay.destroy() : null;
        !!this.restartButton ? this.restartButton.destroy() : null;
        !!this.tryAgainText ? this.tryAgainText.destroy() : null;
        !!this.gameOverText ? this.gameOverText.destroy() : null;
    }
}
