#!/bin/bash
set -e

# Force Vercel rebuild
echo "Building MINEX MEDIA Onboarding Form..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the script directory
cd "$SCRIPT_DIR"

# Ensure public directory exists
mkdir -p public

# Backup admin.html and dashboard.html if they exist
ADMIN_BACKUP=""
DASHBOARD_BACKUP=""
if [ -f public/admin.html ]; then
  ADMIN_BACKUP=$(mktemp)
  cp public/admin.html "$ADMIN_BACKUP"
fi
if [ -f public/dashboard.html ]; then
  DASHBOARD_BACKUP=$(mktemp)
  cp public/dashboard.html "$DASHBOARD_BACKUP"
fi

# Remove old index.html if it exists
rm -f public/index.html

# Copy the form file to public
cp minex-intake-form-email.html public/index.html

# Preserve submissions dashboard
if [ ! -d public/submissions ]; then
  mkdir -p public/submissions
  cp public/submissions.html public/submissions/index.html
fi

# Restore admin.html and dashboard.html
if [ -n "$ADMIN_BACKUP" ] && [ -f "$ADMIN_BACKUP" ]; then
  cp "$ADMIN_BACKUP" public/admin.html
  rm "$ADMIN_BACKUP"
fi
if [ -n "$DASHBOARD_BACKUP" ] && [ -f "$DASHBOARD_BACKUP" ]; then
  cp "$DASHBOARD_BACKUP" public/dashboard.html
  rm "$DASHBOARD_BACKUP"
fi

echo "✓ Form deployed with Olivier Bruneau signature"
echo "✓ public/index.html updated successfully"

# Verify the signature code is in the file
if grep -q "Olivier Bruneau" public/index.html; then
  echo "✓ Verified: Olivier Bruneau signature is present in the deployed file"
else
  echo "✗ WARNING: Olivier Bruneau signature not found in deployed file"
  exit 1
fi
