import "phaser";
import { castDie } from "utils";
import Enemy from "../Sprites/Enemy";

export default class EnemiesGroup extends Phaser.GameObjects.Group {
    constructor(world, scene, player, info) {
        super(scene);

        this.createEnemies(world, player, info);
    }
    createEnemies(world, player, info) {
        for (let i = 0; i < info.num; i++) {
            let enemy = new Enemy(
                world,
                castDie(player.x + 50),
                castDie(player.y + 50),
            );
            console.log("making enemies");
        }
    }
}
