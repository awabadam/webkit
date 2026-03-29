#!/bin/bash
set -e

echo "Deploying Webkit..."

echo "1. Building images..."
docker compose build

echo "2. Running migrations..."
docker compose run --rm app npx prisma migrate deploy --config prisma/prisma.config.ts

echo "3. Starting services..."
docker compose up -d

echo "4. Checking health..."
sleep 5
docker compose ps

echo ""
echo "Deploy complete!"
echo "Site: http://localhost (or your domain)"
