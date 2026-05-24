"use strict";

const {spawnSync} = require("child_process");
const fs = require("fs");
const path = require("path");

function patchVercelAdapterContext() {
  const originalAdapterPath = process.env.NEXT_ADAPTER_PATH;
  if (!originalAdapterPath || process.env.VERCEL_PREVIEW_COMMENTS_ENABLED !== "1") {
    return;
  }

  // Next 16.2.x does not pass projectDir to modifyConfig, but Vercel's adapter
  // needs it when Preview Comments injects its toolbar script.
  const wrapperDir = path.join(process.cwd(), ".vercel");
  const wrapperPath = path.join(wrapperDir, "next-adapter-wrapper.cjs");

  fs.mkdirSync(wrapperDir, {recursive: true});
  fs.writeFileSync(
    wrapperPath,
    `"use strict";

const adapter = require(${JSON.stringify(originalAdapterPath)});

module.exports = {
  ...adapter,
  modifyConfig(config, ctx) {
    if (typeof adapter.modifyConfig !== "function") {
      return config;
    }

    return adapter.modifyConfig(config, {...ctx, projectDir: process.cwd()});
  },
};
`,
  );

  process.env.NEXT_ADAPTER_PATH = wrapperPath;
}

patchVercelAdapterContext();

const nextBin = require.resolve("next/dist/bin/next");
const result = spawnSync(process.execPath, [nextBin, "build", ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

if (result.signal) {
  process.kill(process.pid, result.signal);
}

process.exit(result.status ?? 1);
