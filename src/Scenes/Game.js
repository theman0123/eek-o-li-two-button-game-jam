import "phaser";
import Player from "../Sprites/Player";
import Gate from "../Sprites/Gate";
import Enemy from "../Sprites/Enemy";
import Enemies from "../Groups/Enemies";
import PowerUps from "../Groups/PowerUps";
import PowerUp from "../Sprites/PowerUp";
// import { MatterAttractors } from "matter-attractors";

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
                // this.time.addEvent({
                //     delay: 1000,
                //     callback: () => this.lose(this.enemy, this.player),
                //     callbackScope: this.scene,
                // });
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
        // enable attractor plugin for lose frames
        // this.plugins.installScenePlugin(
        //     "matterAttractorsPlugin",
        //     MatterAttractors,
        //     "matterAttractors",
        // );

        // this.matter.use(MatterAttractors);
        // this.matter.system.enableAttractorPlugin();
        // listen for resize events
        this.events.on("resize", this.resize, this);

        // create Player
        this.player = new Player(this.matter.world, this, 300, 350, {
            plugin: {
                attractors: [
                    function(bodyA, bodyB) {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                            y: (bodyA.position.y - bodyB.position.y) * 0.000001,
                        };
                    },
                ],
            },
        });
        this.player.anims.play("tumble");
        this.test = this.matter.add.image(400, 800, "gate", null, {
            shape: {
                type: "circle",
                radius: 64,
            },
            plugin: {
                attractors: [
                    function(bodyA, bodyB) {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                        };
                    },
                ],
            },
        });
        this.matter.add.mouseSpring();

        console.log(this, this.plugins, this.plugins.scenePlugins);
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
        });

        // enemy

        this.enemy = new Enemy(this.matter.world, this, 350, 450, {
            x: this.player.x,
            y: this.player.y,
        });
        this.enemy.anims.play("move-enemy");

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
