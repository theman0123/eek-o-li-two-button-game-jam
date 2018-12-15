import "phaser";
import PowerUp from "../Sprites/PowerUp";
import { castDie } from "../utils";

export default class PowerUpsGroup extends Phaser.GameObjects.Group {
    constructor(world, scene, player, info) {
        super(world);
        this.scene = scene;
        this.info = info;
        this.maxSize = this.info.max;

        // this.spreadOut();
        this.createPowerUps(world, player, info);
    }

    createPowerUps(world, player, info) {
        for (let i = 0; i < info.num; i++) {
            let powerup = new PowerUp(
                world,
                castDie(player.x + 3, player.x + 3),
                castDie(player.y + 3, player.y + 3),
            );
            this.add(powerup);
        }
    }
}
