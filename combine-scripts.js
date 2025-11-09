const fs = require("fs").promises;
const path = require("path");

async function getAllJsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllJsFiles(fullPath);
      } else if (entry.isFile() && fullPath.endsWith(".js")) {
        return fullPath;
      } else {
        return [];
      }
    }),
  );
  return files.flat();
}

async function combineScripts() {
  try {
    const baseDir = __dirname;
    const srcDir = path.join(baseDir, "src");
    const libDir = path.join(baseDir, "lib");
    const combinedPath = path.join(baseDir, "combined.js");

    // Collect all JS files (recursively)
    const srcFiles = (await getAllJsFiles(srcDir)).sort();
    const libFiles = (await getAllJsFiles(libDir)).sort();

    // Read contents
    const srcContents = await Promise.all(srcFiles.map((f) => fs.readFile(f, "utf8")));
    const libContents = await Promise.all(libFiles.map((f) => fs.readFile(f, "utf8")));

    // Combine into one wrapped file
    const combinedContent = ['document.addEventListener("DOMContentLoaded", function() {', ...libContents, ...srcContents, "});"].join("\n\n");

    await fs.writeFile(combinedPath, combinedContent, "utf8");
    console.log("Scripts combined successfully.");
  } catch (error) {
    console.error("Error combining scripts:", error);
  }
}

combineScripts();
