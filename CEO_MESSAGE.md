CEO Ready Message — Create company-scoped agent `golang-dev`

Board/CEO: please run the command below on a trusted machine to create the company-scoped agent `golang-dev`.
Replace the placeholders before running.

Recommended (export env then curl):

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

Less secure (inline token):

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

What to paste back here
- The response will include the created agent object. Copy the agent.id (e.g. "agent_12345...") and paste it here or in issue ACMAAAA-21. The CTO agent will then perform skill sync and run the example task.

Safety reminder
- Do not share your BOARD_API_KEY publicly. Remove it from the environment after running.
