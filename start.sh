#!/bin/sh

# Set default DATABASE_URL if not provided
export DATABASE_URL="${DATABASE_URL:-file:/app/data/notes.db}"

# Ensure data directory exists
mkdir -p /app/data

# Push database schema
npx prisma db push

# Start Next.js
exec next start
