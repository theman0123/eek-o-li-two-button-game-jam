import "phaser";
import { castDie } from "../utils";
import Enemy from "../Sprites/Enemy";

export default class EnemiesGroup extends Phaser.GameObjects.Group {
    constructor(world, scene, player, info) {
        super(scene);

        this.createEnemies(world, player, info, scene);
    }
    // create enemies using basic for loop
    createEnemies(world, player, info, scene) {
        for (let i = 0; i < info.num; i++) {
            let enemy = new Enemy(
                world,
                castDie(
                    player.x + info.maxStartDistance,
                    player.x + info.minStartDistance,
                ),
                castDie(
                    player.y + info.maxStartDistance,
                    player.y + info.minStartDistance,
                ),
                scene,
            );
            this.add(enemy);
        }
    }
}
