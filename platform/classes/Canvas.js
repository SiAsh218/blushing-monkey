class Canvas {
  constructor() {
    this.el = document.getElementById("my-canvas");
    this.el.width = 800;
    this.el.height = 400;
    this.el.style.border = "1px solid black";
    this.ctx = this.el.getContext("2d");
    this.scrollOffsetX = 0;
  }

  incrementScrollXOffset(increment) {
    this.scrollOffsetX += increment;
  }

  setScrollXOffset(val) {
    this.scrollOffsetX = val;
  }

  // method to clear the canvas
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  }
}

export default new Canvas();
