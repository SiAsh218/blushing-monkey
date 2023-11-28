export default class Player {
  constructor({ position, width, height, platforms, canvas, keysHandler }) {
    this.platforms = platforms;
    this.canvas = canvas;
    this.gravity = 1.2;
    this.keysHandler = keysHandler;
    this.position = position;
    this.positionLimits = { lowerX: 200, upperX: 400 };
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

    if (!this.isGrounded) this.applyGravity();

    this.draw();
    this.move();
  }

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

  applyGravity() {
    if (!this.isGrounded) {
      this.position.y += this.velocity.y;

      this.velocity.y += this.gravity;
    }

    if (this.position.y >= this.canvas.el.height) {
      this.respawn({ position: { x: 200, y: 300 } });
    }
  }

  jump() {
    this.velocity.y = -this.jumpHeight;
    this.position.y += this.velocity.y;
    this.isGrounded = false;
  }

  limitSpeedX() {
    if (this.currentSpeed > this.maxRunSpeed) {
      this.currentSpeed = this.maxRunSpeed;
    } else if (this.currentSpeed < -this.maxRunSpeed) {
      this.currentSpeed = -this.maxRunSpeed;
    }
  }

  skid(speed) {
    if (speed > 0 && this.currentSpeed < 0) {
      this.currentSpeed += speed;
    } else if (speed < 0 && this.currentSpeed > 0) {
      this.currentSpeed += speed;
    }
  }

  updateCurrentSpeed(speed) {
    this.currentSpeed += speed;

    this.limitSpeedX();
    this.skid(speed);
  }

  updatePosition(hitMoveLimit) {
    if (!hitMoveLimit) {
      this.position.x += this.currentSpeed;
      return;
    }

    this.setLeftPosition(
      hitMoveLimit === "left"
        ? this.positionLimits.lowerX
        : this.positionLimits.upperX
    );

    if (this.canvas.scrollOffsetX + this.currentSpeed <= 0) {
      this.currentSpeed = 0;
      return;
    }

    this.platforms.forEach((platform) => {
      platform.scrollX(this.currentSpeed);
    });

    this.canvas.incrementScrollXOffset(this.currentSpeed);
  }

  moveRight() {
    this.updateCurrentSpeed(this.runAcceleration);

    const hitMoveLimit = this.moveLimitReached();

    this.updatePosition(hitMoveLimit);
  }

  moveLeft() {
    this.updateCurrentSpeed(-this.runAcceleration);

    const hitMoveLimit = this.moveLimitReached();

    this.updatePosition(hitMoveLimit);
  }

  moveLimitReached() {
    if (this.position.x + this.currentSpeed >= this.positionLimits.upperX) {
      return "right";
    } else if (
      this.position.x + this.currentSpeed <=
      this.positionLimits.lowerX
    ) {
      return "left";
    } else return false;
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

    this.updatePosition(hitMoveLimit);
  }

  move() {
    if (this.isDead) return;

    if (this.keysHandler.keys.includes("ArrowUp") && this.isGrounded) {
      this.jump();
    }

    if (
      this.keysHandler.keys.includes("ArrowRight") &&
      !this.keysHandler.keys.includes("ArrowLeft") &&
      this.getRightPosition() < this.canvas.el.width
    ) {
      this.moveRight();
    }
    if (
      this.keysHandler.keys.includes("ArrowLeft") &&
      !this.keysHandler.keys.includes("ArrowRight") &&
      this.getLeftPosition() > 0
    ) {
      this.moveLeft();
    }
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
