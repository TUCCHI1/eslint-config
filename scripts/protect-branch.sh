#!/bin/bash
# Apply standard branch protection ruleset
# Usage: ./scripts/protect-branch.sh [owner/repo]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO=${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}

gh api "repos/$REPO/rulesets" -X POST --input "$SCRIPT_DIR/../ruleset.json"

echo "✓ Ruleset applied to $REPO"
