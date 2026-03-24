// plugins/add-log.js
module.exports = {
  name: "Sample plugin that adds a log to code.",

  afterCombineScripts: (ctx) => {
    const combinedPath = "./combined.js"; // path after combine-scripts.js runs
    const fs = require("fs"); // imports filesystem stuff, used to read and write files!

    let content = fs.readFileSync(combinedPath, "utf-8"); // imports combined.js

    // Add a log at the very top!
    content = `console.log("Hewwo from the sample plugin!~ \\n\\nto remove me delete /plugins/add-log.js \\n\\nUwU~");\n` + content;

    fs.writeFileSync(combinedPath, content, "utf-8"); // writes out modified file!
  },
};
