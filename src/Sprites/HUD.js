import "phaser";

export default class HUD extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(
            scene,
            scene.game.config.width,
            scene.game.config.height,
            "HUD",
            7,
        );
        this.scene = scene;
        // add to scene
        this.scene.add.existing(this);
        // place on top layer
        this.setDepth(2);
        // fix to camera
        this.setScrollFactor(0);
        // align to view
        this.setOrigin(1);
        // set invisible
        this.setVisible(false);
        // make sensors see through
        this.setAlpha(0.4);
        // modify size
        this.resize();
        // resize on screen adjustment
        this.scene.events.on("resize", this.resize, this);
    }

    resize() {
        // DON'T REMOVE: will miss last resize event if no delay
        this.hudTimer = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.setPosition(
                    this.scene.game.config.width,
                    this.scene.game.config.height,
                ).setDisplaySize(
                    this.scene.game.config.width,
                    this.scene.game.config.height,
                );
            },
            repeat: 2,
        });
    }
}
