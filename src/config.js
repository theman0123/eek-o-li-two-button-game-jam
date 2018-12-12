import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

export default {
    type: Phaser.AUTO,
    parent: "two-button-jam",
    canvas: document.getElementById("game"),
    width: 1500, // window.innerWidth
    height: 1500, // window.innerHeight
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: "matter",
        matter: {
            gravity: { scale: 0 },
            debug: true,
        },
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin, // The plugin class
                key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
                mapping: "matterCollision", // Where to store in the Scene, e.g. scene.matterCollision
            },
        ],
    },
};