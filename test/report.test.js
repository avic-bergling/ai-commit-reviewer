import test from "node:test";
import assert from "node:assert/strict";

import { formatReview } from "../src/report.js";

const review = {
  summary: "One risky change.",
  risk: "medium",
  findings: [
    {
      severity: "high",
      file: "src/app.js",
      line: 12,
      title: "Missing await",
      detail: "The promise is not awaited.",
      suggestion: "Await the call or handle rejection."
    }
  ]
};

test("formatReview renders useful markdown findings", () => {
  const output = formatReview(review, "markdown");

  assert.match(output, /AI Commit Review/);
  assert.match(output, /Risk: medium/);
  assert.match(output, /src\/app\.js:12/);
  assert.match(output, /Missing await/);
});

test("formatReview renders stable json", () => {
  const output = formatReview(review, "json");
  const parsed = JSON.parse(output);

  assert.equal(parsed.findings[0].title, "Missing await");
});

test("formatReview handles empty findings", () => {
  const output = formatReview({ summary: "Clean.", risk: "low", findings: [] }, "markdown");

  assert.match(output, /No findings/);
});
