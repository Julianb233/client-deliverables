#!/usr/bin/env bash
set -euo pipefail

AA_FLEET_DIR="/Users/julianbradley/.hermes/workspaces/aa-fleet"
ENV_FILE="/Users/julianbradley/.hermes/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing Hermes env: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

cd "$AA_FLEET_DIR"

npx convex run portalClients:upsertBySlug "$(cat <<'JSON'
{
  "slug": "rob-campbell",
  "name": "Rob Campbell | AI Acrobatics",
  "contact_name": "Rob Campbell",
  "contact_email": "Robert.t.campbell5@gmail.com",
  "ppp_url": "https://rob-campbell-ppp.vercel.app/",
  "deployed_url": "https://rob-campbell-proposal.vercel.app/",
  "fanbasis_payment_url": "https://www.fanbasis.com/agency-checkout/Aiacrobatics/A8KNB",
  "linear_project_id": "35cf66ad-461d-4b5d-a300-5f84dde0905d",
  "repo_path": "/opt/agency-workspace/client-repos/client-deliverables/clients/ai-acrobatics/rob-campbell-ppp",
  "theme_color": "#123932",
  "services": ["PPP", "Hermes workspace", "AI Prospect Engine", "HubSpot read-only audit", "Retainer reporting"],
  "health_score": 88,
  "onboarding_status": "deposit-received",
  "onboarded": true,
  "metadata": {
    "sourceIssue": "AI-8865",
    "projectIssue": "AI-10321",
    "pppIssue": "AI-10329",
    "paymentStatus": "Deposit received",
    "depositAmount": 5500,
    "depositReceived": true,
    "firefliesTranscriptId": "01KSNC02C1EBXF56962CH63MFR",
    "june3FirefliesStatus": "not_available_from_connector",
    "hermesWorkspace": "/Users/julianbradley/.hermes/workspaces/rob-campbell-ai-prospect-engine",
    "proposalUrl": "https://rob-campbell-proposal.vercel.app/",
    "hubspotInspectionPlanUrl": "https://drive.google.com/file/d/1SPdXFlkOFMpNzAlxeWXd-xfe_39e0G6g/view?usp=drivesdk",
    "meetingNotesSourceIndexUrl": "https://drive.google.com/file/d/1wtb9UaRQpgh0zACDAXPQ2E9yAT0FXBud/view?usp=drivesdk",
    "dataSource": "Convex aa-fleet portal tables",
    "complianceGuardrails": [
      "No Dynamics writes",
      "No NMIS writes",
      "No client data in AI tools",
      "No AI investment advice",
      "No external sends without Julian approval",
      "HubSpot remains read-only until access and scope are confirmed"
    ]
  }
}
JSON
)"

npx convex run portalFeed:insertFromHttp '{"clientSlug":"rob-campbell","type":"milestone","title":"Deposit received","body":"Rob paid the $5,500 deposit. The build is now in onboarding and implementation mode, with client-facing sends held for Julian review.","url":"https://rob-campbell-proposal.vercel.app/","icon":"payment","agent":"Codex"}'
npx convex run portalFeed:insertFromHttp '{"clientSlug":"rob-campbell","type":"deploy","title":"Rob PPP linked to Convex","body":"Rob Campbell PPP now reads live portal client, feed, action item, and changelog data from the aa-fleet Convex deployment, with static fallback if Convex is unavailable.","url":"https://rob-campbell-ppp.vercel.app/","icon":"database","agent":"Codex"}'
npx convex run portalFeed:insertFromHttp '{"clientSlug":"rob-campbell","type":"milestone","title":"Hermes workspace foundation complete","body":"Profile rob-campbell and workspace rob-campbell-ai-prospect-engine are created with agents, swarms, skills, runbook, source map, and compliance boundary.","url":"https://linear.app/ai-acrobatics/issue/AI-10321/coordinate-rob-campbell-hermes-ai-prospect-engine-buildout","icon":"sparkles","agent":"Codex"}'
npx convex run portalFeed:insertFromHttp '{"clientSlug":"rob-campbell","type":"approval-needed","title":"HubSpot access remains pending","body":"HubSpot remains staged/read-only until Rob grants access and Julian approves the exact scope.","icon":"lock","agent":"Codex"}'
npx convex run portalFeed:insertFromHttp '{"clientSlug":"rob-campbell","type":"deliverable","title":"HubSpot inspection plan added","body":"Agents now have a read-only inspection checklist for HubSpot access proof, object inventory, field hygiene, duplicate/stale records, workflow risk, integrations, compliance flags, and reporting readiness.","url":"https://drive.google.com/file/d/1SPdXFlkOFMpNzAlxeWXd-xfe_39e0G6g/view?usp=drivesdk","icon":"crm","agent":"Codex"}'
npx convex run portalFeed:insertFromHttp '{"clientSlug":"rob-campbell","type":"source","title":"Meeting notes source index added","body":"Fireflies still does not expose the June 3 transcript, so Drive now has a source index pointing agents to the onboarding brief and presentation until the transcript appears.","url":"https://drive.google.com/file/d/1wtb9UaRQpgh0zACDAXPQ2E9yAT0FXBud/view?usp=drivesdk","icon":"notes","agent":"Codex"}'

npx convex run portalChangelog:insertFromHttp '{"clientSlug":"rob-campbell","title":"Deposit status updated","description":"Portal and Convex metadata now reflect that the $5,500 deposit has been received.","category":"strategy","items":["Payment status changed to deposit received","Onboarding status changed to deposit-received","Client sends remain gated for Julian review"],"linearIssueIds":["AI-8865","AI-10321"],"repo":"rob-campbell-ppp","agent":"Codex"}'
npx convex run portalChangelog:insertFromHttp '{"clientSlug":"rob-campbell","title":"PPP Convex link implemented","description":"Portal runtime can read Rob client metadata, feed, changelog, and action items from Convex.","category":"infrastructure","items":["Added Convex runtime adapter","Seeded Rob portal client","Seeded feed and action items"],"linearIssueIds":["AI-10329"],"repo":"rob-campbell-ppp","agent":"Codex"}'
npx convex run portalChangelog:insertFromHttp '{"clientSlug":"rob-campbell","title":"Compliance boundary preserved in portal data","description":"Convex client metadata includes Rob-specific financial services guardrails.","category":"strategy","items":["No Dynamics writes","No NMIS writes","No client data in AI tools","No AI investment advice"],"linearIssueIds":["AI-10323"],"repo":"rob-campbell-ppp","agent":"Codex"}'
npx convex run portalChangelog:insertFromHttp '{"clientSlug":"rob-campbell","title":"HubSpot inspection plan published","description":"Read-only HubSpot inspection checklist added to Drive and surfaced in the PPP for agents and Rob review.","category":"operations","items":["Access and scope proof","Object inventory","Compliance segmentation","Field hygiene","Duplicate and stale record review","Workflow and integration risk"],"linearIssueIds":["AI-10493"],"repo":"rob-campbell-ppp","agent":"Codex"}'
npx convex run portalChangelog:insertFromHttp '{"clientSlug":"rob-campbell","title":"Meeting notes source index published","description":"Drive meeting notes folder now contains a source index because Fireflies has not exposed the June 3 onboarding transcript.","category":"source","items":["Fireflies June 3 transcript not available from connector","Drive onboarding brief is the current reviewed source","04-Meeting-Notes now has the source index"],"linearIssueIds":["AI-10492","AI-10493"],"repo":"rob-campbell-ppp","agent":"Codex"}'

npx convex run portalActionItems:upsertByLinearId '{"clientSlug":"rob-campbell","linearIssueId":"rob-action-001","title":"Confirm HubSpot access and scope","why":"HubSpot live data cannot appear in the PPP or Hermes workflows until access and scope are confirmed.","howTo":"Confirm the HubSpot portal/account; approve read-only audit scope first; hold write access until Julian confirms exact workflow.","impact":"Unlocks the first real CRM hygiene report.","estimatedTime":"10 minutes","priority":"high","status":"open","linearUrl":"https://linear.app/ai-acrobatics/issue/AI-10325/prepare-hubspot-read-only-audit-workflow-for-rob"}'
npx convex run portalActionItems:upsertByLinearId '{"clientSlug":"rob-campbell","linearIssueId":"rob-action-002","title":"Confirm target employer priority list","why":"The signal radar needs Rob’s highest-priority tech employer targets before ongoing monitoring starts.","howTo":"Review the initial employer list; add preferred companies; flag any employers to exclude.","impact":"Improves signal relevance and reduces noisy research.","estimatedTime":"15 minutes","priority":"medium","status":"open","linearUrl":"https://linear.app/ai-acrobatics/issue/AI-10324/run-public-data-daily-signal-swarm-dry-run"}'
npx convex run portalActionItems:upsertByLinearId '{"clientSlug":"rob-campbell","linearIssueId":"rob-action-003","title":"Approve compliance-safe operating boundary","why":"Financial services workflows must stay inside the no-client-data and no-investment-advice boundary.","howTo":"Review the boundary summary; confirm Northwestern Mutual or Hearsay constraints; send corrections before live workflows begin.","impact":"Allows agents to continue safely without drifting into regulated advice.","estimatedTime":"10 minutes","priority":"high","status":"open","linearUrl":"https://linear.app/ai-acrobatics/issue/AI-10323/build-compliance-boundary-regression-tests-for-rob-workspace"}'
npx convex run portalActionItems:upsertByLinearId '{"clientSlug":"rob-campbell","linearIssueId":"rob-action-004","title":"Choose retainer tier after initial build","why":"The operating cadence depends on whether Rob wants Operator, Growth, or Build Partner support after the initial build.","howTo":"Review the monthly tier differences; choose desired support level; use the matching FanBasis link after Julian confirms timing.","impact":"Sets the reporting, monitoring, and development capacity for month one.","estimatedTime":"10 minutes","priority":"medium","status":"open","linearUrl":"https://rob-campbell-proposal.vercel.app/"}'
npx convex run portalActionItems:upsertByLinearId '{"clientSlug":"rob-campbell","linearIssueId":"rob-action-005","title":"Review the HubSpot inspection plan","why":"Agents need Rob-approved CRM boundaries before inspecting live HubSpot data.","howTo":"Open the HubSpot Inspection Plan in Drive; confirm whether HubSpot is prospect-only or mixed with client-sensitive data; mark any fields, lists, workflows, or integrations agents should not touch; approve read-only inspection before cleanup recommendations become active work.","impact":"Unlocks a safe HubSpot audit without crossing financial-services compliance boundaries.","estimatedTime":"15 minutes","priority":"high","status":"open","linearUrl":"https://drive.google.com/file/d/1SPdXFlkOFMpNzAlxeWXd-xfe_39e0G6g/view?usp=drivesdk"}'
npx convex run portalActionItems:upsertByLinearId '{"clientSlug":"rob-campbell","linearIssueId":"rob-action-006","title":"Confirm June onboarding notes source","why":"Fireflies has not exposed the June 3 transcript, so the agents need confirmation that Drive onboarding assets are the current working source.","howTo":"Open the Meeting Notes Source Index in Drive; confirm the onboarding brief is acceptable until Fireflies exposes the transcript; add or request any missing decisions from the onboarding call.","impact":"Prevents agents from missing meeting context or claiming a Fireflies transcript was reviewed when it was not.","estimatedTime":"10 minutes","priority":"medium","status":"open","linearUrl":"https://drive.google.com/file/d/1wtb9UaRQpgh0zACDAXPQ2E9yAT0FXBud/view?usp=drivesdk"}'

npx convex run portalUpsellOffers:upsertByClientOffer '{"clientSlug":"rob-campbell","offerSlug":"lead-gen-machine","title":"Lead Gen Machine","category":"growth-agent","outcome":"Turn cold traffic and public signals into a cleaner prospect pipeline.","whyItFits":"Rob’s current build is already centered on compliant prospect-side research and follow-up signals.","setupEstimate":"1-2 weeks after source access","priceLabel":"Request scoped quote","requestOnly":true,"status":"recommended","sortOrder":10}'
npx convex run portalUpsellOffers:upsertByClientOffer '{"clientSlug":"rob-campbell","offerSlug":"appointment-setter","title":"Appointment Setter","category":"growth-agent","outcome":"Move qualified prospects from interest to booked conversations with fewer manual touches.","whyItFits":"Once HubSpot and the signal queue are clean, the next unlock is routing qualified interest into calendar-ready next steps.","setupEstimate":"3-5 days after calendar/CRM scope","priceLabel":"Request scoped quote","requestOnly":true,"status":"recommended","sortOrder":20}'
npx convex run portalUpsellOffers:upsertByClientOffer '{"clientSlug":"rob-campbell","offerSlug":"workflow-wizard","title":"Workflow Wizard","category":"operations","outcome":"Connect HubSpot, reporting, calendar, and follow-up workflows without manual copy/paste.","whyItFits":"The first implementation stage already depends on safe read-only CRM review and repeatable operator reporting.","setupEstimate":"48-72 hours per approved workflow","priceLabel":"Request scoped quote","requestOnly":true,"status":"available","sortOrder":30}'
npx convex run portalUpsellOffers:upsertByClientOffer '{"clientSlug":"rob-campbell","offerSlug":"data-decoder","title":"Data Decoder","category":"data-reporting","outcome":"Show where time, leads, content, and agent usage are creating value.","whyItFits":"Rob will need simple monthly proof of what the AI Prospect Engine did and what to improve next.","setupEstimate":"3-5 days after baseline metrics","priceLabel":"Included in higher retainers","requestOnly":true,"status":"recommended","sortOrder":40}'
npx convex run portalUpsellOffers:upsertByClientOffer '{"clientSlug":"rob-campbell","offerSlug":"operator-retainer","title":"Operator Retainer","category":"retainer","outcome":"Monthly monitoring, light workflow tuning, reports, and AI credit coverage.","whyItFits":"This is the natural operating tier after the initial AI Prospect Engine build goes live.","setupEstimate":"Starts after initial build","priceLabel":"$1,500/mo","checkoutUrl":"https://www.fanbasis.com/agency-checkout/Aiacrobatics/DwW1B","status":"available","sortOrder":50}'
npx convex run portalUpsellOffers:upsertByClientOffer '{"clientSlug":"rob-campbell","offerSlug":"growth-retainer","title":"Growth Retainer","category":"retainer","outcome":"Adds weekly signal reviews, deeper iteration, and more dev/consulting capacity.","whyItFits":"Use this when the prospect engine is producing enough signal to justify faster iteration.","setupEstimate":"Starts after initial build","priceLabel":"$2,500/mo","checkoutUrl":"https://www.fanbasis.com/agency-checkout/Aiacrobatics/rgV2w","status":"available","sortOrder":60}'

echo "Seeded rob-campbell portal data into Convex."
