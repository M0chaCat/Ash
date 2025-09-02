#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// --- Exit if .ashproject doesn't exist ---
const ashProjectPath = ".ashproject";
if (!fs.existsSync(ashProjectPath)) {
  console.error("\x1b[31mError: .ashproject not found. Exiting.\x1b[0m");
  process.exit(1);
}

// --- Read project info ---
let projectName;
try {
  const data = fs.readFileSync(ashProjectPath, "utf-8");
  const json = JSON.parse(data);
  projectName = json.name || "UnnamedProject";
} catch (e) {
  console.error("\x1b[31mError reading .ashproject. Exiting.\x1b[0m");
  process.exit(1);
}

console.log(`\x1b[36mBuilding project: ${projectName}\x1b[0m`);

// --- rest of your build script ---

// --- Build.js continues ---
const webpackDist = "./dist";   // where webpack writes
const outputDir = "./index";    // final build folder
const mode = process.argv[2] || "dist"; // "dist" or "all"

// --- Pretty Logging ---
function section(title) {
  console.log(`\n\x1b[1m=== ${title} ===\x1b[0m`); // bold white
}
function logStep(title) {
  console.log(`\x1b[36m> ${title}\x1b[0m`); // cyan
}
function logSuccess(msg) {
  console.log(`\x1b[32m  ✓ ${msg}\x1b[0m`); // green
}
function logInfo(msg) {
  console.log(`\x1b[33m  - ${msg}\x1b[0m`); // yellow
}
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// --- Build Process ---
section("HELIOS BUILD SCRIPT");
console.log(`Mode: ${mode === "all" ? "FULL BUILD" : "DIST ONLY"}`);
console.time("Total Build");

// Step 1: Combine scripts
console.time("Step 1");
logStep("Combining scripts...");
execSync("node combine-scripts.js", { stdio: "inherit" });
console.timeEnd("Step 1");
logSuccess("Scripts combined");

// Step 2: Webpack bundle
console.time("Step 2");
logStep("Running Webpack...");
execSync("npx webpack", { stdio: "inherit" });
console.timeEnd("Step 2");
logSuccess("Webpack build complete");

// --- DIST ONLY MODE ---
if (mode !== "all") {
  console.time("Step 3");
  logStep("Updating dist/ only...");
  const distTarget = path.join(outputDir, "dist");

  if (fs.existsSync(distTarget)) {
    fs.rmSync(distTarget, { recursive: true, force: true });
  }
  fs.mkdirSync(distTarget, { recursive: true });
  copyRecursive(webpackDist, distTarget);

  console.timeEnd("Step 3");
  logSuccess("Dist replaced");

  console.timeEnd("Total Build");
  section("BUILD COMPLETE");
  console.log("Output: ./index/");
  process.exit(0);
}

// --- FULL BUILD MODE ---
console.time("Step 3");
logStep("Preparing output folder...");
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });
console.timeEnd("Step 3");
logSuccess("Output folder ready");

// Step 4: Copy dist
console.time("Step 4");
logStep("Copying Webpack dist...");
copyRecursive(webpackDist, path.join(outputDir, "dist"));
console.timeEnd("Step 4");
logSuccess("Dist copied");

// Step 5: Copy HTML + CSS
console.time("Step 5");
logStep("Copying index.html & styles.css...");
["./index.html", "./styles.css"].forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(outputDir, path.basename(file)));
  } else {
    logInfo(`${file} not found, skipped`);
  }
});
console.timeEnd("Step 5");
logSuccess("Core files copied");

// Step 5.1: Copy brain.png to root
console.time("Step 5.1");
logStep("Copying brain.png...");
const brainSrc = "./brain.png";
if (fs.existsSync(brainSrc)) {
  fs.copyFileSync(brainSrc, path.join(outputDir, "brain.png"));
  logSuccess("brain.png copied to root");
} else {
  logInfo("brain.png not found, skipped");
}
console.timeEnd("Step 5.1");

// Step 6: Copy assets
console.time("Step 6");
logStep("Copying assets...");
copyRecursive("./assets", path.join(outputDir, "assets"));
console.timeEnd("Step 6");
logSuccess("Assets copied");

console.timeEnd("Total Build");
section("BUILD COMPLETE");
console.log("Output: ./index/");
