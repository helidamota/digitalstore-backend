#!/bin/sh

set -e

echo "Running migrations..."
node src/migrate.js

echo "Starting application..."
exec "$@"
