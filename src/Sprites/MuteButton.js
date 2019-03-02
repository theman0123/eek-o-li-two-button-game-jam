import "phaser";

export default class MuteButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, frame) {
        super(scene, x, y, "mute-button", frame);
        // console.log(this);
        // make scene available to all methods by placing it on 'this'
        this.scene = scene;
        // add our Image to the scene
        this.scene.add.existing(this);
        // responds to pointer events
        this.setInteractive();
        // set to mute
        this.scene.sound.mute = true;
        this.setAlpha(0.5);
        this.setScale(0.8);
    }

    mute() {
        this.scene.sound.mute = true;
        this.setFrame(1);
        this.setAlpha(0.5);
    }

    unmute() {
        this.scene.sound.mute = false;
        this.setFrame(0);
        this.setAlpha(0.8);
    }

    handleMuteSettings() {
        this.scene.sound.mute ? this.unmute() : this.mute();
    }
}
