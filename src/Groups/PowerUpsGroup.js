import "phaser";
import PowerUp from "../Sprites/PowerUp";
import { castDie } from "../utils";

export default class PowerUpsGroup extends Phaser.GameObjects.Group {
    constructor(world, scene, player, info) {
        super(world);
        this.scene = scene;
        this.info = info;
        this.maxSize = this.info.max;

        this.createPowerUps(world, player, info);
    }

    createPowerUps(world, player, info) {
        for (let i = 0; i < info.powerups.num; i++) {
            let powerup = new PowerUp(
                world,
                castDie(info.worldBounds.width, 0),
                castDie(info.worldBounds.height, 0),
            );
            this.add(powerup);
        }
    }
}
