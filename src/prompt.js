export function buildReviewPrompt({ diff, maxChars }) {
  const normalizedDiff = String(diff ?? "");
  const clipped = clipDiff(normalizedDiff, maxChars);

  return `You are a senior software engineer reviewing a git diff before commit.

Focus on bugs, regressions, security issues, race conditions, broken error handling, and missing tests.
Ignore harmless style preferences. Be concise and specific.

Return only valid JSON with this exact shape:
{
  "summary": "short review summary",
  "risk": "low | medium | high",
  "findings": [
    {
      "severity": "low | medium | high",
      "file": "path/to/file",
      "line": 123,
      "title": "short issue title",
      "detail": "why this matters",
      "suggestion": "concrete fix"
    }
  ]
}

If there are no actionable findings, return an empty findings array.

Git diff:
${clipped}`;
}

function clipDiff(diff, maxChars) {
  if (diff.length <= maxChars) {
    return diff;
  }

  return `${diff.slice(0, maxChars)}

[diff truncated: original ${diff.length} characters, showing first ${maxChars}]`;
}
