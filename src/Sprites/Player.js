import "phaser";
import { castDie } from "utils";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y) {
        super(world, x, y, "eek-tumble");
        this.scene = scene;
        this.move = false;

        //  add our player to the scene
        this.scene.add.existing(this);

        //  scale player
        this.setScale(4);
        //  set depth
        this.depth = 1;
        // change hit box size
        this.setBody({ type: "rectangle", width: 30, height: 60 });
        // setOrigin is an x, y axis where 1, 1 is top and left and 0, 0 is bottom right
        this.setOrigin(0.5, 0.65);

        // tumble event
        this.scene.events.on("beginTumble", scene => {
            // on restarts this.scene = 'undefined'
            console.log("this.world.scene.player", scene);
            scene.player.anims.stop("engage");
            scene.player.anims.play("tumble", false);
            scene.time.addEvent({
                delay: 150,
                callback: this.tumble,
                callbackScope: this,
                repeat: -1,
            });
        });
        // move event
        this.scene.events.on("moveEek", (player, scene) => {
            scene.time.removeAllEvents();
            this.move = true;
            this.moveEek(player, scene);
            scene.events.emit("playerPosition", player, scene);
        });
        // alert movement of player

        // this.timedPlayerAlert = this.scene.time.addEvent({
        //     delay: 3500,
        //     callback: this.alertPlayerPosition,
        //     callbackScope: this,
        //     repeat: -1,
        // });
    }

    tumble() {
        !this.move ? this.setAngle(this.angle + castDie(90, -90)) : null;
    }

    // move eek
    moveEek(player, scene) {
        console.log(player.body.speed);
        scene.player.anims.stop("tumble");
        scene.player.anims.play("engage", false);
        scene.player.thrust(0.125);
        scene.player.thrustLeft(0.123);
    }

    alertPlayerPosition() {
        console.log("PLAYER ALERTING POSITION", this.body.speed);
        // check speed and change anims if slow enough

        this.scene.events.emit("playerPosition", {
            player: { x: this.x, y: this.y },
            scene: this.scene,
        });
    }
}