#!/bin/bash
# Check that no directory exceeds max file count
# Usage: ./scripts/check-dir-size.sh [max_files] [directory]

set -e

MAX_FILES=${1:-10}
TARGET_DIR=${2:-src}
EXIT_CODE=0

while IFS= read -r dir; do
  count=$(find "$dir" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -gt "$MAX_FILES" ]; then
    echo "ERROR: $dir has $count files (max: $MAX_FILES)"
    EXIT_CODE=1
  fi
done < <(find "$TARGET_DIR" -type d 2>/dev/null)

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "✓ All directories have $MAX_FILES or fewer files"
fi

exit $EXIT_CODE
