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
            // create/handle mute button
            this.handleMute();
            // HUD enemy
            this.gameScene.events.on("enemyLocationToHUD", enemy => {
                this.hudEnemyLocation(enemy, this.gameScene.player);
            });
            // HUD gate
            this.gameScene.events.on("gateSense", player => {
                // logic for executing gateSense
                this.hudGateLocation(player);
            });
        });
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
    handleGraphics(info) {
        // clear lives Graphic
        if (this.livesGraphic) {
            this.livesGraphic.clear(true, true);
        }
        this.levelText = this.add
            .text(25, 25, `Level: ${info.level}`, {
                fontSize: "52px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 4,
            })
            .setAlpha(0.7)
            .setDepth(1);
        // create level text
        // level text dimensions for easy access
        const { x, y, width, height } = this.levelText;

        // graphics for lives
        this.livesGraphic = this.add.group();
        for (let i = 0; i < info.player.lives; i++) {
            let startWidth = this.sys.game.config.width - (i + 1) * x;
            let margin = 15 * i;
            // lives graphic and position
            let life = this.add
                .image(startWidth - margin, height - y / 2, "eek-tumble", 0)
                .setScale(3);
            this.livesGraphic.add(life);
        }
        this.drawLevelContainer = new Phaser.Geom.Rectangle(
            x - 5, //origin x
            y - 5,
            width + 10, // size x
            height + 10,
        );
        // container graphic
        this.levelContainerFill = this.add
            .graphics({
                fillStyle: { color: 0xf6f2e9 },
            })
            .setDepth(0)
            .setAlpha(0.7);
        this.levelContainerFill.fillRectShape(this.drawLevelContainer);
    }

    // handle mute
    handleMute() {
        // no duplicate creations
        if (this.muteButton) {
            return;
        }
        const { width, height, y, x } = this.levelText;
        // mute button
        this.muteButton = new MuteButton(this, width + 100, height - 4, 1);
        this.muteButton.on("pointerdown", this.muteButton.handleMuteSettings);
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
        this.gameOver = this.add.text(
            this.gameScene.cameras.main.centerX / 2,
            this.gameScene.cameras.main.centerY / 2,
            `GAME OVER`,
            {
                fontSize: "152px",
                fill: "#E8EFEE",
                backgroundColor: "#ca3542",
                strokeThickness: 4,
            },
        );
    }
}
