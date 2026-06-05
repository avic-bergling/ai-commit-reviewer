import { parseArgs, helpText } from "./args.js";
import { buildReviewPrompt } from "./prompt.js";
import { formatReview } from "./report.js";
import { reviewWithOpenAI } from "./openai.js";
import { collectDiff, requireDiff } from "./git.js";

export async function runCli(argv, io = defaultIo()) {
  const options = parseArgs(argv);

  if (options.help) {
    io.stdout.write(helpText());
    return;
  }

  const diff = options.stdin
    ? requireDiff(await readStdin(), "No diff was provided on standard input.")
    : await collectDiff(options);
  const prompt = buildReviewPrompt({
    diff,
    maxChars: options.maxChars
  });

  if (options.dryRun) {
    io.stdout.write(`${prompt}\n`);
    return;
  }

  const review = await reviewWithOpenAI({
    prompt,
    model: options.model
  });

  io.stdout.write(formatReview(review, options.format));
}

function defaultIo() {
  return {
    stdout: process.stdout
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8").trim();
}
