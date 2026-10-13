# Rules for Claude Code

These rules apply to every session in this project. If a request would break a rule, stop and tell me instead of continuing.

## 1. Secrets and sensitive information

- Never commit or push secrets: passwords, API keys, JWT secrets, database connection strings, signing secrets, tokens, or `.env` files.
- Keep all secrets in `.env`, which must always be listed in `.gitignore`. Maintain a `.env.example` with fake placeholder values only.
- Never hardcode a secret in source code, tests, README, docs, or comments.
- Never print secrets in logs, error messages, or API responses.
- Before every commit, run `git status` and `git diff --staged` and check that no secret or `.env` file is included. If one is found, stop and tell me.
- If a secret is ever committed by mistake, tell me immediately. It must be treated as leaked and rotated, because deleting it in a later commit is not enough.
- Never use real patient data, real personal data, or data from my workplace in this project. Use fake sample data only.

## 2. Ask before big changes

Always ask for my approval, with a short explanation of why, before:

- Installing or removing a dependency
- Deleting or renaming files or folders
- Changing the folder structure
- Changing database models or the API design in `docs/DESIGN.md`
- Changing authentication or security behavior
- Making a change that touches more than a few files
- Running any command that deletes data or modifies anything outside this project folder

For any new feature, propose a short plan first and wait for my go-ahead before writing code.

## 3. Git rules

- Never run `git push` without my approval.
- Never force push, rewrite history, or delete branches.
- Make small commits with clear messages, such as `Add endpoint registration API`.
- Do not commit broken code. Tests should pass before a commit.

## 4. Scope

- Build only what is in `docs/DESIGN.md` version 1. Do not add non-goals or extra features on your own.
- If something in the design looks wrong or incomplete, say so and ask, rather than quietly changing direction.

## 5. Code quality

- Write tests for every feature, including failure cases.
- Validate all input on every route.
- Handle errors properly, with no crashes on bad input.
- Keep code simple and readable. Prefer clear names and small functions over clever code.
- Keep configuration in environment variables, not in code.

## 6. Working with me

- I am learning Git, Node, and backend design as I build. Explain what you are doing and why in simple language, especially for Git commands and new concepts.
- Work in small steps, one feature at a time.
- After each step, tell me what changed and how to check that it works.
- If you are unsure or cannot do something, say so clearly. Never claim something works without running it, and report failing tests honestly.