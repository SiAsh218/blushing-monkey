export default class KeysHandler {
  constructor() {
    this.keys = [];

    // key down event listener
    document.addEventListener("keydown", (e) => {
      // track keys pressed
      if (!this.keys.includes(e.key)) {
        this.keys.push(e.key);
      }
    });

    // kep up event listener
    document.addEventListener("keyup", (e) => {
      // track keys pressed
      const index = this.keys.indexOf(e.key);
      this.keys.splice(index, 1);
    });
  }
}
