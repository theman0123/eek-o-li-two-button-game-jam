import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import EnemiesGroup from "../Groups/EnemiesGroup";
import PowerUps from "../Groups/PowerUpsGroup";
import HUD from "../Sprites/HUD";

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        // to do: fix restart issues with context and change level info
        this.info.level === 0 ? this.info.level++ : this.info.level++;
        this.loadingLevel = false;
        this.events.emit("info", this.info);
    }

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
        this.matter.world.setBounds(0, 0, 2400, 2400, 115);
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
        this.hudLR = new HUD(this);
        this.hudUD = new HUD(this);

        this.events.on("enemyLocationToHUD", (player, enemy) => {
            this.hudEnemyLocation(enemy, player);
        });

        // hud for gate location
        this.hudGateLR = new HUD(this);
        this.hudGateUD = new HUD(this);
        this.events.on("gateSense", player => {
            // logic for executing gate
            this.hudGateLocation(player);
        });

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);

        this.addCollisions();
    }

    hudEnemyLocation(enemy, player) {
        this.enemyAlertStatus =
            Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) <
            500
                ? "HIGH_ALERT"
                : "LOW_ALERT";
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

    hudGateLocation(player) {
        if (player.x < this.gate.x) {
            this.hudGateLR.setFlipX(true);
            this.hudGateLR.setTint("0x10E9E3");
            this.hudGateLR.setVisible(true);
            this.hudGateLR.anims.play("HUD-WarningLR");
        }
        if (player.x > this.gate.x) {
            this.hudGateLR.setFlipX(false);
            this.hudGateLR.setTint("0x10E9E3");
            this.hudGateLR.setVisible(true);
            this.hudGateLR.anims.play("HUD-WarningLR");
        }
        if (player.y < this.gate.y) {
            this.hudGateUD.setFlipY(false);
            this.hudGateUD.setTint("0x10E9E3");
            this.hudGateUD.setVisible(true);
            this.hudGateUD.anims.play("HUD-WarningUD");
        }
        if (player.y > this.gate.y) {
            this.hudGateUD.setFlipY(true);
            this.hudGateUD.setTint("0x10E9E3");
            this.hudGateUD.setVisible(true);
            this.hudGateUD.anims.play("HUD-WarningUD");
        }
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
