import "phaser";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.spritesheet("title-sprites", "assets/eek-title-screen.png", {
            frameWidth: 75,
            frameHeight: 100,
        });
    }

    // ALPHABETICAL BY METHOD

    create() {
        this.anims.create({
            key: "eek-title",
            frames: this.anims.generateFrameNames("title-sprites", {
                frames: [4, 5, 6],
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1,
        });

        this.scene.start("Preloader");
    }
}
