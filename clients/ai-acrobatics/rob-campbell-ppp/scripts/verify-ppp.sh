#!/bin/bash
set -euo pipefail

DASH_DIR="${1:-.}"
ERRORS=0

echo "=== PPP QUALITY GATE CHECK ==="
echo "Directory: $DASH_DIR"

REQUIRED_PAGES=("app/page.tsx" "app/progress/page.tsx" "app/game-plans/page.tsx" "app/request/page.tsx" "app/operations/page.tsx" "app/deliverables/page.tsx" "app/changelog/page.tsx" "app/action-items/page.tsx" "app/activity/page.tsx" "app/more/page.tsx")
for page in "${REQUIRED_PAGES[@]}"; do
  if [ ! -f "$DASH_DIR/$page" ]; then
    echo "MISSING: $page"
    ERRORS=$((ERRORS + 1))
  fi
done

REQUIRED_DATA=("data/client-data.ts" "data/changelog.ts" "data/deliverables.ts" "data/action-items.ts" "data/milestones.ts" "data/meeting-notes.ts" "data/operations.ts")
for file in "${REQUIRED_DATA[@]}"; do
  if [ ! -f "$DASH_DIR/$file" ]; then
    echo "MISSING: $file"
    ERRORS=$((ERRORS + 1))
  fi
done

CHANGELOG_COUNT=$(grep -c "date:" "$DASH_DIR/data/changelog.ts" 2>/dev/null || echo 0)
DELIVERABLE_COUNT=$(grep -c "name:" "$DASH_DIR/data/deliverables.ts" 2>/dev/null || echo 0)
ACTION_COUNT=$(grep -c "instructions:" "$DASH_DIR/data/action-items.ts" 2>/dev/null || echo 0)

[ "$CHANGELOG_COUNT" -ge 10 ] || { echo "Changelog needs 10+, found $CHANGELOG_COUNT"; ERRORS=$((ERRORS + 1)); }
[ "$DELIVERABLE_COUNT" -ge 10 ] || { echo "Deliverables need 10+, found $DELIVERABLE_COUNT"; ERRORS=$((ERRORS + 1)); }
[ "$ACTION_COUNT" -ge 3 ] || { echo "Action items need 3+, found $ACTION_COUNT"; ERRORS=$((ERRORS + 1)); }

PLACEHOLDERS=$(grep -rn "Lorem\|TODO\|FIXME\|Coming soon\|TBD" "$DASH_DIR/data/" "$DASH_DIR/app/" 2>/dev/null | grep -v node_modules | grep -v ".next" | head -5 || true)
if [ -n "$PLACEHOLDERS" ]; then
  echo "$PLACEHOLDERS"
  ERRORS=$((ERRORS + 1))
fi

grep -rq "AI Acrobatics" "$DASH_DIR/app/layout.tsx" "$DASH_DIR/app/more/page.tsx" || { echo "Missing AI Acrobatics branding"; ERRORS=$((ERRORS + 1)); }
grep -q "Tasko/v0 PPP visual system" "$DASH_DIR/app/globals.css" || { echo "Missing Tasko/v0 PPP visual system"; ERRORS=$((ERRORS + 1)); }
grep -q "portal-topbar" "$DASH_DIR/app/layout.tsx" || { echo "Missing Tasko-style portal topbar"; ERRORS=$((ERRORS + 1)); }
grep -q "Game Plans" "$DASH_DIR/app/layout.tsx" || { echo "Missing Game Plans navigation"; ERRORS=$((ERRORS + 1)); }
grep -q "Request Center" "$DASH_DIR/app/layout.tsx" || { echo "Missing Request Center navigation"; ERRORS=$((ERRORS + 1)); }
grep -q "Operations" "$DASH_DIR/app/layout.tsx" || { echo "Missing Operations navigation"; ERRORS=$((ERRORS + 1)); }
grep -q "01KSNC02C1EBXF56962CH63MFR" "$DASH_DIR/data/meeting-notes.ts" || { echo "Missing Fireflies transcript source ID"; ERRORS=$((ERRORS + 1)); }
grep -q "portalMessages" "$DASH_DIR/app/api/client-message/route.ts" || { echo "Missing Convex portalMessages route"; ERRORS=$((ERRORS + 1)); }
grep -q "createLinearIssue" "$DASH_DIR/app/api/client-message/route.ts" || { echo "Missing Linear routing for client messages"; ERRORS=$((ERRORS + 1)); }
grep -q "portalFeed" "$DASH_DIR/app/api/client-message/route.ts" || { echo "Missing portalFeed notification for client messages"; ERRORS=$((ERRORS + 1)); }
grep -q "portalChangelog" "$DASH_DIR/app/api/meeting-sync/route.ts" || { echo "Missing meeting sync changelog write"; ERRORS=$((ERRORS + 1)); }
grep -q "MEETING_SYNC_SECRET" "$DASH_DIR/app/api/meeting-sync/route.ts" || { echo "Missing meeting sync secret support"; ERRORS=$((ERRORS + 1)); }
grep -q "portalStandardStatus" "$DASH_DIR/data/operations.ts" || { echo "Missing PPP operations status model"; ERRORS=$((ERRORS + 1)); }

REAL_LINKS=$(grep -c "https://" "$DASH_DIR/data/client-data.ts" 2>/dev/null || echo 0)
[ "$REAL_LINKS" -ge 2 ] || { echo "Need 2+ real hub links, found $REAL_LINKS"; ERRORS=$((ERRORS + 1)); }

cd "$DASH_DIR"
npm run build

if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS errors"
  exit 1
fi

echo "PASSED: All PPP quality gates clear."
