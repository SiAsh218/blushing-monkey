export default class Game {
  constructor(platforms, player, canvas) {
    this.level = 1;
    this.platforms = platforms;
    this.player = player;
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
    this.display.speed.textContent = `Speed: ${this.player.currentSpeed}`;
    this.display.positionX.textContent = `Position X: ${this.player.position.x}`;
    this.display.scrollX.textContent = `Scroll X: ${this.canvas.scrollOffsetX}`;
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

    this.platforms.forEach((platform) => platform.draw());

    this.player.update();

    this.updateStatusDisplay();
  }
}
