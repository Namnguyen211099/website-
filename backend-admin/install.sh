#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "DXGroup v3.5.1 Installer"
if [ ! -f .env ]; then
  cp .env.example .env
  if command -v openssl >/dev/null 2>&1; then
    sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" .env
  fi
  echo "Created .env with a random JWT_SECRET"
fi
set -a
source .env
set +a

echo "npm install..."
npm install --no-audit --no-fund

if command -v mysql >/dev/null 2>&1; then
  echo "Importing database schema + development seed..."
  mysql -h "${DB_HOST:-127.0.0.1}" -P "${DB_PORT:-3306}" -u "${DB_USER:-root}" ${DB_PASS:+-p"$DB_PASS"} "${DB_NAME:-dxgroup}" < database/schema.sql
  mysql -h "${DB_HOST:-127.0.0.1}" -P "${DB_PORT:-3306}" -u "${DB_USER:-root}" ${DB_PASS:+-p"$DB_PASS"} "${DB_NAME:-dxgroup}" < database/seed.sql
  echo "Database imported. Seed accounts are DEVELOPMENT ONLY."
fi

if [ -d ../admin-panel ]; then
  echo "Building Admin Panel..."
  (cd ../admin-panel && npm install --no-audit --no-fund && npm run build)
fi

echo ""
echo "DXGroup v3.5.1 installed."
echo "Health: http://localhost:${PORT:-5000}/api/health"
echo "Configure production credentials in .env before deployment."
