#!/bin/sh
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
FILENAME="webkit_${TIMESTAMP}.sql.gz"

echo "[$(date)] Starting backup..."

pg_dump -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "[$(date)] Backup created: ${FILENAME}"

# Retention: keep daily backups for 7 days
find "$BACKUP_DIR" -name "webkit_*.sql.gz" -mtime +7 -delete

echo "[$(date)] Cleanup complete."
