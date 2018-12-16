import "phaser";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, scene) {
        super(world, x, y, "eek-tumble");
        // still having context issues with sprite on restart...
        this.scene = scene;
        this.move = false;
        // is alive?
        this.isAlive = true;
        //  add our player to the scene
        this.scene.add.existing(this);
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
        // change friction
        this.setFriction(5);
        // play animation
        this.play("tumble");

        // player movement and related listeners
        // click or touch for tumble
        // request enemy location entering tumble
        this.scene.input.on("pointerdown", () => {
            if (this.isAlive) {
                this.move = false;
                // was this
                this.scene.events.emit("beginTumble", this, this.scene);
                this.scene.events.emit("requestEnemyLocation", this, this);
                this.scene.events.emit("gateSense", this, this.scene);
            }
        });

        // release touch or click for thrust
        this.scene.input.on("pointerup", () => {
            // context is eek
            if (this.isAlive) {
                this.move = true;
                this.scene.events.emit("moveEek", this, this);
                this.scene.time.removeAllEvents();
                this.move = true;
                this.moveEek();
                this.handleAnims();
                this.scene.events.emit(
                    "playerPosition",
                    (this.scene, this),
                    this,
                );
            }
        });

        // tumble event
        this.scene.events.on(
            "beginTumble",
            scene => {
                this.scene.time.addEvent({
                    delay: 150,
                    callback: this.tumble,
                    repeat: -1,
                    callbackScope: this,
                });
                this.handleAnims();
            },
            this.scene,
        );

        this.scene.events.on("killSpeedTracker", player => {
            player.speedTracker.remove();
        });
    }

    // move eek
    moveEek(scene) {
        // handle body physics
        this.thrust(0.025);
        this.thrustLeft(0.123);
        // check speed for when eek slows to a crawl
        this.speedTracker = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.body.speed <= 1) {
                    this.move = false;
                    this.scene.events.emit("killSpeedTracker", this);
                    this.handleAnims(scene);
                }
            },
            repeat: -1,
        });
    }

    handleAnims(scene) {
        // switch animation
        if (!this.move) {
            this.anims.stop("engage", false);
            this.play("tumble");
        } else {
            this.anims.stop("tumble");
            this.play("engage", false);
        }
    }
    // handle body to create tumble physics
    tumble() {
        // this.setFriction(10);
        !this.move ? this.setAngle(this.angle + 88) : null;
    }
}
