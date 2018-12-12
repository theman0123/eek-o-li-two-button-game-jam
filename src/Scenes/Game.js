import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import Enemy from "../Sprites/Enemy";
import Enemies from "../Groups/Enemies";
import PowerUps from "../Groups/PowerUps";
import PowerUp from "../Sprites/PowerUp";

export default class BootScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        // const { level, powerUps } = this.info;
        // bad logic
        this.info.level === 0 ? this.info.level++ : this.info.level++;
        // console.log(this.info);
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
                this.time.addEvent({
                    delay: 1000,
                    callback: this.lose(),
                    callbackScope: this,
                    repeat: -1,
                });
            },
        });
        // power-up
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.powerup,
            callback: () => {
                this.time.addEvent({
                    delay: 1000,
                    callback: this.powerup.activatePowerUp(
                        this.player,
                        this.powerup,
                        this,
                    ), // be sure you get correct one after changing to a group
                    callbackScope: this.scene,
                    repeat: -1,
                });
            },
        });
    }

    create() {
        this.matter.world.setBounds(0, 0, 1800, 1800, 15);

        // listen for resize events
        this.events.on("resize", this.resize, this);

        // create Player
        this.player = new Player(this.matter.world, this, 300, 200);
        this.player.anims.play("tumble");

        // player movement and related listeners
        this.input.on("pointerdown", () => {
            this.player.move = false;
            this.events.emit("beginTumble", this);
        });
        this.input.on("pointerup", () => {
            this.player.move = true;
            this.events.emit("moveEek", this.player, this);
        });

        // enemy

        this.enemy = new Enemy(this.matter.world, this, 550, 350, {
            x: this.player.x,
            y: this.player.y,
        });
        this.enemy.anims.play("move-enemy");

        // gate
        this.gate = new Gate(this.matter.world, 300, 100, "gate"); //this.matter.add.sprite(300, 100, "gate");
        this.gate.anims.play("flash");

        // create power-ups group
        this.powerup = new PowerUp(this.matter.world, this, 250, 300);
        // this.powerUpsGroup = new PowerUps(
        //     this.physics.world,
        //     this,
        //     this.info.powerUps,
        // );

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);

        this.addCollisions();
    }

    lose() {
        console.log("you lost");
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
        this.gate.anims.stop("flash");
        this.player.setVisible(false);
        this.gate.anims.play("levelWin");
        this.cameras.main.fade(800, 0, 0, 0);
        this.cameras.main.on("camerafadeoutcomplete", () => {
            this.scene.restart(this.info);
        });
    }

    update() {}
}
