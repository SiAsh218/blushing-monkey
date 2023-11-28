import Game from "./classes/Game.js";
import Player from "./classes/Player.js";
import Platform from "./classes/Platform.js";
import Canvas from "./classes/Canvas.js";
import KeysHandler from "./classes/KeysHandler.js";

const canvas = new Canvas();
const keysHandler = new KeysHandler();

// create platforms
const platforms = [
  new Platform({
    position: { x: 0, y: 390 },
    width: 500,
    height: 20,
    canvas,
  }),
  new Platform({
    position: { x: 600, y: 390 },
    width: 800,
    height: 20,
    canvas,
  }),
  new Platform({
    position: { x: 475, y: 320 },
    width: 100,
    height: 20,
    canvas,
  }),
  new Platform({
    position: { x: 675, y: 320 },
    width: 100,
    height: 20,
    canvas,
  }),
];

// create player
const player = new Player({
  position: { x: 200, y: 300 },
  platforms,
  canvas,
  keysHandler,
});

// create game
const game = new Game(platforms, player, canvas);

game.init();
