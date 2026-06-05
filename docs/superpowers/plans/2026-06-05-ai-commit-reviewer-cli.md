# AI Commit Reviewer CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a small GitHub-ready CLI that reviews staged git diffs with the OpenAI Responses API.

**Architecture:** The project is a zero-dependency Node.js CLI. Small modules handle argument parsing, git diff collection, prompt construction, OpenAI API calls, and report formatting.

**Tech Stack:** Node.js 24, built-in `node:test`, built-in `fetch`, Git CLI, OpenAI Responses API.

---

### Task 1: Project Skeleton And Tests

**Files:**
- Create: `package.json`
- Create: `bin/aicr.js`
- Create: `src/args.js`
- Create: `src/prompt.js`
- Create: `src/report.js`
- Create: `src/openai.js`
- Create: `test/args.test.js`
- Create: `test/prompt.test.js`
- Create: `test/report.test.js`
- Create: `test/openai.test.js`

- [ ] Add package metadata, CLI bin entry, and test script.
- [ ] Write tests for argument parsing, prompt construction, markdown formatting, and OpenAI response text extraction.
- [ ] Run `npm test` and verify tests fail because source modules are missing behavior.

### Task 2: Core Implementation

**Files:**
- Modify: `src/args.js`
- Modify: `src/prompt.js`
- Modify: `src/report.js`
- Modify: `src/openai.js`
- Create: `src/git.js`
- Create: `src/cli.js`
- Modify: `bin/aicr.js`

- [ ] Implement argument parsing for `review`, `--staged`, `--base`, `--format`, `--model`, `--max-chars`, `--dry-run`, and `--help`.
- [ ] Implement prompt generation with JSON output instructions and diff truncation.
- [ ] Implement report formatting for JSON and Markdown output.
- [ ] Implement OpenAI Responses API request with `OPENAI_API_KEY`.
- [ ] Implement git diff collection through `git diff --staged` or `git diff <base>...HEAD`.
- [ ] Wire the CLI entrypoint.
- [ ] Run `npm test` and verify tests pass.

### Task 3: Publish-Ready Documentation

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `examples/sample-review.md`

- [ ] Document install, usage, environment variables, examples, and limitations.
- [ ] Add MIT license and ignore rules.
- [ ] Add an example review output for the README.
- [ ] Run a CLI smoke test with `--help` and `--dry-run`.

### Task 4: GitHub Upload

**Files:**
- Modify repository metadata only through git commands.

- [ ] Initialize git if needed.
- [ ] Commit the verified project.
- [ ] Create or configure a GitHub remote.
- [ ] Push the repository to GitHub.
