import "phaser";

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: "HUD", active: true });
    }

    init() {
        // this.coinsCollected = 0;
    }

    // ALPHABETICAL BY METHOD

    create() {
        // get a reference to game scene
        this.gameScene = this.scene.get("Game");
        // get info
        this.gameScene.events.on(
            "info",
            info => {
                console.log(info);
                // create level text
                this.level = this.add.text(25, 25, `Level: ${info.level}`, {
                    fontSize: "52px",
                    fill: "#E8EFEE",
                    backgroundColor: "#DA5526",
                    strokeThickness: 6,
                });
                this.level.depth = 2;
            },
            this,
        );

        // listen for enemy movement
        this.gameScene.events.on("enemyMovement", (scene, enemy) => {
            console.log("enemy in HUD");
            if (this.playerPosition) {
                let { x, y } = this.playerPosition;
                // change with groups
                this.enemyDistance = Phaser.Math.Distance.Between(
                    enemy.x,
                    enemy.y,
                    x,
                    y,
                );
                console.log("distance from eek: ", this.enemyDistance);
                console.log(Phaser.Math.Distance);
            }
        });
        this.gameScene.events.on(
            "playerPosition",
            (scene, player) => {
                this.playerPosition = {
                    x: player.x,
                    y: player.y,
                };
            },
            this,
        );
    }
}
