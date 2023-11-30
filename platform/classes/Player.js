export default class Player {
  constructor({ position, width, height, canvas, keysHandler }) {
    this.level = undefined;
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
    this.sprintSpeed = 6;
    this.runSpeed = 4;
    this.currentSpeed = 4;
    this.sprintAcceleration = 0.3;
    this.runAcceleration = 0.2;
    this.currentAcceleration = 0.2;
    this.jumpHeight = 11;
    this.highJumpHeight = 5;
    this.jumpLongPress = 4;
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

    this.detectFinishLine();

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
    this.level = level;
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
        this.canvas.setScrollXOffset(0);
        this.position = position;
        this.fillStyle = "RGBA(0, 255, 0, 0.5)";
        this.level.resetLevel();
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.isDead = false;
      }, 1000);
    }
  }

  setGrounded(item) {
    if (item) {
      this.velocity.y = 0;
      this.setBottomPosition(item.getTopPosition());
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
  }

  detectPlatform() {
    for (const platform of this.level.platforms) {
      const detected = platform.detectPlayer(this);

      if (detected) {
        this.setGrounded(platform);
        return;
      }
    }

    this.setGrounded(false);
  }

  detectBlockHorizontal() {
    for (const block of this.level.blocks) {
      const collision = block.detectPlayerHorizontal(this);

      if (collision) {
        this.velocity.x > 0
          ? this.setRightPosition(block.getLeftPosition())
          : this.setLeftPosition(block.getRightPosition());
        this.velocity.x = 0;
      }
    }
  }

  detectBlockVertical() {
    for (const block of this.level.blocks) {
      const collision = block.detectPlayerVertical(this);

      if (collision) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.setTopPosition(block.getBottomPosition());
        } else {
          this.setGrounded(block);
        }
      }
    }
  }

  detectFinishLine() {
    if (this.getRightPosition() > this.level.finishLine.getLeftPosition()) {
      this.keysHandler.disableInput();
      this.velocity.x = 0;
      this.velocity.y = 0;
      // TODO: code to go to next level
    }
  }

  applyGravity() {
    if (!this.isGrounded) {
      this.position.y += this.velocity.y;

      this.velocity.y += this.gravity;
    }

    if (this.position.y >= this.canvas.el.height) {
      this.respawn({
        position: JSON.parse(JSON.stringify(this.level.startPosition)),
      });
    }
  }

  jump() {
    this.velocity.y = -this.jumpHeight;
    this.position.y += this.velocity.y;
    this.keysHandler.jumpStart();
    this.isGrounded = false;
    this.highJump = false;
  }

  jumpHigher() {
    if (!this.isGrounded && this.keysHandler.keys.includes("ArrowUp")) {
      this.keysHandler.incrementJumpCounter();
      if (
        this.keysHandler.jumpPressed &&
        this.keysHandler.getJumpPressDur() > this.jumpLongPress &&
        !this.highJump
      ) {
        this.velocity.y -= this.highJumpHeight;
        this.highJump = true;
      }
    }
  }

  limitSpeedX() {
    if (this.velocity.x > this.currentSpeed) {
      this.velocity.x = this.currentSpeed;
    } else if (this.velocity.x < -this.currentSpeed) {
      this.velocity.x = -this.currentSpeed;
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
    this.level.platforms.forEach((platform) => {
      platform.scrollX(this.velocity.x);
    });

    this.level.blocks.forEach((block) => {
      block.scrollX(this.velocity.x);
    });

    this.level.finishLine.scrollX(this.velocity.x);

    this.canvas.incrementScrollXOffset(this.velocity.x);
  }

  moveRight() {
    this.updateCurrentSpeed(this.currentAcceleration);

    const hitMoveLimit = this.moveLimitReached();

    this.updatePosition(hitMoveLimit);
  }

  moveLeft() {
    this.updateCurrentSpeed(-this.currentAcceleration);

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
      this.velocity.x -= this.currentAcceleration;
    } else if (this.velocity.x < -1) {
      this.velocity.x += this.currentAcceleration;
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

  setSprintSpeed() {
    this.currentSpeed = this.sprintSpeed;
    this.currentAcceleration = this.sprintAcceleration;
  }

  setRunSpeed() {
    this.currentAcceleration = this.runAcceleration;
    this.currentSpeed -= this.currentAcceleration;
    if (this.currentSpeed < this.runSpeed) {
      this.currentSpeed = this.runSpeed;
    }
  }

  moveX() {
    if (this.isDead) return;

    if (this.keysHandler.keys.includes("Shift")) {
      this.setSprintSpeed();
    } else {
      this.setRunSpeed();
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
