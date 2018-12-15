import "phaser";
import HUD from "../Sprites/HUD";

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: "HUD", active: true });
    }

    init() {}

    // ALPHABETICAL BY METHOD

    create() {
        // get a reference to game scene
        this.gameScene = this.scene.get("Game");

        // get info
        this.gameScene.events.on("info", info => {
            console.log(info, this);
            // create level text
            this.level = this.add.text(25, 25, `Level: ${info.level}`, {
                fontSize: "52px",
                fill: "#E8EFEE",
                backgroundColor: "#DA5526",
                strokeThickness: 6,
            });
        });
    }
}
