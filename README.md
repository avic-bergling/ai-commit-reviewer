# AI Commit Reviewer

Review staged git diffs from your terminal with the OpenAI Responses API.

`aicr` is a tiny zero-dependency Node.js CLI for catching risky changes before you commit. It reads your git diff, asks OpenAI for a focused code review, and prints Markdown or JSON findings.

## Features

- Reviews staged changes by default.
- Can review `base...HEAD` branch diffs.
- Supports Markdown and JSON output.
- Includes `--dry-run` to inspect the exact prompt before making an API call.
- Uses only built-in Node.js modules.

## Install

```bash
npm install -g ai-commit-reviewer
```

For local development:

```bash
git clone https://github.com/avic-bergling/ai-commit-reviewer.git
cd ai-commit-reviewer
npm test
npm link
```

## Configure

```bash
export OPENAI_API_KEY="sk-..."
```

PowerShell:

```powershell
$env:OPENAI_API_KEY="sk-..."
```

## Usage

Review staged changes:

```bash
git add src/app.js
aicr
```

Review branch changes:

```bash
aicr --base main
```

Review a piped diff:

```bash
git diff --staged | aicr --stdin
```

Review a saved diff:

```bash
git diff main...HEAD > changes.diff
aicr --diff-file changes.diff
```

Print JSON:

```bash
aicr --format json
```

Inspect the prompt without calling OpenAI:

```bash
aicr --dry-run
```

Use a different model:

```bash
aicr --model gpt-5
```

## Output

```markdown
# AI Commit Review

**Risk: medium**

One risky change.

## Findings

### 1. [high] Missing await

**Location:** src/app.js:12

The promise is not awaited.

**Suggestion:** Await the call or handle rejection.
```

## Privacy

The CLI sends the selected git diff to OpenAI. It does not upload your full repository, local files outside the diff, git history, or environment variables.

Use `--dry-run` before the first real review if you want to inspect the prompt.

## Development

```bash
npm test
node ./bin/aicr.js --help
```

The test suite uses Node's built-in test runner with `--test-isolation=none` for compatibility with restricted Windows sandboxes.

## License

MIT
