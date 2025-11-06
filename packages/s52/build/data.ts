import { parse } from "@enc-tiles/dai";
import { readFileSync, writeFileSync } from "fs";

const dai = "data/S-52 PresLib Ed 4.0.4.dai";

/** Always rebuild data.json from presentation library */
export default {
  name: "build-data",
  buildStart() {
    console.log(`Building data.json from ${dai}`);
    const text = readFileSync(dai, "utf8");
    const data = parse(text);
    const json = JSON.stringify(data, null, 2);
    writeFileSync("data.json", json);
  },
};
