import "phaser";
import { castDie } from "utils";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y) {
        super(world, x, y, "eek-tumble");
        this.scene = scene;
        this.move = false;

        //  add our player to the scene
        this.scene.add.existing(this);
        // console.log(this.scene.matter, this, this.plugin);
        //  scale player
        this.setScale(4);
        //  set depth
        this.depth = 1;
        // change hit box size
        this.setBody({ type: "rectangle", width: 30, height: 60 });
        // modify mass: lower number adds velocity
        this.setMass(5);
        // setOrigin is an x, y axis where 1, 1 is top and left and 0, 0 is bottom right
        this.setOrigin(0.5, 0.65);

        // tumble event
        this.scene.events.on("beginTumble", scene => {
            scene.player.handleAnims(scene);
            scene.time.addEvent({
                delay: 150,
                callback: this.tumble,
                callbackScope: scene.player,
                repeat: -1,
            });
        });
        // move event
        this.scene.events.on("moveEek", (player, scene) => {
            scene.time.removeAllEvents();
            this.move = true;
            this.moveEek(player, scene);
            scene.events.emit("playerPosition", scene, player);
        });

        this.scene.events.on("killSpeedTracker", player => {
            player.speedTracker.remove();
        });
    }

    // move eek
    moveEek(player, scene) {
        // handle animation
        player.handleAnims(scene);
        // handle body physics
        player.setFriction(0, 0);
        // give thrust/speed
        scene.player.thrust(0.125);
        scene.player.thrustLeft(0.123);
        // check speed for when eek slows to a crawl
        player.speedTracker = scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (player.body.speed <= 1) {
                    player.move = false;
                    scene.events.emit("killSpeedTracker", player);
                    player.handleAnims(scene);
                }
            },
            callbackScope: scene,
            repeat: -1,
        });
    }

    handleAnims(scene, desiredAnims) {
        // not working correctly animations messed up
        const { currentAnim, isPlaying } = scene.player.anims;
        console.log(currentAnim.key, isPlaying, scene.player.anims);
        // check for current texture-- switch animation
        if (!scene.player.move) {
            scene.player.anims.stop("engage", false);
            scene.player.anims.play("tumble");
        } else {
            scene.player.anims.stop("tumble");
            scene.player.anims.play("engage", false);
        }
    }
    // handle body to create tumble physics
    tumble() {
        this.setFriction(10, 0.2);
        !this.move ? this.setAngle(this.angle + castDie(90, -90)) : null;
    }
}
