import "phaser";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, scene) {
        super(world, x, y, "eek-tumble");
        this.scene = scene;
        this.move = false;
        this.airFriction = 0.05;
        // is alive?
        this.isAlive = false;
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
        this.setFrictionAir(0.005);
        // play animation
        this.play("tumble");

        // player movement and related listeners
        // click or touch for tumble
        this.scene.input.on("pointerdown", () => {
            if (this.isAlive) {
                this.move = false;
                this.setTimerTumble = this.scene.time.addEvent({
                    delay: 100,
                    callback: this.tumble,
                    repeat: -1,
                    callbackScope: this,
                });
                this.handleAnims();
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
            }
        });

        this.scene.events.on("killSpeedTracker", player => {
            player.speedTracker.remove();
        });
    }

    // move eek
    moveEek() {
        // handle body physics
        this.setFrictionAir(0.005);
        this.thrust(0.025);
        this.thrustLeft(0.123);
        // check speed for when eek slows to a crawl
        this.speedTracker = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.body.speed <= 3) {
                    this.move = false;
                    this.scene.events.emit("killSpeedTracker", this);
                    this.handleAnims();
                    // execute tumble (once) to apply friction
                    this.tumble();
                }
            },
            repeat: -1,
        });
    }

    handleAnims() {
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
        this.setFrictionAir(this.airFriction);
        !this.move ? this.setAngle(this.angle + 30) : null;
    }
}
