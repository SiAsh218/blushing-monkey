import Level from "./Level.js";

class Level1 extends Level {
  constructor({ platforms }) {
    super({ platforms });
  }
}

export default new Level1({ platforms: [] });
