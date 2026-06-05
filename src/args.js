const DEFAULT_MODEL = "gpt-5-mini";
const DEFAULT_MAX_CHARS = 20000;

export function parseArgs(argv) {
  const options = {
    command: "review",
    staged: true,
    base: undefined,
    format: "markdown",
    model: DEFAULT_MODEL,
    maxChars: DEFAULT_MAX_CHARS,
    stdin: false,
    diffFile: undefined,
    dryRun: false,
    help: false
  };

  const args = [...argv];
  if (args[0] && !args[0].startsWith("-")) {
    options.command = args.shift();
  }

  if (options.command !== "review" && options.command !== "help") {
    throw new Error(`Unknown command: ${options.command}`);
  }

  if (options.command === "help") {
    options.help = true;
  }

  while (args.length > 0) {
    const arg = args.shift();

    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--staged":
        options.staged = true;
        options.base = undefined;
        break;
      case "--base":
        options.base = requireValue(arg, args.shift());
        options.staged = false;
        break;
      case "--stdin":
        options.stdin = true;
        options.diffFile = undefined;
        options.staged = false;
        options.base = undefined;
        break;
      case "--diff-file":
        options.diffFile = requireValue(arg, args.shift());
        options.stdin = false;
        options.staged = false;
        options.base = undefined;
        break;
      case "--format":
        options.format = requireValue(arg, args.shift());
        if (!["markdown", "json"].includes(options.format)) {
          throw new Error(`Unsupported format: ${options.format}`);
        }
        break;
      case "--model":
        options.model = requireValue(arg, args.shift());
        break;
      case "--max-chars": {
        const value = Number.parseInt(requireValue(arg, args.shift()), 10);
        if (!Number.isSafeInteger(value) || value < 1000) {
          throw new Error("--max-chars must be an integer of at least 1000");
        }
        options.maxChars = value;
        break;
      }
      case "--dry-run":
        options.dryRun = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function requireValue(name, value) {
  if (!value || value.startsWith("-")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

export function helpText() {
  return `AI Commit Reviewer CLI

Usage:
  aicr [review] [options]

Options:
  --staged              Review staged changes (default)
  --base <ref>          Review changes from <ref>...HEAD
  --stdin               Read a diff from standard input
  --diff-file <path>    Read a diff from a file
  --format <format>     markdown or json (default: markdown)
  --model <model>       OpenAI model (default: ${DEFAULT_MODEL})
  --max-chars <number>  Maximum diff characters sent to the model (default: ${DEFAULT_MAX_CHARS})
  --dry-run             Print the prompt without calling OpenAI
  -h, --help            Show this help

Environment:
  OPENAI_API_KEY        Required unless --dry-run is used
`;
}
