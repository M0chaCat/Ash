const fs = require("fs").promises;
const path = require("path");

async function combineScripts() {
  try {
    const baseDir = __dirname;
    const srcDir = path.join(baseDir, "src");
    const libDir = path.join(baseDir, "lib");
    const combinedPath = path.join(baseDir, "combined.js");

    // Read JS files in src and lib
    const srcFiles = (await fs.readdir(srcDir))
      .filter((f) => f.endsWith(".js"))
      .sort();
    const libFiles = (await fs.readdir(libDir))
      .filter((f) => f.endsWith(".js"))
      .sort();

    // Read file contents
    const srcContents = await Promise.all(
      srcFiles.map((f) => fs.readFile(path.join(srcDir, f), "utf8")),
    );
    const libContents = await Promise.all(
      libFiles.map((f) => fs.readFile(path.join(libDir, f), "utf8")),
    );

    // Combine everything
    const combinedContent = [
      'document.addEventListener("DOMContentLoaded", function() {',
      ...libContents,
      ...srcContents,
      "});",
    ].join("\n\n");

    // Write combined.js
    await fs.writeFile(combinedPath, combinedContent, "utf8");
    console.log("Scripts combined successfully.");
  } catch (error) {
    console.error("Error combining scripts:", error);
  }
}

combineScripts();
