export default class Platform {
  constructor({ position, height, width, canvas }) {
    this.position = position;
    this.height = height;
    this.width = width;
    this.canvas = canvas;
  }

  getRightPosition() {
    return this.position.x + this.width;
  }

  getLeftPosition() {
    return this.position.x;
  }

  getBottomPosition() {
    return this.position.y + this.height;
  }

  getTopPosition() {
    return this.position.y;
  }

  scrollX(speed) {
    this.position.x -= speed;
  }

  draw() {
    this.canvas.ctx.fillStyle = "RGBA(0, 0, 0, 0.3)";
    this.canvas.ctx.strokeStyle = "black";
    this.canvas.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  detectPlayer(player) {
    if (
      player.getRightPosition() > this.getLeftPosition() &&
      player.getLeftPosition() < this.getRightPosition() &&
      player.getBottomPosition() <= this.getTopPosition() &&
      player.getBottomPosition() + player.velocity.y >= this.getTopPosition()
    ) {
      return true;
    }

    return false;
  }
}
