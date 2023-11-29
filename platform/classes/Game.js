import level1 from "../levels/Level1.js";

export default class Game {
  constructor(player, canvas) {
    this.level = 1;
    this.levels = [level1];
    this.player = player;
    this.player.setLevel(this.levels[this.level - 1]);
    this.gravity = 1.2;
    this.fps = 60; // for fps calculation
    this.fpsInterval; // for fps calculation
    this.last; // for fps calculation
    this.startTime; // for fps calculation
    this.now; // for fps calculation
    this.elapsed; // for fps calculation
    this.canvas = canvas;
    this.display = {
      speed: document.getElementById("display--speed"),
      positionX: document.getElementById("display--position-x"),
      scrollX: document.getElementById("display--scroll-x"),
    };
  }

  // method to initiate the game
  init(level) {
    this.level = level;
    // get fps interval in ms
    this.fpsInterval = 1000 / this.fps;
    //   // set last and start frame time to now
    this.last = Date.now();
    this.startTime = this.last;

    this.animate();
  }

  updateStatusDisplay() {
    const roundNum = (num) => {
      return Math.round(num * 100) / 100;
    };

    this.display.speed.textContent = `Velocity X: ${roundNum(
      this.player.velocity.x
    )}, Velocity Y: ${roundNum(this.player.velocity.y)}`;
    this.display.positionX.textContent = `Position X: ${roundNum(
      this.player.position.x
    )}`;
    this.display.scrollX.textContent = `Scroll X: ${roundNum(
      this.canvas.scrollOffsetX
    )}`;
  }

  // method to stabilise the framerate
  applyFPS() {
    this.now = Date.now();
    // calculate ms elapsed since last frame
    this.elapsed = this.now - this.last;

    // if elapsed hasn't exceeded the fps interval return
    if (this.elapsed < this.fpsInterval) {
      this.screenRefreshNeeded = false;
      return;
    }

    // set last to now
    this.last = this.now;
    this.screenRefreshNeeded = true;
  }

  // method to animate the game
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.applyFPS();

    if (!this.screenRefreshNeeded) return;

    this.canvas.clearCanvas();

    this.levels[this.level - 1].platforms.forEach((platform) =>
      platform.draw()
    );

    this.levels[this.level - 1].blocks.forEach((block) => block.draw());

    this.player.update();

    this.updateStatusDisplay();
  }
}
