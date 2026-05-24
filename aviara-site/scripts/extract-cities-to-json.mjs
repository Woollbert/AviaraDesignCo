// One-off: extract the cities array from src/data/cities.ts and write each
// entry as its own JSON file under src/content/cities/. After this runs the
// cities.ts loader is rewritten to read these JSON files (same pattern as
// journal.ts) so the Decap CMS can edit them.

import fs from "node:fs";
import path from "node:path";

const content = fs.readFileSync("src/data/cities.ts", "utf8");

// Find the cities export and capture the array literal that follows.
// Match against 'City[] = [' so we skip the [] in the type annotation.
const startMarker = "export const cities: City[] = [";
const startIdx = content.indexOf(startMarker);
if (startIdx < 0) throw new Error("cities export not found");

// The opening '[' of the actual array is the last char of startMarker.
const arrStart = startIdx + startMarker.length - 1;

// Walk the source, respecting string literals, until we close the array.
let depth = 0;
let i = arrStart;
let inStr = false;
let strCh = null;
let prev = "";
for (; i < content.length; i++) {
  const ch = content[i];
  if (inStr) {
    if (ch === strCh && prev !== "\\") inStr = false;
  } else {
    if (ch === '"' || ch === "'" || ch === "`") {
      inStr = true;
      strCh = ch;
    } else if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) break;
    }
  }
  prev = ch;
}
const arrayStr = content.slice(arrStart, i + 1);

console.log("arrStart=", arrStart, "closeAt=", i, "len=", arrayStr.length);
console.log("first 200 chars:", arrayStr.slice(0, 200));
console.log("last 200 chars:", arrayStr.slice(-200));

// The array is plain JS (strings, commas, no TS-only syntax inside).
const cities = eval("(" + arrayStr + ")");
console.log("parsed", cities.length, "cities");

const outDir = "src/content/cities";
fs.mkdirSync(outDir, { recursive: true });

for (const city of cities) {
  // Filename is the slug minus the 'home-staging-' prefix for cleanliness in
  // the Decap UI (which shows file names as the entry list).
  const fname = city.slug.replace(/^home-staging-/, "") + ".json";
  fs.writeFileSync(path.join(outDir, fname), JSON.stringify(city, null, 2) + "\n");
  console.log("wrote", fname);
}
