import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function collectDiff(options) {
  if (options.diffFile) {
    return requireDiff((await readFile(options.diffFile, "utf8")).trim(), `Diff file is empty: ${options.diffFile}`);
  }

  const args = options.staged
    ? ["diff", "--staged", "--no-ext-diff"]
    : ["diff", `${options.base}...HEAD`, "--no-ext-diff"];

  const { stdout } = await execFileAsync("git", args, {
    maxBuffer: 20 * 1024 * 1024
  });

  return requireDiff(stdout.trim(), options.staged
      ? "No staged changes found. Stage files with git add, or use --base <ref>."
      : `No changes found between ${options.base} and HEAD.`);
}

export function requireDiff(diff, message) {
  if (!diff) {
    throw new Error(message);
  }
  return diff;
}
