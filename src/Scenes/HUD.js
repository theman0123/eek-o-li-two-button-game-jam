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

    addElementsToGameOverGrid() {
        // this.gameOverGrid.add(this.gameOverText);
        // this.gameOverGrid.add(this.tryAgainText);
        // this.gameOverGrid.add(this.restartButton);
        this.gameOverGrid.add(
            this.gameOverText,
            0,
            Phaser.Display.Align.CENTER,
            {
                bottom: 50,
            },
            false,
        );
        this.gameOverGrid.add(
            this.tryAgainText,
            0,
            Phaser.Display.Align.CENTER,
            {
                bottom: 50,
            },
            false,
        );
        this.gameOverGrid.add(
            this.restartButton,
            0,
            Phaser.Display.Align.CENTER,
            {
                bottom: 50,
            },
            false,
        );
    }

    addElementsToUIGrid() {
        // padding config for grid
        let paddingConfig = {
            left: 20,
            // right: 20,
            // top: 10,
            // bottom: 0,
        };
        // insert level text at r0:c0
        this.UIGrid.add(
            this.levelText,
            0,
            Phaser.Display.Align.CENTER,
            paddingConfig,
        );
        // insert mute button to grid r0:c1
        this.UIGrid.add(
            this.muteButton,
            0,
            Phaser.Display.Align.CENTER,
            paddingConfig,
            false,
        );
    }

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
                    // in order to realign in center
                    this.gameStartContainer.layout();
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
        this.gameStartContainer = this.rexUI.add
            .sizer({
                orientation: "y",
                x: this.game.config.width / 2 - 150,
                y: this.game.config.height / 2 - 100,
                width: 300,
                height: 200,
            })
            .setOrigin(0);
        // 'ready' text
        this.gameStartText = this.add.text(0, 0, "Ready: ", {
            fontFamily: "Arial",
            fontSize: "56px",
            color: "#fff",
            strokeThickness: 3,
        });
        // countdown number
        this.gameCountDownText = this.add.text(0, 0, "", {
            fontFamily: "Arial",
            fontSize: "70px",
            color: "#fff",
            strokeThickness: 3,
        });
        this.gameStartContainer.add(this.gameStartText);
        this.gameStartContainer.add(
            this.gameCountDownText,
            0,
            Phaser.Display.Align.CENTER,
        );
        this.gameStartContainer.layout();
        // this.gameStartContainer.drawBounds(this.add.graphics());
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

    // handle graphics/grid
    handleGraphics(info) {
        // setup grid
        this.setupGrid();
        // create mute button
        this.handleMute();
        this.muteButton;
        // create level text
        this.levelText = this.add
            .text(0, 0, info.level, {
                fontSize: "44px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 4,
            })
            .setAlpha(0.7)
            .setDepth(1);
        this.addElementsToUIGrid();
        //create lives graphic
        // right most ui elements add last
        this.handleLives(info.player.lives);
        // add background to UI
        var background = this.add.rectangle(0, 0, 50, 50, 0xffffff, 0.2);
        this.UIGrid.addBackground(background).setDepth(0);

        // draw grid and children
        this.UIGrid.layout();
        // for debug purposes
        // this.UIGrid.drawBounds(this.add.graphics());
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
            let life = this.add.image(0, 0, "eek-tumble", 0).setScale(2);
            // add to group
            this.livesGraphic.add(life);
            // add to grid
            this.UIGrid.add(
                this.livesGraphic.getChildren()[i],
                0,
                Phaser.Display.Align.CENTER,
                {
                    left: 10,
                    bottom: 10,
                },
                false,
            );
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
        // remove text elements in case of glitch
        this.removeCountdownElements();
        // remove lives graphic
        this.handleLives(this.info);
        // setup grid
        this.setupGameOverGrid();
        // gradient vsfx
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

        this.gameOverText = this.add
            .text(0, 0, `GAME OVER`, {
                fontSize: "50px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 3,
            })
            .setOrigin(0);
        // try again text
        this.tryAgainText = this.add
            .text(
                this.gameScene.cameras.main.centerX,
                this.gameScene.cameras.main.centerY,
                "Try Again?",
                {
                    fontSize: "30px",
                    fill: "#E8EFEE",
                    backgroundColor: "#ca3542",
                    strokeThickness: 2,
                },
            )
            .setOrigin(0);
        // create restart button
        this.restartButton = this.add
            .image(0, 0, "button-yes")
            .setScale(3)
            .setInteractive();
        this.restartButton.on("pointerdown", () => {
            this.removeTextElements();
            this.gameScene.restart(true);
        });
        this.addElementsToGameOverGrid();

        this.gameOverGrid.layout();
        // uncomment to aid debugging/layout
        // this.gameOverGrid.drawBounds(this.add.graphics());
    }

    removeCountdownElements() {
        this.gameStartText.destroy();
        this.gameCountDownText.destroy();
    }

    removeTextElements() {
        this.levelText.destroy();
        this.muteButton.destroy();
        !!this.maskDisplay ? this.maskDisplay.destroy() : null;
        !!this.restartButton ? this.restartButton.destroy() : null;
        !!this.tryAgainText ? this.tryAgainText.destroy() : null;
        !!this.gameOverText ? this.gameOverText.destroy() : null;
    }
    setupGrid() {
        let screenWidth = this.sys.game.config.width;
        // setup grid sizer
        this.UIGrid = this.rexUI.add
            .sizer({
                orientation: "x",
                x: 0,
                y: 0,
                width: screenWidth > 300 ? 300 : screenWidth,
                height: 75,
            })
            .setOrigin(0);
    }
    setupGameOverGrid() {
        let screen = this.sys.game.config;
        // setup grid sizer
        this.gameOverGrid = this.rexUI.add
            .sizer({
                orientation: "y",
                width: 300,
                height: 400,
                x: screen.width / 2 - 150,
                y: screen.height / 2 - 200,
            })
            .setOrigin(0);
    }
}
