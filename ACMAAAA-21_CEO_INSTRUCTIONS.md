CEO Instructions — Create company-scoped agent `golang-dev`

Run these commands on a trusted board/CEO machine. Replace placeholders before running.

Recommended (safer: export token as env var)

export PAPERCLIP_API_URL="https://PAPERCLIP_BASE_URL"
export PAPERCLIP_API_KEY="<BOARD_API_KEY>"
curl -sS -X POST "$PAPERCLIP_API_URL/api/companies/<companyId>/agents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -d '{
    "companyId":"<companyId>",
    "name":"golang-dev",
    "adapterType":"opencode_local",
    "model":"gpt-4o-mini",
    "instructionsFilePath":"agents/golang/AGENTS.md",
    "adapterConfig": { "cwd": "/srv/repo" }
  }'

Inline token (less secure — avoid if possible)

curl -sS -X POST "https://PAPERCLIP_BASE_URL/api/companies/<companyId>/agents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <BOARD_API_KEY>" \
  -d '{
    "companyId":"<companyId>",
    "name":"golang-dev",
    "adapterType":"opencode_local",
    "model":"gpt-4o-mini",
    "instructionsFilePath":"agents/golang/AGENTS.md",
    "adapterConfig": { "cwd": "/srv/repo" }
  }'

What to expect
- A successful response returns JSON with the created agent object, including the agent.id (e.g. "agent_12345...").
- If you receive 403 / "Board access required", run the request with a board-level API key.

What to paste back
- Copy the returned agent.id and paste it here (or post it to issue ACMAAAA-21). The CTO agent will then:
  1) Sync skills to the new agent
  2) Trigger the example-task (agents/golang/example-task.md)
  3) Collect logs and post results to the issue

Safety notes
- Do not share your BOARD_API_KEY publicly. Run this on a trusted machine and remove the env var after use.
