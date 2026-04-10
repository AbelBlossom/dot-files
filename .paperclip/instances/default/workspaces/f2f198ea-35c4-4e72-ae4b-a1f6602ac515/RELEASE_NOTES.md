# Release Notes (draft)

Date: 2026-04-09

Summary
- Fix: agent-creator helper now sends `name` and `adapterType` when calling the board-style API `POST /api/companies/:companyId/agents`. This aligns the helper with the server's expected request body.
- Server: small stabilization of agent creation flow (no breaking API changes). The board-style route (`/api/companies/:companyId/agents`) continues to accept `name`, `adapterType`, and `adapterConfig`.
- Docs: added on-repo agent instructions for golang agent under `agents/golang/` (AGENTS.md, README.md, example-task.md).

Impact
- Integration tests updated/verified. No API breaking changes.

Next actions
1. Add CI/workspace configuration for golang-dev_local adapter and an integration test that runs `go test` inside the configured workspace.
2. Create a formal changelog entry and tag the release when ready.
