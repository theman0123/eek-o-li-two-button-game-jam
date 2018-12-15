import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import Enemy from "../Sprites/Enemy";
import EnemiesGroup from "../Groups/EnemiesGroup";
import PowerUps from "../Groups/PowerUpsGroup";
import PowerUp from "../Sprites/PowerUp";
import HUD from "../Sprites/HUD";

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        console.log(this.info);
        // bad logic: jumps from level 1 to 3 sometimess
        this.info.level === 0 ? this.info.level++ : this.info.level++;

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
            }
        });
    }

    create() {
        this.matter.world.setBounds(0, 0, 1800, 1800, 115);
        // listen for resize events
        this.events.on("resize", this.resize, this);
        // create Player
        this.player = new Player(this.matter.world, 300, 350);

        // player movement and related listeners
        // click or touch for tumble
        this.input.on("pointerdown", () => {
            if (this.player.isAlive) {
                this.player.move = false;
                this.events.emit("beginTumble", this);
            }
        });
        // release touch or click for thrust
        this.input.on("pointerup", () => {
            if (this.player.isAlive) {
                this.player.move = true;
                this.events.emit("moveEek", this.player, this);
            }
        });

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
        this.cameras.main.startFollow(this.gate);
        this.gate.anims.stop("flash");
        this.player.setVisible(false);
        this.gate.anims.play("levelWin");
        this.cameras.main.fade(1500, 0, 0, 0);
        this.cameras.main.on("camerafadeoutcomplete", () => {
            this.scene.restart(this.info);
        });
    }

    update() {}
}
