import child_process from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync } from "node:fs";
const exec = promisify(child_process.exec);

const MODES = ["day", "dusk", "night"];

export default {
  name: "build-sprites",
  async buildStart() {
    console.log("Building sprites...");
    mkdirSync("sprites", { recursive: true });
    for (const mode of MODES) {
      await exec(`spreet symbols/${mode} sprites/${mode}`);
      await exec(`spreet --retina symbols/${mode} sprites/${mode}@2x`);
    }
  },
};
