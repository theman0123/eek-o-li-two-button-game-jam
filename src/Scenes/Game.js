import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import Enemy from "../Sprites/Enemy";
import EnemiesGroup from "../Groups/EnemiesGroup";
import PowerUps from "../Groups/PowerUps";
import PowerUp from "../Sprites/PowerUp";
import HUD from "../Sprites/HUD";

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        // this.info.enemies;
        // this.info.enemies.max = 1;
        console.log(this.info);
        // bad logic: jumps from level 1 to 3 sometimess
        this.info.level === 0 ? this.info.level++ : this.info.level++;
        // console.log(this.info);
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
            objectB: this.enemy,
            callback: () => {
                this.lose(this.enemy, this.player);
            },
        });
        // power-up
        // this.matterCollision.addOnCollideStart({
        //     objectA: this.player,
        //     objectB: this.powerup,
        //     callback: () => {
        //         this.time.addEvent({
        //             delay: 1000,
        //             callback: this.powerup.activatePowerUp(
        //                 this.player,
        //                 this.powerup,
        //                 this,
        //             ), // be sure you get correct one after changing to a group
        //             callbackScope: this.scene,
        //             repeat: -1,
        //         });
        //     },
        // });
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
            this.player.move = false;
            this.events.emit("beginTumble", this);
        });
        // release touch or click for thrust
        this.input.on("pointerup", () => {
            this.player.move = true;
            this.events.emit("moveEek", this.player, this);
            // this.emitEnemyMovementTimer.start();
        });

        // enemy
        this.enemies = new EnemiesGroup(
            this.matter.world,
            this,
            this.player,
            this.info.enemies,
        );
        this.enemy = new Enemy(this.matter.world, 500, 250);
        console.log(this.enemies);
        this.enemy.anims.play("move-enemy");
        this.emitEnemyMovementTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                this.events.emit("gatherEnemyMovements", this);
                // console.log("gather enemy movement");
            },
            repeat: -1,
        });

        // gate
        this.gate = new Gate(this.matter.world, 300, 100, "gate");
        this.gate.anims.play("flash");

        // create power-ups group
        // this.powerup = new PowerUp(this.matter.world, this, 250, 300);
        // this.powerUpsGroup = new PowerUps(
        //     this.physics.world,
        //     this,
        //     this.info.powerUps,
        // );

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);

        this.addCollisions();
    }

    lose(enemy, player) {
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
