# Golang Dev Agent Instructions

This file contains the instructions an on-repo golang development agent needs to operate.

Minimum adapterConfig for `golang_dev_local`:

```json
{
  "adapterType": "golang_dev_local",
  "cwd": ".",
  "instructionsFilePath": "agents/golang/AGENTS.md"
}
```

Guidance
- Set `cwd` to the repository workspace root (or the folder containing Go modules).
- `instructionsFilePath` should be the path to this file (relative to `cwd`).
- The agent will generally run Go tooling from `cwd` — ensure `go` is available in CI / runner.

Example agent responsibilities
- Run `go test ./...` and report failures.
- Create or update small helper packages or example programs requested by humans.
- Follow the step-by-step instructions in `example-task.md` for simple tasks.

Troubleshooting
- If tests fail due to environment, make sure necessary environment variables and `GOPATH` are configured.
- If the agent cannot find the instructions file, confirm `adapterConfig.cwd` resolves to the repository root and `instructionsFilePath` is correct.
