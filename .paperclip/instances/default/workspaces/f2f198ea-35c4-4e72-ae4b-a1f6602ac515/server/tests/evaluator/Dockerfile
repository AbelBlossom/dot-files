FROM debian:bookworm-slim

# Install required packages: node (18), npm, golang, git, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl gnupg git build-essential \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs golang-go \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /evaluator
COPY . /evaluator
RUN if [ -f package.json ]; then npm ci --omit=dev || true; fi

ENTRYPOINT ["node", "evaluate.js"]
