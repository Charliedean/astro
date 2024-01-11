#!/usr/bin/env bash

# Convert context URL to an array
mapfile -t CONTEXT_URL_ITEMS < <(echo "$GITPOD_WORKSPACE_CONTEXT_URL" | tr '/' '\n')

# Install latest pnpm
curl -fsSL https://get.pnpm.io/install.sh | SHELL=`which bash` bash -


# Wait for VSCode to be ready (port 23000)
gp ports await 23000 > /dev/null 2>&1

echo "Loading project: $EXAMPLE_PROJECT"

# Go to the requested example project
cd "$GITPOD_REPO_ROOT"/sites/"securesynclabs" || exit
# Start Astro
pnpm start
