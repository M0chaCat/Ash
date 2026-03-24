#!/usr/bin/env node

/* DO NOT MODIFY, USE BUILD PLUGINS!!!!! */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// -------------------------
// --- Config / Project ---
// -------------------------
const ashProjectPath = ".ashproject";
const examplePath = ".ashproject.example";

if (!fs.existsSync(ashProjectPath)) {
  if (fs.existsSync(examplePath)) {
    // Rename example to real config
    fs.copyFileSync(examplePath, ashProjectPath);

    console.log("\x1b[33mNo .ashproject found.\x1b[0m");
    console.log("\x1b[32mCreated one from .ashproject.example.\x1b[0m");
    console.log("\x1b[36mYou should customize project settings in .ashproject!\x1b[0m");
  } else {
    console.error("\x1b[31mError: .ashproject not found and no .ashproject.example to copy from. Exiting.\x1b[0m");
    process.exit(1);
  }
}

let projectName, projectDesktop;
try {
  const data = fs.readFileSync(ashProjectPath, "utf-8");
  const json = JSON.parse(data);
  projectName = json.name || "UnnamedProject";
  projectDesktop = json.desktop || false;
} catch (e) {
  console.error("\x1b[31mError reading .ashproject. Exiting.\x1b[0m");
  process.exit(1);
}

console.log(`\x1b[36mBuilding project: ${projectName}\x1b[0m`);

const webpackDist = "./dist";
const outputDir = "./index";
const mode = process.argv[2] || "dist"; // "dist" or "all"

// -------------------------
// --- Logging Helpers ---
// -------------------------
function section(title) {
  console.log(`\n\x1b[1m=== ${title} ===\x1b[0m`);
}
function logStep(title) {
  console.log(`\x1b[36m> ${title}\x1b[0m`);
}
function logSuccess(msg) {
  console.log(`\x1b[32m  ✓ ${msg}\x1b[0m`);
}
function logInfo(msg) {
  console.log(`\x1b[33m  - ${msg}\x1b[0m`);
}

// -------------------------
// --- File Helpers ---
// -------------------------
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

// -------------------------
// --- Plugin System ---
// -------------------------
const pluginsDir = path.join(__dirname, "plugins");
let plugins = [];
if (fs.existsSync(pluginsDir)) {
  plugins = fs
    .readdirSync(pluginsDir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => require(path.join(pluginsDir, f)));
}

/**
 * Check if at least one plugin implements a given hook
 */
function hasPluginsFor(hookName) {
  return plugins.some((plugin) => typeof plugin[hookName] === "function");
}

/**
 * Run all plugins for a given hook
 */
function runPlugins(hookName, context) {
  plugins.forEach((plugin) => {
    if (typeof plugin[hookName] === "function") {
      try {
        plugin[hookName](context);
        logSuccess(`Plugin ${plugin.name || "unnamed"} ran on ${hookName}`);
      } catch (e) {
        logInfo(`Plugin ${plugin.name || "unnamed"} failed on ${hookName}: ${e}`);
      }
    }
  });
}

/**
 * Run plugins for a hook, but only log step if at least one plugin exists
 */
function runPluginsWithLog(hookName, context) {
  if (hasPluginsFor(hookName)) {
    logStep(`Running ${hookName} plugins...`);
  }
  runPlugins(hookName, context);
}

// -------------------------
// --- Build Process ---
// -------------------------
section(projectName + " BUILD SCRIPT");
console.log(`Mode: ${mode === "all" ? "FULL BUILD" : "DIST ONLY"}`);
console.time("Total Build");

// --- Step 1: Combine Scripts ---
console.time("Step 1");
runPluginsWithLog("beforeCombineScripts", { projectName, outputDir, webpackDist });

execSync("node combine-scripts.js", { stdio: "inherit" });

runPluginsWithLog("afterCombineScripts", { projectName, outputDir, webpackDist });
console.timeEnd("Step 1");
logSuccess("Scripts combined");

// --- Step 2: Webpack Bundle ---
console.time("Step 2");
runPluginsWithLog("beforeWebpack", { projectName, outputDir, webpackDist });

execSync("npx webpack", { stdio: "inherit" });

runPluginsWithLog("afterWebpack", { projectName, outputDir, webpackDist });
console.timeEnd("Step 2");
logSuccess("Webpack build complete");

// --- DIST ONLY MODE ---
if (mode !== "all") {
  console.time("Step 3");
  runPluginsWithLog("beforeDistCopy", { projectName, outputDir, webpackDist });

  const distTarget = path.join(outputDir, "dist");
  if (fs.existsSync(distTarget)) fs.rmSync(distTarget, { recursive: true, force: true });
  fs.mkdirSync(distTarget, { recursive: true });
  copyRecursive(webpackDist, distTarget);

  runPluginsWithLog("afterDistCopy", { projectName, outputDir, webpackDist });

  console.timeEnd("Step 3");
  logSuccess("Dist replaced");

  console.timeEnd("Total Build");
  section("BUILD COMPLETE");
  console.log("Output: ./index/");
  process.exit(0);
}

// --- FULL BUILD MODE ---
console.time("Step 3");
runPluginsWithLog("beforeOutputFolder", { projectName, outputDir, webpackDist });

if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

runPluginsWithLog("afterOutputFolder", { projectName, outputDir, webpackDist });
console.timeEnd("Step 3");
logSuccess("Output folder ready");

// --- Step 4: Copy dist ---
console.time("Step 4");
runPluginsWithLog("beforeDistCopy", { projectName, outputDir, webpackDist });

copyRecursive(webpackDist, path.join(outputDir, "dist"));

runPluginsWithLog("afterDistCopy", { projectName, outputDir, webpackDist });
console.timeEnd("Step 4");
logSuccess("Dist copied");

// --- Step 5: Copy index.html & styles.css ---
console.time("Step 5");
runPluginsWithLog("beforeCoreFiles", { projectName, outputDir, webpackDist });

["./index.html", "./styles.css"].forEach((file) => {
  const destPath = path.join(outputDir, path.basename(file));
  if (!fs.existsSync(file)) {
    logInfo(`${file} not found, skipped`);
    return;
  }

  if (file === "./index.html") {
    let html = fs.readFileSync(file, "utf-8");
    html = html.replace(/<div id="bema-container"[^>]*style="[^"]*"([^>]*)>/i, '<div id="bema-container"$1>');
    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${projectName}</title>`);
    html = html.replace(
      /<body([^>]*)>/i,
      `<body$1>
<script>
  window.isDesktop = ${projectDesktop ? "true" : "false"};
  window.projectName = "${projectName}";
</script>`,
    );
    fs.writeFileSync(destPath, html, "utf-8");
    logSuccess("index.html modified with projectName and window.isDesktop");
  } else {
    fs.copyFileSync(file, destPath);
    logSuccess(`${file} copied`);
  }
});

runPluginsWithLog("afterCoreFiles", { projectName, outputDir, webpackDist });
console.timeEnd("Step 5");
logSuccess("Core files copied");

// --- Step 6: Copy assets ---
console.time("Step 6");
runPluginsWithLog("beforeAssets", { projectName, outputDir, webpackDist });

copyRecursive("./assets", path.join(outputDir, "assets"));

runPluginsWithLog("afterAssets", { projectName, outputDir, webpackDist });
console.timeEnd("Step 6");
logSuccess("Assets copied");

console.timeEnd("Total Build");
section("BUILD COMPLETE");
console.log("Output: ./index/");
