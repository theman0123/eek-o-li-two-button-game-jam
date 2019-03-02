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
        

        this.scene.start("Preloader");
    }
}
