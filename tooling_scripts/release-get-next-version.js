"use strict";

const {execSync} = require("child_process");
const {version} = require("../package.json");

const [, minor] = version.split(".").map((v) => Number(v));
let releaseType = "minor";
if (minor === 99) {
  console.log("Next minor version would be 100, bumping major\n");
  releaseType = "major";
} else {
  console.log("Next minor version below 100, not bumping major\n");
}

const result = execSync(`yarn version --no-git-tag-version --new-version ${releaseType}`, {encoding: "utf-8"});
console.log(result);
