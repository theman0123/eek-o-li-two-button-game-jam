import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import EnemiesGroup from "../Groups/EnemiesGroup";
import PowerUps from "../Groups/PowerUpsGroup";
import { castDie } from "../utils";

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
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
            this.info.level > 1
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
        // handle world bounds
        this.createWorldBounds();
        this.createVisibleBounds();
        // listen for resize events
        this.events.on("resize", this.resize, this);
        // create Player
        this.player = new Player(
            this.matter.world,
            this.info.bounds.width / 2,
            this.info.bounds.height / 2,
            this,
        );
        this.player.isAlive = false;

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

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);

        this.addCollisions();
        this.hudScene = this.scene.get("HUD");

        // remove later
        // this.lose(this.enemies, this.enemies.getChildren()[0], this.player);
    }

    createWorldBounds() {
        // set world bounds
        this.matter.world.setBounds(
            0,
            0,
            this.info.bounds.width,
            this.info.bounds.height,
            115,
        );
    }

    createVisibleBounds() {
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

        this.innerBorderOutline = this.add.graphics();
        this.innerBorderOutline
            .fillGradientStyle(0x224769, 0x7693ae, 0xa53489, 0xa53489)
            .setDepth(0);
        this.outerBorderOutline = this.add
            .graphics({
                fillStyle: { color: 0x5ce1d8 },
            })
            .setDepth(-1);
        this.innerBorderOutline.fillRectShape(this.innerBoundary);

        this.outerBorderOutline.fillRectShape(this.outerBoundary);
    }

    //handle hud scene
    handleHUDScene() {
        this.hudScene = this.scene.get("HUD");
        // destroy HUD elements
        if (!this.player.isAlive && this.info.player.lives <= 0) {
            this.hudScene.gameOver();
        } //else this.hudScene.removeTextElements();
    }
    // lose
    lose(enemies, enemy, player) {
        player.isAlive = false;
        this.info.player.lives--;
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
        this.cameras.main.fade(1600, 0, 0, 0);
        this.cameras.main.on(
            "camerafadeoutcomplete",
            () => {
                // check # of lives
                if (this.info.player.lives > 0) {
                    this.handleHUDScene();
                    this.loadingLevel = true;
                    this.scene.restart(this.info);
                } else {
                    // game over
                    this.cameras.main.fadeIn(2000);
                    // this.handleHUDScene();
                    this.hudScene.gameOver();
                }
            },
            this,
        );
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
    restart(info) {
        // TODO: don't play gate animation
        this.win(info);
    }

    update() {}
    win(info) {
        // TODO: clear all text ???

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
            // level up!
            this.info.level++;
            this.cameras.main.fade(1500, 0, 0, 0);
            this.cameras.main.on("camerafadeoutcomplete", () => {
                this.loadingLevel = true;
                console.log("win, camera fade");
                // TODO don't allow try again button to be clicked till after fade!!
                // handle HUD scene elements
                // this.handleHUDScene();

                //  this.scene.restart(this.info)
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
                        lives: 1,
                    },
                });
            });
        }
    }
}
