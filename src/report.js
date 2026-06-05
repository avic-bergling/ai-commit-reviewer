export function formatReview(review, format) {
  const normalized = normalizeReview(review);

  if (format === "json") {
    return `${JSON.stringify(normalized, null, 2)}\n`;
  }

  return formatMarkdown(normalized);
}

function normalizeReview(review) {
  return {
    summary: review?.summary || "No summary provided.",
    risk: review?.risk || "unknown",
    findings: Array.isArray(review?.findings) ? review.findings : []
  };
}

function formatMarkdown(review) {
  const lines = [
    "# AI Commit Review",
    "",
    `**Risk: ${review.risk}**`,
    "",
    review.summary,
    ""
  ];

  if (review.findings.length === 0) {
    lines.push("## Findings", "", "No findings.");
    return `${lines.join("\n")}\n`;
  }

  lines.push("## Findings", "");
  review.findings.forEach((finding, index) => {
    const location = formatLocation(finding);
    lines.push(
      `### ${index + 1}. [${finding.severity || "unknown"}] ${finding.title || "Untitled finding"}`,
      "",
      `**Location:** ${location}`,
      "",
      finding.detail || "No detail provided.",
      "",
      `**Suggestion:** ${finding.suggestion || "No suggestion provided."}`,
      ""
    );
  });

  return `${lines.join("\n")}\n`;
}

function formatLocation(finding) {
  const file = finding.file || "unknown";
  if (finding.line === undefined || finding.line === null || finding.line === "") {
    return file;
  }
  return `${file}:${finding.line}`;
}
