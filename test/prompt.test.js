import test from "node:test";
import assert from "node:assert/strict";

import { buildReviewPrompt } from "../src/prompt.js";

test("buildReviewPrompt includes diff and strict JSON instructions", () => {
  const prompt = buildReviewPrompt({
    diff: "diff --git a/app.js b/app.js\n+console.log('x')",
    maxChars: 500
  });

  assert.match(prompt, /Return only valid JSON/);
  assert.match(prompt, /"findings"/);
  assert.match(prompt, /console\.log/);
});

test("buildReviewPrompt truncates oversized diffs", () => {
  const prompt = buildReviewPrompt({
    diff: "a".repeat(60),
    maxChars: 20
  });

  assert.match(prompt, /truncated/);
  assert.equal(prompt.includes("a".repeat(60)), false);
});
