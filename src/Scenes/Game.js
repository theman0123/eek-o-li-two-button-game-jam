import "phaser";
import Player from "../Sprites/Player";
import Enemy from "../Sprites/Enemy";
import Enemies from "../Groups/Enemies";

export default class BootScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(info) {
        this.info = info;
        this.info.powerUps = {
            num: 3,
            distanceFromPlayer: 200,
        };
    }

    preload() {}

    // ALPHABETICAL BY METHOD

    create() {
        // listen for resize events
        this.events.on("resize", this.resize, this);

        // create Player
        this.player = new Player(this, 0, 0).setOrigin(0, 0);

        this.player.anims.play("engage");

        // enemy

        this.enemy = new Enemy(this, 50, 50).setOrigin(0, 0);
        this.enemy.anims.play("move-enemy");

        // create coins
        // args -> #object_layer_from_tiled, #object, config_object
        // this.coins = this.map.createFromObjects('Coins', 'Coin', { key: 'coin' });
        // this.coinsGroup = new Coins(this.physics.world, this, [], this.coins);

        // gate
        this.gate = this.make.sprite({
            key: "power-up",
        });
        this.gate.setScale(5);
        this.gate.anims.play("flash");

        // create power-ups randomly
        this.createPowerUp();

        // update camera to follow this.player
        this.cameras.main.startFollow(this.player);
    }

    // randomly place power-ups
    createPowerUp() {
        const { num, distanceFromPlayer } = this.info.powerUps;
        this.powerUps = this.add.group();

        // for loops and such aren't working to add these to the array?
        if (Math.random() * 10 >= 5) {
            let powerup = this.make
                .image({
                    key: "power-up",
                    x: Math.floor(Math.random() * distanceFromPlayer),
                    y: Math.floor(Math.random() * distanceFromPlayer),
                })
                .setScale(4);
            this.physics.add.existing(powerup, true);
            this.powerUps.add(powerup, true);
        }
        let powerup = this.make
            .image({
                key: "power-up",
                x: Math.floor(Math.random() * -distanceFromPlayer),
                y: Math.floor(Math.random() * -distanceFromPlayer),
            })
            .setScale(4);
        this.physics.add.existing(powerup, true);
        this.powerUps.add(powerup, true);

        console.log(this.powerup, this.powerUps);
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

    update() {}
}
