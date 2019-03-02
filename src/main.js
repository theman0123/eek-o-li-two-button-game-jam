import "phaser";
import config from "./config";
import GameScene from "./Scenes/Game";
import BootScene from "./Scenes/Boot";
import HUDScene from "./Scenes/HUD";
import PreloaderScene from "./Scenes/Preloader.js";

class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add("Boot", BootScene);
        this.scene.add("Game", GameScene);
        this.scene.add("HUD", HUDScene);
        this.scene.add("Preloader", PreloaderScene);

        this.scene.start("Boot");
    }
}

window.game = new Game();
window.addEventListener("resize", event => {
    window.game.resize(window.innerWidth, window.innerHeight);
});
