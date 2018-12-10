export default {
    type: Phaser.AUTO,
    parent: "two-button-jam",
    canvas: document.getElementById("game"),
    width: 1500, // window.innerWidth
    height: 1500, // window.innerHeight
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
};
