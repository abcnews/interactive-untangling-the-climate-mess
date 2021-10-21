const { spawn } = require("child_process");
const { join } = require("path");
const del = require("del");
const { zip } = require("zip-a-folder");
const { name, version } = require("../package.json");

const COMMAND_AND_ARGS = ["aunty", "build", "--local", '--id="apple"'];
const [COMMAND, ...ARGS] = COMMAND_AND_ARGS;
const ENV = { NODE_ENV: "production", IS_FOR_APPLE_NEWS: "yes" };
const PROJECT_PATH = join(__dirname, "..");
const BUILD_PATH = join(PROJECT_PATH, ".build");
const GLOBS_TO_DELETE = [
  "dynamic-text.json",
  "embeds.html",
  "embeds.js.LICENSE.txt",
  "index.html",
  "keyshape.min.js"
];

const build = async () => {
  console.log("Building for Apple");
  console.log(
    `> 1. \`${COMMAND_AND_ARGS.join(" ")}\` (${Object.entries(ENV)
      .map(([key, val]) => `${key}=${val}`)
      .join(", ")})`
  );
  await new Promise((resolve, reject) => {
    const aunty = spawn(COMMAND, ARGS, {
      env: { ...process.env, ...ENV }
    });

    aunty.on("error", reject);
    aunty.on("close", resolve);
  });
  console.log("> 2. Delete unnecessary files");
  await del(GLOBS_TO_DELETE, { cwd: BUILD_PATH });
  console.log("> 3. Create versioned zipfile");
  await zip(BUILD_PATH, join(PROJECT_PATH, `${name}-${version}-apple.zip`));
  console.log("Done");
};

build();
