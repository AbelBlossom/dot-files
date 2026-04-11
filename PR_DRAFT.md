Title: chore(golang-agent): add server/tests, docs, onboarding

## Summary

This PR adds server and web tests, a small file-backed poems persistence, onboarding scripts/docs, and vitest UI tests. It prepares the repository to onboard a company-scoped golang-dev agent (CEO action required to create the agent).

## Changes
- server/src/index.js: agent creation endpoints, poems persistence, reset helper for tests
- server/src/__tests__/poems.test.js: tests for poems API
- web/vitest.*: vitest config and setup
- web/src/__tests__/App.test.jsx: UI test for Poem App
- PR_READY.md, ISSUE_COMMENT.md: onboarding and PR instructions

## Notes
- CEO/board must create the company-scoped agent `golang-dev` using the provided instructions. After they post the returned agent id, the CTO agent will run skill sync and provision the agent.
- Do NOT include any .paperclip workspace files, node_modules, or personal dotfiles in the PR.
