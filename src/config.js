import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import UIPlugin from "../plugins/ui-minified";

export default {
    type: Phaser.AUTO,
    parent: "two-button-jam",
    canvas: document.getElementById("game"),
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: "matter",
        matter: {
            gravity: { scale: 0 },
            // debug: true,
        },
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin, // The plugin class
                key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
                mapping: "matterCollision", // Where to store in the Scene, e.g. scene.matterCollision
            },
            {
                plugin: UIPlugin,
                key: "rexUI",
                mapping: "rexUI",
            },
        ],
    },
};
