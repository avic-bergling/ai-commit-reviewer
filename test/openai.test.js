import test from "node:test";
import assert from "node:assert/strict";

import { extractOutputText } from "../src/openai.js";

test("extractOutputText prefers output_text when present", () => {
  assert.equal(extractOutputText({ output_text: "hello" }), "hello");
});

test("extractOutputText reads nested Responses API text content", () => {
  const text = extractOutputText({
    output: [
      {
        content: [
          { type: "output_text", text: "nested" }
        ]
      }
    ]
  });

  assert.equal(text, "nested");
});

test("extractOutputText rejects responses without text", () => {
  assert.throws(() => extractOutputText({ output: [] }), /No text output/);
});
