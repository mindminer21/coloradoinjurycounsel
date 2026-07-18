#!/bin/bash
set -e
cd /home/claude/whiteford-pi
export VERCEL_TOKEN=$(cat /home/claude/.vercel_token)
TEAM="team_ySSHOEyF8rwKbMyYuW2w2lQ8"
NPXV="npx -y vercel@latest"
# link project (creates if missing)
$NPXV link --yes --project whiteford-mountain-west-injury --scope $TEAM --token $VERCEL_TOKEN
# env vars (server-side only)
if [ -f /home/claude/.hl_token ]; then
  printf '%s' "$(cat /home/claude/.hl_token)" | $NPXV env add HIGHLEVEL_PIT production --token $VERCEL_TOKEN --scope $TEAM --force || true
  printf 'tm68WWMrcAa3TqQbEAMa' | $NPXV env add HIGHLEVEL_LOCATION_ID production --token $VERCEL_TOKEN --scope $TEAM --force || true
fi
printf '%s' "$HEALTH_KEY_VALUE" | $NPXV env add HEALTH_KEY production --token $VERCEL_TOKEN --scope $TEAM --force || true
# deploy production
$NPXV deploy --prod --yes --token $VERCEL_TOKEN --scope $TEAM 2>&1 | tee /tmp/vercel-deploy.log
