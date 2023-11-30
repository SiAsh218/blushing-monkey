export default class KeysHandler {
  constructor() {
    this.keys = [];
    this.jumpPressed = false;
    this.jumpPressedDur = 0;
    this.allowInput = true;

    // key down event listener
    document.addEventListener("keydown", (e) => {
      if (!this.allowInput) return;

      // track keys pressed
      if (!this.keys.includes(e.key)) {
        this.keys.push(e.key);
      }
    });

    // kep up event listener
    document.addEventListener("keyup", (e) => {
      if (!this.allowInput) return;

      // track keys pressed
      const index = this.keys.indexOf(e.key);
      this.keys.splice(index, 1);

      if (e.key === "ArrowUp") {
        this.jumpPressed = false;
        this.jumpPressedDur = 0;
      }
    });
  }

  getJumpPressDur() {
    return this.jumpPressDur;
  }

  jumpStart() {
    this.jumpPressed = true;
    this.jumpPressDur = 0;
  }

  incrementJumpCounter() {
    this.jumpPressDur++;
  }

  disableInput() {
    this.allowInput = false;
    this.keys = [];
  }

  enableInput() {
    this.allowInput = true;
  }
}
