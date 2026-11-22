#!/usr/bin/env bash
# Start the NIRANJAN.AI backend API server.
# Usage: ./start.sh [--port PORT] [--reload]
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Load .env if present
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

PORT="${PORT:-8000}"
RELOAD=""
for arg in "$@"; do
  [[ "$arg" == "--reload" ]] && RELOAD="--reload"
  [[ "$arg" == "--port" ]] && shift && PORT="$1"
done

echo "Starting NIRANJAN.AI backend on http://localhost:$PORT ..."
.venv/bin/uvicorn main:app --host 0.0.0.0 --port "$PORT" $RELOAD
