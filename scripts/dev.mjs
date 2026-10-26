import { spawn } from "node:child_process";
import { spawnSync } from "node:child_process";
import process from "node:process";

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const runtime = process.env.BACKEND_RUNTIME ?? "native";

const children = [];

function start(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    ...options,
  });

  children.push(child);

  child.on("error", (error) => {
    console.error(`Could not start process: ${error.message}`);
    stop(1);
  });

  child.on("exit", (code) => {
    if (code !== null && code !== 0) {
      stop(code);
    }
  });

  return child;
}

function stop(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }

  process.exitCode = code;
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

if (runtime === "wsl" && !isWindows) {
  console.error("BACKEND_RUNTIME=wsl can only be used by WINDOWS OS.");
  process.exit(1);
}

if (runtime === "wsl") {
  const check = spawnSync(
    "wsl.exe",
    ["-d", "Ubuntu", "--", "bash", "-lc", "command -v npm"],
    { encoding: "utf8" },
  );

  if (check.status !== 0) {
    console.error(
      "Ubuntu WSL or npm is not present. Check your WSL installation.",
    );
    process.exit(1);
  }

  const winPath = process.cwd().replace(/\\/g, "/");

  const backendCommand =
    `cd "$(wslpath -a '${winPath}')/backend" && npm run dev`;

  start("wsl.exe", [
    "-d", "Ubuntu", "--", "bash", "-lc", backendCommand,
  ]);
} else if (runtime === "native") {
  start(npm, ["run", "dev", "--prefix", "backend"], {
    shell: isWindows,
  });
} else {
  console.error(`Onbekende BACKEND_RUNTIME: ${runtime}`);
  process.exit(1);
}

start(npm, ["run", "dev", "--prefix", "frontend"], {
  shell: isWindows,
});
