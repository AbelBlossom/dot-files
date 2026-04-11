PR Ready Instructions — feature/golang-agent-hiring

Purpose
-------
This file contains safe, copy/paste commands and a checklist to create a clean branch containing the prepared changes, scan for secrets, push the branch, and open a PR. Do NOT run these commands on a machine where you haven't checked for secrets.

Files changed in workspace (for reviewer reference)
- server/src/index.js (persist poems to file; reset helper exposed for tests)
- server/src/__tests__/poems.test.js (updated to use reset helper)
- web/package.json (added test script + devDependencies)
- web/vitest.config.js
- web/vitest.setup.js
- web/src/__tests__/App.test.jsx (UI test)
- scripts/create-and-sync-agent.sh (one-shot script to create + sync)
- .github/workflows/ci.yml (run server, agent-creator, web tests)
- ACMAAAA-21_CEO_INSTRUCTIONS.md (CEO-ready instructions)
- CTO_NEXT_STEPS_AFTER_AGENT_CREATION.md (CTO follow-up steps)

High-level plan (safe)
1. Create a fresh branch from origin/master.
2. Add only the intended project files (server, web, scripts, .github workflows) to the branch.
3. Run a local secret scan (simple heuristics included below).
4. Commit and push the branch, open a PR using the draft PR body.

Exact commands (copy/paste)

# 1) Create branch
git fetch origin
git checkout -b feature/golang-agent-hiring-clean origin/master

# 2) Stage only the intended files (adjust paths if your working tree differs)
git add -f server/src/index.js server/src/__tests__/poems.test.js server/package.json \
  web/package.json web/vitest.config.js web/vitest.setup.js web/src/__tests__/App.test.jsx \
  scripts/create-and-sync-agent.sh scripts/sync-skills.js .github/workflows/ci.yml \
  ACMAAAA-21_CEO_INSTRUCTIONS.md CTO_NEXT_STEPS_AFTER_AGENT_CREATION.md PR_DRAFT.md

# 3) Quick secret checks (basic; run your org's secret scanner if available)
# - scan for long hex/base64 strings or common token words
git grep -nE "(PAPERCLIP_API_KEY|API_KEY|GROQ|SECRET|TOKEN|aws_secret_access_key|AKIA|\b[a-z0-9_]{32,}\b)" || true

# If the grep above shows suspicious matches, inspect and remove them before committing.

# 4) Commit
git commit -m "chore(golang-agent): add server and web tests, CI, scripts, and onboarding docs"

# 5) Push branch and open PR (using gh CLI)
git push -u origin feature/golang-agent-hiring-clean

# Create PR using the draft body in PR_DRAFT.md
gh pr create --title "chore(golang-agent): add server/tests, docs, onboarding" --body-file PR_DRAFT.md --base main

Notes
- If GitHub blocks the push because of a secret (push-protection), DO NOT force-push. Instead, remove the secret from the files and re-commit to a new branch.
- If you need me to run the final provisioning steps after the CEO posts the agent id, paste the agent id into this issue or reply here and I will run the skill sync and instruct the new agent to run the example task.

If you want, I can also produce a patch file (git diff) for the exact changes so you can apply it locally with `git apply`. Reply with "patch" and I will produce it.
