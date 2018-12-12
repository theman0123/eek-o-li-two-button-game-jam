// import "phaser";
// import PowerUp from "../Sprites/PowerUp";
// import { castDie } from "../utils";

// export default class PowerUps extends Phaser.Physics.Matter.Group {
//     constructor(world, scene, config) {
//         super(world, scene, config);
//         this.scene = scene;
//         this.config = config;
//         this.maxSize = this.config.max;
//         this.createMultiple({
//             active: true,
//             classType: PowerUp,
//             key: "power-up",
//             repeat: this.maxSize - 1,
//             setScale: {
//                 x: 4,
//                 y: 4,
//             },
//         });
//         this.spreadOut();
//     }

//     // spread power-ups out
//     spreadOut() {
//         this.getChildren().forEach(powerup => {
//             // console.log("powerup", powerup);
//             powerup.x = castDie(this.config.distanceFromPlayer);
//             powerup.y = castDie(this.config.distanceFromPlayer);
//             // console.log(powerup.prototype instanceof PowerUp, this.classType);
//         });
//     }
// }
