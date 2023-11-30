export default class Block {
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

  detectCollision(player) {
    if (
      player.getRightPosition() + player.velocity.x > this.getLeftPosition() &&
      player.getLeftPosition() + player.velocity.x < this.getRightPosition() &&
      player.getBottomPosition() + player.velocity.y > this.getTopPosition() &&
      player.getTopPosition() + player.velocity.y < this.getBottomPosition()
    ) {
      return true;
    }
    return false;
  }

  detectPlayerHorizontal(player) {
    if (this.detectCollision(player)) {
      return true;
    }
    return false;
  }

  detectPlayerVertical(player) {
    if (this.detectCollision(player)) {
      return true;
      // TRAVELLING UP
      // if (player.velocity.y < 0) {
      //   player.velocity.y = 0;
      //   player.setTopPosition(this.getBottomPosition());
      // }
      // // TRAVELLING DOWN
      // if (player.velocity.y > 0) {
      //   player.velocity.y = 0;
      //   player.setBottomPosition(this.getTopPosition());
      //   player.isGrounded = true;
      // }
    }
    return false;
  }

  draw() {
    this.canvas.ctx.fillStyle = "RGBA(125,42,42, 0.5)";
    this.canvas.ctx.strokeStyle = "black";
    this.canvas.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
