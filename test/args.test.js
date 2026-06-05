import test from "node:test";
import assert from "node:assert/strict";

import { parseArgs } from "../src/args.js";

test("parseArgs defaults to reviewing staged diff as markdown", () => {
  const options = parseArgs([]);

  assert.equal(options.command, "review");
  assert.equal(options.staged, true);
  assert.equal(options.format, "markdown");
  assert.equal(options.model, "gpt-5-mini");
  assert.equal(options.maxChars, 20000);
});

test("parseArgs accepts base diff, json output, model, max chars, and dry run", () => {
  const options = parseArgs([
    "review",
    "--base",
    "main",
    "--format",
    "json",
    "--model",
    "gpt-5",
    "--max-chars",
    "1234",
    "--dry-run"
  ]);

  assert.equal(options.staged, false);
  assert.equal(options.base, "main");
  assert.equal(options.format, "json");
  assert.equal(options.model, "gpt-5");
  assert.equal(options.maxChars, 1234);
  assert.equal(options.dryRun, true);
});

test("parseArgs accepts stdin and diff file input modes", () => {
  const stdinOptions = parseArgs(["--stdin"]);
  const fileOptions = parseArgs(["--diff-file", "work/staged.diff"]);

  assert.equal(stdinOptions.stdin, true);
  assert.equal(stdinOptions.staged, false);
  assert.equal(fileOptions.diffFile, "work/staged.diff");
  assert.equal(fileOptions.staged, false);
});

test("parseArgs rejects unsupported formats", () => {
  assert.throws(
    () => parseArgs(["--format", "xml"]),
    /Unsupported format/
  );
});
