const fs = require("fs");
const Console = require("console");
// eslint-disable-next-line import/no-extraneous-dependencies
const replace = require("replace");

fs.readFile("piwik-partial.html", "utf8", (err, data) => {
  if (err) throw err;
  replace({
    regex: "<analytics></analytics>",
    replacement: data,
    paths: ["./dist/index.html"],
    recursive: false,
    silent: true,
  });
  Console.info("✨ Added analytics to build");
});