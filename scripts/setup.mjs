import { spawnSync } from "node:child_process";
import process from "node:process";
import path from "node:path";

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const runtime = process.env.BACKEND_RUNTIME ?? "native";

function run(command, args, cwd = process.cwd()) {
  console.log(`\n> ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: isWindows && command.endsWith(".cmd"),
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Installation failed: ${command}`);
  }
}

function installBackendInWsl() {
  let drive = process.cwd().charAt(0).toLowerCase();
  let ubuntuPath = process.cwd()
    .slice(2)
    .replace(/\\/g, "/")
    .toLowerCase(); // onedrive uppercase sometimes
  
  const projectPath = `/mnt/${drive}${ubuntuPath}`;
  console.log(`Projectpad in Ubuntu: ${projectPath}`);

  const script = `
    set -e
    cd "${projectPath}/backend"
    npm ci
  `;

  const result = spawnSync(
    "wsl.exe",
    [
      "-d", "Ubuntu",
      "--",
      "bash", "-c",
      script,
    ],
    { stdio: "inherit" },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error("Backend installation in Ubuntu WSL failed.");
  }
}
try {
  const major = Number(process.versions.node.split(".")[0]);

  if (major < 22) {
    throw new Error("Install Node.js 22 or higher.");
  }

  if (runtime === "wsl" && !isWindows) {
    throw new Error("The WSL mode is only for WINDOWS OS.");
  }


  run(npm, ["ci"], path.join(process.cwd(), "frontend"));

  if (runtime === "wsl") {
    installBackendInWsl();
  } else if (runtime === "native") {
    run(npm, ["ci"], path.join(process.cwd(), "backend"));
  } else {
    throw new Error(`Unknown BACKEND_RUNTIME: ${runtime}`);
  }

  console.log("\nInstallation done. Start with npm run dev:wsl.");
} catch (error) {
  console.error(`\nFout: ${error.message}`);
  process.exitCode = 1;
}