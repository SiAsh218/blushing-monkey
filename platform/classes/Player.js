export default class Player {
  constructor({ position, width, height, canvas, keysHandler }) {
    this.platforms = undefined;
    this.blocks = undefined;
    this.canvas = canvas;
    this.gravity = 1.2;
    this.keysHandler = keysHandler;
    this.position = position;
    this.positionLimits = { lowerX: 200, upperX: 400 };
    this.width = width || 20;
    this.height = height || 30;
    this.fillStyle = "RGBA(0, 255, 0, 0.75)";
    this.velocity = { x: 0, y: 0 };
    this.lives = 3;
    this.isGrounded = false;
    this.maxRunSpeed = 4;
    this.runAcceleration = 0.2;
    this.jumpHeight = 11;
    this.highJumpHeight = 5;
    this.isDead = false;
  }

  update() {
    this.moveX();

    const jumpPressed = this.moveY();

    this.detectPlatform();

    this.detectBlockHorizontal();

    if (!this.isGrounded) this.applyGravity();

    if (jumpPressed) this.jump();

    this.jumpHigher();

    this.detectBlockVertical();

    this.draw();
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

  setLevel(level) {
    this.platforms = level.platforms;
    this.blocks = level.blocks;
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

  detectBlockHorizontal() {
    for (const block of this.blocks) {
      if (block.detectCollision(this)) {
        // TRAVELLING LEFT
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.setLeftPosition(block.getRightPosition());
          break;
        }
        // TRAVELLING RIGHT
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.setRightPosition(block.getLeftPosition());
          break;
        }
      }
    }
  }

  detectBlockVertical() {
    for (const block of this.blocks) {
      if (block.detectCollision(this)) {
        // TRAVELLING UP
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.setTopPosition(block.getBottomPosition());
          break;
        }
        // TRAVELLING DOWN
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.setBottomPosition(block.getTopPosition());
          this.isGrounded = true;
          break;
        }
      }
    }
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
    this.keysHandler.jumpStart();
    this.highJump = false;
  }

  jumpHigher() {
    if (!this.isGrounded && this.keysHandler.keys.includes("ArrowUp")) {
      this.keysHandler.incrementJumpCounter();
      if (this.keysHandler.getJumpPressDur() > 4 && !this.highJump) {
        this.velocity.y -= this.highJumpHeight;
        this.highJump = true;
      }
    }
  }

  limitSpeedX() {
    if (this.velocity.x > this.maxRunSpeed) {
      this.velocity.x = this.maxRunSpeed;
    } else if (this.velocity.x < -this.maxRunSpeed) {
      this.velocity.x = -this.maxRunSpeed;
    }
  }

  skid(speed) {
    if (speed > 0 && this.velocity.x < 0) {
      this.velocity.x += speed;
    } else if (speed < 0 && this.velocity.x > 0) {
      this.velocity.x += speed;
    }
  }

  updateCurrentSpeed(speed) {
    this.velocity.x += speed;

    this.limitSpeedX();
    this.skid(speed);
  }

  updatePosition(hitMoveLimit) {
    if (!hitMoveLimit) {
      this.position.x += this.velocity.x;
      return;
    }

    this.setLeftPosition(
      hitMoveLimit === "left"
        ? this.positionLimits.lowerX
        : this.positionLimits.upperX
    );

    if (this.canvas.scrollOffsetX + this.velocity.x <= 0) {
      this.velocity.x = 0;
      return;
    }

    this.scrollLevel();
  }

  scrollLevel() {
    this.platforms.forEach((platform) => {
      platform.scrollX(this.velocity.x);
    });

    this.blocks.forEach((block) => {
      block.scrollX(this.velocity.x);
    });

    this.canvas.incrementScrollXOffset(this.velocity.x);
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
    if (this.position.x + this.velocity.x >= this.positionLimits.upperX) {
      return "right";
    } else if (
      this.position.x + this.velocity.x <=
      this.positionLimits.lowerX
    ) {
      return "left";
    } else return false;
  }

  decelerate() {
    if (this.velocity.x > 1) {
      this.velocity.x -= this.runAcceleration;
    } else if (this.velocity.x < -1) {
      this.velocity.x += this.runAcceleration;
    } else {
      this.velocity.x = 0;
    }

    const hitMoveLimit = this.moveLimitReached();

    this.updatePosition(hitMoveLimit);
  }

  moveY() {
    if (this.keysHandler.keys.includes("ArrowUp") && this.isGrounded) {
      return true;
    } else return false;
  }

  moveX() {
    if (this.isDead) return;

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
