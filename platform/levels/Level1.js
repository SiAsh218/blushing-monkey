import Level from "./Level.js";
import canvas from "../classes/Canvas.js";
import Platform from "../classes/Platform.js";
import Block from "../classes/Block.js";

class Level1 extends Level {
  constructor() {
    super();

    this.platforms = [
      new Platform({
        position: { x: 475, y: 340 },
        width: 100,
        height: 50,
        canvas,
      }),
      new Platform({
        position: { x: 675, y: 300 },
        width: 100,
        height: 20,
        canvas,
      }),
      new Platform({
        position: { x: 875, y: 250 },
        width: 100,
        height: 20,
        canvas,
      }),
      new Platform({
        position: { x: 1500, y: 270 },
        width: 200,
        height: 20,
        canvas,
      }),
      new Platform({
        position: { x: 2450, y: 320 },
        width: 40,
        height: 20,
        canvas,
      }),
    ];

    this.blocks = [
      new Block({
        position: { x: 0, y: 390 },
        width: 1000,
        height: 20,
        canvas,
      }),
      new Block({
        position: { x: 1000, y: 350 },
        width: 1000,
        height: 60,
        canvas,
      }),
      new Block({
        position: { x: 1400, y: 270 },
        width: 100,
        height: 30,
        canvas,
      }),
      new Block({
        position: { x: 1700, y: 270 },
        width: 100,
        height: 30,
        canvas,
      }),
      new Block({
        position: { x: 2080, y: 390 },
        width: 1000,
        height: 20,
        canvas,
      }),
      new Block({
        position: { x: 2300, y: 340 },
        width: 50,
        height: 50,
        canvas,
      }),
      new Block({
        position: { x: 2350, y: 290 },
        width: 50,
        height: 100,
        canvas,
      }),
      new Block({
        position: { x: 2400, y: 240 },
        width: 50,
        height: 150,
        canvas,
      }),
    ];
  }
}

export default new Level1();
