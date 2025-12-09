#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export DATABASE_URL="${DATABASE_URL:-$(grep DATABASE_URL .env.local | cut -d= -f2-)}"

echo "1) Reset DB..."
npm run reset:db

echo "2) Seed mock data (requires SEED_MOCK=true)..."
SEED_MOCK=true npm run seed:mock
npm run dev
echo "3) Ready. You can now run: npm run dev"

