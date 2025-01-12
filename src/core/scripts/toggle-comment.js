const fs = require("fs");
const filePath = "./src/index.html";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const lines = data.split("\n");
  if (lines[7].trim().startsWith("<!--")) {
    // Uncomment line 8 and comment line 7
    lines[7] = lines[7].replace("<!--", "").replace("-->", "");
    lines[8] = `<!--${lines[8]}-->`;
  } else {
    // Comment line 8 and uncomment line 7
    lines[7] = `<!--${lines[7]}-->`;
    lines[8] = lines[8].replace("<!--", "").replace("-->", "");
  }

  fs.writeFile(filePath, lines.join("\n"), "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("File updated successfully.");
  });
});
