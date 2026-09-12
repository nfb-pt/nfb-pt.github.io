import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
// npm puts the pinned Hugo executable on PATH. Keep cache inside the project.
const result = spawnSync("hugo", [...process.argv.slice(2), "--cacheDir", resolve(".cache/hugo")], { stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
