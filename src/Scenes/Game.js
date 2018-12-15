import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import Enemy from "../Sprites/Enemy";
import EnemiesGroup from "../Groups/EnemiesGroup";
import PowerUps from "../Groups/PowerUpsGroup";
import PowerUp from "../Sprites/PowerUp";
import HUD from "../Sprites/HUD";
import GraphicsHud from "../Sprites/GraphicsHud";

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        console.log(this.info);
        // bad logic: jumps from level 1 to 3 sometimess
        this.info.level === 0 ? this.info.level++ : this.info.level++;
        this.loadingLevel = false;
        this.events.emit("info", this.info);
    }

    preload() {}

    // ALPHABETICAL BY METHOD

    addCollisions() {
        // level win
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.gate,
            callback: () => {
                this.time.addEvent({
                    delay: 1000,
                    callback: this.restart(),
                    callbackScope: this,
                    repeat: -1,
                });
            },
        });

        // level lose
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.enemies.getChildren(),
            callback: eventData => {
                this.lose(this.enemies, eventData.gameObjectB, this.player);
            },
        });
        // power-up
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.powerUpsGroup.getChildren(),
            callback: eventData => {
                eventData.gameObjectB.activatePowerUp(
                    this.player,
                    eventData.gameObjectB,
                    this,
                );
            },
        });
    }

    create() {
        // this.cameras.main.setScroll(
        //     -this.game.config.width / 2,
        //     -this.game.config.height / 2,
        // );

        // console.log(this.getCenterX());
        this.matter.world.setBounds(0, 0, 1800, 1800, 115);
        // listen for resize events
        this.events.on("resize", this.resize, this);
        // create Player
        this.player = new Player(this.matter.world, 300, 350, this);

        // enemy
        this.enemies = new EnemiesGroup(
            this.matter.world,
            this,
            this.player,
            this.info.enemies,
        );

        // gate
        this.gate = new Gate(this.matter.world, 300, 100, "gate");

        // create power-ups group
        // this.powerup = new PowerUp(this.matter.world, this, 250, 300);
        this.powerUpsGroup = new PowerUps(
            this.matter.world,
            this,
            this.player,
            this.info.powerUps,
        );

        // HUD
        this.hud = new HUD(this);

        this.events.on("enemyLocationToHUD", (player, enemy) => {
            // console.log("hud", this);

            this.enemyAlertStatus =
                Phaser.Math.Distance.Between(
                    enemy.x,
                    enemy.y,
                    player.x,
                    player.y,
                ) < 500
                    ? "HIGH_ALERT"
                    : "LOW_ALERT";
            console.log("alert status", this.enemyAlertStatus);
            if (enemy.x > player.x) {
                this.hud.setFlipX(true);
                this.hud.setVisible(true);
                // this.hud.anims.stop("HUD-WarningUD");
                this.hud.anims.play("HUD-WarningLR");
                console.log("hud right");
            }
            if (enemy.x < player.x) {
                this.hud.setFlipX(false);
                this.hud.setVisible(true);
                // this.hud.anims.stop("HUD-WarningUD");
                this.hud.anims.play("HUD-WarningLR");
                // this.hud.on("aninmationComplete", () => {
                //     console.log("this", this);
                //     this.hud.setVisible(false);
                // });
                console.log("hud left");
            }
            if (enemy.y > player.y) {
                this.hud.setFlipY(false);
                this.hud.setVisible(true);
                // this.hud.anims.stop("HUD-WarningLR");
                this.hud.anims.play("HUD-WarningUD");
                console.log("hud down");
            }
            if (enemy.y < player.y) {
                this.hud.setFlipY(true);
                this.hud.setVisible(true);

                // this.hud.anims.stop("HUD-WarningLR");
                this.hud.anims.play("HUD-WarningUD");
                console.log("hud up");
            }
            console.log(this.hud.x, this.hud.y, this.hud);
        });

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);

        this.addCollisions();
    }

    lose(enemies, enemy, player) {
        player.isAlive = false;
        player.setVisible(false);
        this.cameras.main.startFollow(enemy);
        enemy.anims.play("eek-lose");
    }

    resize(width, height) {
        if (width === undefined) {
            width = this.sys.game.config.width;
        }
        if (height === undefined) {
            height = this.sys.game.config.height;
        }
        this.cameras.resize(width, height);
    }

    restart() {
        if (!this.loadingLevel) {
            this.cameras.main.startFollow(this.gate);
            this.player.setVisible(false);
            this.gate.anims.stop("flash");
            this.gate.anims.play("levelWin");
            this.cameras.main.fade(1500, 0, 0, 0);
            this.cameras.main.on(
                "camerafadeoutcomplete",
                () => {
                    this.scene.restart(this.info);
                },
                this,
            );
        }
        this.loadingLevel = true;
    }

    update() {}
}
