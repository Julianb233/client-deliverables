#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

function readDefaultConfig() {
  const configPath = path.join(root, "lib", "portal-config.ts");
  const source = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  const url = source.match(/DEFAULT_CONVEX_URL\s*=\s*"([^"]+)"/)?.[1];
  const slug = source.match(/PORTAL_CLIENT_SLUG[^|]*\|\|\s*"([^"]+)"/)?.[1];
  return { url, slug };
}

const defaults = readDefaultConfig();
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || defaults.url;
const clientSlug = process.env.NEXT_PUBLIC_PORTAL_CLIENT_SLUG || defaults.slug;
const allowStaticFallback = process.env.PPP_ALLOW_STATIC_CONVEX_FALLBACK === "1";

if (!convexUrl) {
  console.error("Missing Convex URL. Set CONVEX_URL, NEXT_PUBLIC_CONVEX_URL, or DEFAULT_CONVEX_URL.");
  process.exit(1);
}

if (!clientSlug) {
  console.error("Missing portal client slug. Set NEXT_PUBLIC_PORTAL_CLIENT_SLUG or PORTAL_CLIENT_SLUG.");
  process.exit(1);
}

const checks = [
  // New-style aa-portals function names (quick-beagle-88)
  ["tenants:getBySlug", { slug: clientSlug }],
  ["feedEntries:listForTenant", { tenantSlug: clientSlug, limit: 1 }],
  ["actionItems:listForTenant", { tenantSlug: clientSlug }],
  ["changelog:listForTenant", { tenantSlug: clientSlug, limit: 1 }],
  // Legacy conventions — still present on quick-beagle-88 for backwards compat
  ["portalMessages:listForClient", { clientSlug, limit: 1 }],
  ["portalUpsellOffers:listForClient", { clientSlug }],
  ["portalUpsellIntents:listForClient", { clientSlug, limit: 1 }],
];

const client = new ConvexHttpClient(convexUrl);
const failures = [];

for (const [name, args] of checks) {
  try {
    await client.query(makeFunctionReference("query", name), args);
    console.log(`OK ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({ name, message });
    console.error(`MISSING ${name}`);
    console.error(message.split("\n")[0]);
  }
}

if (failures.length > 0) {
  const summary = failures.map((failure) => failure.name).join(", ");
  const message = `Convex portal SOT mismatch for ${clientSlug} at ${convexUrl}. Missing or failing functions: ${summary}.`;
  if (allowStaticFallback) {
    console.warn(`WARNING: ${message}`);
    process.exit(0);
  }
  console.error(message);
  console.error("Set PPP_ALLOW_STATIC_CONVEX_FALLBACK=1 only for an explicitly documented temporary fallback deploy.");
  process.exit(1);
}

console.log(`PASSED: Convex portal functions are live for ${clientSlug}.`);
