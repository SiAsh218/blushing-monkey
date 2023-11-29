import Game from "./classes/Game.js";
import Player from "./classes/Player.js";
import canvas from "./classes/Canvas.js";
import KeysHandler from "./classes/KeysHandler.js";

const keysHandler = new KeysHandler();

// create player
const player = new Player({
  position: { x: 200, y: 300 },
  canvas,
  keysHandler,
});

// create game
const game = new Game(player, canvas);

game.init(1);
