const RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function reviewWithOpenAI({ prompt, model, apiKey = process.env.OPENAI_API_KEY, fetchImpl = fetch }) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required. Set it or run with --dry-run.");
  }

  const response = await fetchImpl(RESPONSES_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API request failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  const text = extractOutputText(payload);
  return parseReviewJson(text);
}

export function extractOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.length > 0) {
    return payload.output_text;
  }

  const chunks = [];
  for (const item of payload?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  const text = chunks.join("").trim();
  if (!text) {
    throw new Error("No text output returned by OpenAI.");
  }
  return text;
}

function parseReviewJson(text) {
  try {
    return JSON.parse(stripCodeFence(text));
  } catch (error) {
    throw new Error(`OpenAI returned non-JSON review output: ${error.message}`);
  }
}

function stripCodeFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
}
