import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import EnemiesGroup from "../Groups/EnemiesGroup";
import PowerUps from "../Groups/PowerUpsGroup";
import HUD from "../Sprites/HUD";
import { castDie } from "../utils";

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        this.info.level++;
        // ensure correct restart
        this.loadingLevel = false;
        // adjust difficulty
        // size = larger
        this.info.bounds.width += 400;
        this.info.bounds.height += 200;
        // less powerups
        this.info.powerUps.num += 2;
        // more enemies
        this.info.enemies.num += 2;
        // randomly move the gate
        this.info.gateLocation =
            this.info.level > 2
                ? {
                      x: castDie(this.info.bounds.width),
                      y: castDie(this.info.bounds.height),
                  }
                : { x: 200, y: 400 };

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
        const { bottom, left, top, right } = this.matter.world.walls;
        // gate collides with bounds
        this.matterCollision.addOnCollideStart({
            objectA: [bottom, left, right, top],
            objectB: this.gate,
            callback: eventData => {
                if (eventData.gameObjectB.body.velocity.x > 0) {
                    eventData.gameObjectB.setVelocityX(castDie(-1, -3));
                    eventData.gameObjectB.setVelocityY(castDie(-1, -3));
                } else {
                    eventData.gameObjectB.setVelocityX(castDie(3, 1));
                    eventData.gameObjectB.setVelocityY(castDie(3, 1));
                }
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
                    this.player, // player
                    eventData.gameObjectB, // power up
                    this, // scene
                );
            },
        });
    }

    create() {
        // set world bounds
        this.matter.world.setBounds(
            0,
            0,
            this.info.bounds.width,
            this.info.bounds.height,
            115,
        );

        // refactor
        // highlight bounds
        // inner boundary
        this.innerBoundary = new Phaser.Geom.Rectangle(
            0,
            0,
            this.info.bounds.width,
            this.info.bounds.height,
        );
        this.outerBoundary = new Phaser.Geom.Rectangle(
            -10,
            -10,
            this.info.bounds.width + 20,
            this.info.bounds.height + 20,
        );

        this.innerBorderOutline = this.add
            .graphics({
                fillStyle: { color: 0x030963 },
            })
            .setDepth(0);
        // 5E6161
        this.outerBorderOutline = this.add
            .graphics({
                fillStyle: { color: 0x5ce1d8 },
            })
            .setDepth(-1);
        this.innerBorderOutline.fillRectShape(this.innerBoundary);
        this.outerBorderOutline.fillRectShape(this.outerBoundary);

        // listen for resize events
        this.events.on("resize", this.resize, this);
        // create Player
        this.player = new Player(
            this.matter.world,
            this.info.bounds.width / 2,
            this.info.bounds.height / 2,
            this,
        );

        // enemy

        this.enemies = new EnemiesGroup(this.matter.world, this, this.player, {
            enemies: this.info.enemies,
            worldBounds: this.info.bounds,
        });

        // gate
        this.gate = new Gate(
            this.matter.world,
            this.info.gateLocation.x,
            this.info.gateLocation.y,
            "gate",
            this.info.level,
        );

        // create power-ups group
        this.powerUpsGroup = new PowerUps(
            this.matter.world,
            this,
            this.player,
            { powerups: this.info.powerUps, worldBounds: this.info.bounds },
        );
        // call avoid function on enemies for powerup
        this.events.on("powerupActivated", player => {
            let enemyArray = this.enemies.getChildren();
            enemyArray.forEach(enemy => {
                enemy.avoidPlayer(player);
                enemy.executeMovement(this);
            });
        });

        // HUD
        this.hudLR = new HUD(this);
        this.hudUD = new HUD(this);

        this.events.on("enemyLocationToHUD", enemy => {
            this.hudEnemyLocation(enemy, this.player);
        });

        // hud for gate location
        this.hudGateLR = new HUD(this);
        this.hudGateUD = new HUD(this);
        this.events.on("gateSense", player => {
            // logic for executing gateSense
            this.hudGateLocation(player);
        });

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);

        this.addCollisions();
        // start music
        this.sound.play("main-theme");
    }

    hudEnemyLocation(enemy, player) {
        this.enemyAlertStatus =
            Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) <
            500
                ? "HIGH_ALERT"
                : "LOW_ALERT";
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

    hudGateLocation(player) {
        if (player.x < this.gate.x) {
            this.hudGateLR.setFlipX(true);
            this.hudGateLR.setTint("0x0013FF");
            this.hudGateLR.setVisible(true);
            this.hudGateLR.anims.play("HUD-WarningLR");
        }
        if (player.x > this.gate.x) {
            this.hudGateLR.setFlipX(false);
            this.hudGateLR.setTint("0x0013FF");
            this.hudGateLR.setVisible(true);
            this.hudGateLR.anims.play("HUD-WarningLR");
        }
        if (player.y < this.gate.y) {
            this.hudGateUD.setFlipY(false);
            this.hudGateUD.setTint("0x0013FF");
            this.hudGateUD.setVisible(true);
            this.hudGateUD.anims.play("HUD-WarningUD");
        }
        if (player.y > this.gate.y) {
            this.hudGateUD.setFlipY(true);
            this.hudGateUD.setTint("0x0013FF");
            this.hudGateUD.setVisible(true);
            this.hudGateUD.anims.play("HUD-WarningUD");
        }
    }

    lose(enemies, enemy, player) {
        player.isAlive = false;
        player.setVisible(false);
        // remove matter body from scene
        this.matter.world.remove(this.player);
        // remove listeners?
        // remove sound
        this.sound.stopAll();
        // play lose sound
        this.sound.play("game-lose");
        // code here
        this.cameras.main.startFollow(enemy);
        enemy.anims.play("eek-lose");
        this.cameras.main.fade(1500, 0, 0, 0);
        this.cameras.main.on(
            "camerafadeoutcomplete",
            () => {
                this.scene.restart(this.info);
            },
            this,
        );

        this.loadingLevel = true;
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
    // win
    restart() {
        if (!this.loadingLevel) {
            // adjust camera
            this.cameras.main.startFollow(this.gate);
            // remove player from scene
            this.player.setVisible(false);
            this.matter.world.remove(this.player);
            // play win animation
            this.gate.anims.stop("flash");
            this.gate.anims.play("levelWin");
            // stop sounds/music
            this.sound.stopAll();
            // play win sound
            this.sound.play("level-win");
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
