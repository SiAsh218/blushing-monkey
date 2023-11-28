export default class Player {
  constructor({ position, width, height, platforms, canvas, keysHandler }) {
    this.platforms = platforms;
    this.canvas = canvas;
    this.gravity = 1.2;
    this.keysHandler = keysHandler;
    this.position = position;
    this.width = width || 20;
    this.height = height || 30;
    this.fillStyle = "RGBA(0, 255, 0, 0.5)";
    this.velocity = { x: 0, y: 0 };
    this.lives = 3;
    this.isGrounded = false;
    this.maxRunSpeed = 4;
    this.runAcceleration = 0.2;
    this.currentSpeed = 0;
    this.jumpHeight = 15;
    this.isDead = false;
  }

  update() {
    this.detectPlatform();

    console.log(this.position.x);
    console.log(this.canvas.scrollOffsetX);
    console.log(this.currentSpeed);

    if (!this.isGrounded) this.applyGravity();

    this.draw();
    this.move();
  }

  // method to draw the player
  draw() {
    this.canvas.ctx.fillStyle = this.fillStyle;
    this.canvas.ctx.strokeStyle = "black";
    this.canvas.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  getRightPosition() {
    return this.position.x + this.width;
  }

  setRightPosition(position) {
    this.position.x = position - this.width;
  }

  getLeftPosition() {
    return this.position.x;
  }

  setLeftPosition(position) {
    this.position.x = position;
  }

  getBottomPosition() {
    return this.position.y + this.height;
  }

  setBottomPosition(position) {
    this.position.y = position - this.height;
  }

  getTopPosition() {
    return this.position.y;
  }

  setTopPosition(position) {
    this.position.y = position;
  }

  respawn({ position }) {
    if (!this.isDead) {
      this.jump();
      this.isDead = true;
      this.fillStyle = "RGBA(0, 255, 0, 0.2)";
      setTimeout(() => {
        this.position = position;
        this.fillStyle = "RGBA(0, 255, 0, 0.5)";
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.currentSpeed = 0;
        this.isDead = false;
      }, 1000);
    }
  }

  // method to detect is landed on a platform
  detectPlatform() {
    for (const platform of this.platforms) {
      if (
        this.getRightPosition() > platform.getLeftPosition() &&
        this.getLeftPosition() < platform.getRightPosition() &&
        this.getBottomPosition() <= platform.getTopPosition() &&
        this.getBottomPosition() + this.velocity.y >= platform.getTopPosition()
      ) {
        this.velocity.y = 0;
        this.setBottomPosition(platform.getTopPosition());
        this.isGrounded = true;
        return;
      }
    }
    this.isGrounded = false;
  }

  // method to apply gravity to the player
  applyGravity() {
    if (!this.isGrounded) {
      // update y position
      this.position.y += this.velocity.y;
      // add gravity to velocity
      this.velocity.y += this.gravity;
    }
    // stop when hitting canvas bottom
    if (this.position.y >= this.canvas.el.height) {
      this.respawn({ position: { x: 200, y: 300 } });
    }
  }

  jump() {
    this.velocity.y = -this.jumpHeight;
    this.position.y += this.velocity.y;
    this.isGrounded = false;
  }

  // TODO: deal with move right when hittin left limit
  moveRight() {
    this.currentSpeed += this.runAcceleration;

    // limit speed to maxRunSpeed
    if (this.currentSpeed > this.maxRunSpeed) {
      this.currentSpeed = this.maxRunSpeed;
    }

    // speed up deceleration if moving left whilst pressing right
    if (this.currentSpeed < 0) {
      this.currentSpeed += this.runAcceleration;
    }

    const hitMoveLimit = this.moveLimitReached();

    if (!hitMoveLimit || hitMoveLimit === "left") {
      this.position.x += this.currentSpeed;
    } else if (hitMoveLimit === "right") {
      // TODO: need propery to hold 400px move limit
      this.setLeftPosition(400);

      this.platforms.forEach((platform) => {
        platform.scrollX(this.currentSpeed);
      });

      this.canvas.scrollOffsetX += this.currentSpeed;
    }
  }

  moveLimitReached() {
    if (this.position.x + this.currentSpeed >= 400) {
      return "right";
    } else if (this.position.x + this.currentSpeed <= 200) {
      return "left";
    } else return false;
  }

  // TODO: deal with move left when hittin right limit
  moveLeft() {
    this.currentSpeed -= this.runAcceleration;

    // limit speed to maxRunSpeed
    if (this.currentSpeed < -this.maxRunSpeed) {
      this.currentSpeed = -this.maxRunSpeed;
    }

    // speed up deceleration if moving right whilst pressing left
    if (this.currentSpeed > 0) {
      this.currentSpeed -= this.runAcceleration;
    }

    const hitMoveLimit = this.moveLimitReached();

    if (!hitMoveLimit || hitMoveLimit === "right") {
      this.position.x += this.currentSpeed;
    } else if (hitMoveLimit === "left") {
      // TODO: need propery to hold 200px move limit
      this.setLeftPosition(200);

      this.platforms.forEach((platform) => {
        platform.scrollX(this.currentSpeed);
      });

      this.canvas.scrollOffsetX += this.currentSpeed;
    }
  }

  decelerate() {
    if (this.currentSpeed > 1) {
      this.currentSpeed -= this.runAcceleration;
    } else if (this.currentSpeed < -1) {
      this.currentSpeed += this.runAcceleration;
    } else {
      this.currentSpeed = 0;
    }

    const hitMoveLimit = this.moveLimitReached();

    if (!hitMoveLimit) {
      this.position.x += this.currentSpeed;
    } else if (hitMoveLimit === "right") {
      // TODO: need propery to hold 400px move limit
      this.setLeftPosition(400);

      this.platforms.forEach((platform) => {
        platform.scrollX(this.currentSpeed);
      });

      this.canvas.scrollOffsetX += this.currentSpeed;
    } else if (hitMoveLimit === "left") {
      // TODO: need propery to hold 200px move limit
      this.setLeftPosition(200);

      this.platforms.forEach((platform) => {
        platform.scrollX(this.currentSpeed);
      });

      this.canvas.scrollOffsetX += this.currentSpeed;
    }
  }

  // method to move the player
  move() {
    if (this.isDead) return;

    // jump code
    if (this.keysHandler.keys.includes("ArrowUp") && this.isGrounded) {
      this.jump();
    }
    // stop moving left at the end of the screen
    if (this.getLeftPosition() + this.currentSpeed < 0) {
      this.setLeftPosition(0);
      this.currentSpeed = 0;
      return;
    }
    // stop moving right at the end of the screen
    if (this.getRightPosition() + this.currentSpeed > this.canvas.el.width) {
      this.setRightPosition(this.canvas.el.width);
      this.currentSpeed = 0;
      return;
    }
    // move right
    if (
      this.keysHandler.keys.includes("ArrowRight") &&
      !this.keysHandler.keys.includes("ArrowLeft") &&
      this.getRightPosition() < this.canvas.el.width
    ) {
      this.moveRight();
    }
    // move left
    if (
      this.keysHandler.keys.includes("ArrowLeft") &&
      !this.keysHandler.keys.includes("ArrowRight") &&
      this.getLeftPosition() > 0
    ) {
      this.moveLeft();
    }
    // no move left or right
    if (
      (!this.keysHandler.keys.includes("ArrowRight") &&
        !this.keysHandler.keys.includes("ArrowLeft")) ||
      (this.keysHandler.keys.includes("ArrowRight") &&
        this.keysHandler.keys.includes("ArrowLeft"))
    ) {
      this.decelerate();
    }
  }
}
