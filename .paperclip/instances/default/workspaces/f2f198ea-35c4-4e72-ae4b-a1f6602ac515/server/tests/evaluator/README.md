# Evaluator

Simple evaluator to run on candidate submissions. It performs two checks:

1. Runs `go test ./...` in the submission directory.
2. Checks for presence of `POST /sum` handler by searching for `POST` and `sum` in Go files (rudimentary heuristic).

Usage

node evaluate.js /path/to/submission

Note: This is intentionally minimal. Maintain security when running untrusted code. Run inside an isolated environment or container for production use.
