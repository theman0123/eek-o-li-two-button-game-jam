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
        // add to scene
        this.scene.add.existing(this);
        // modify size
        this.setDisplaySize(scene.game.config.width, scene.game.config.height);
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
    }
}
