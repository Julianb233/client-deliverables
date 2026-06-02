import type { Metadata } from "next";
import Link from "next/link";
import { MessageMeWidget } from "../components/ClientPortalActions";
import { getPortalRuntimeData } from "../lib/convex";
import "./globals.css";

const nav = [
  ["Dashboard", "/", "D"],
  ["AI Roadmap", "/progress", "R"],
  ["Game Plans", "/game-plans", "P"],
  ["Request Center", "/request", "Q"],
  ["Operations", "/operations", "O"],
  ["Agents", "/agents", "A"],
  ["Automations", "/automations", "W"],
  ["Content + Growth", "/content-growth", "G"],
  ["Analytics", "/analytics", "N"],
  ["Action Items", "/action-items", "T"],
  ["Billing", "/billing", "$"],
  ["Activity", "/activity", "F"],
] as const;

const mobileNav = [
  ["Dashboard", "/"],
  ["Roadmap", "/progress"],
  ["Plans", "/game-plans"],
  ["Request", "/request"],
  ["Ops", "/operations"],
] as const;

export const metadata: Metadata = {
  title: "Rob Campbell PPP | AI Acrobatics",
  description: "Rob Campbell AI Prospect Engine Progress Portal Page powered by AI Acrobatics.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const runtime = await getPortalRuntimeData();
  const notifications = runtime.feed.slice(0, 6).map((item) => ({
    id: item.id,
    title: item.title,
    body: item.description,
    date: item.date,
    source: item.source,
    url: item.url,
  }));

  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar" aria-label="Portal navigation">
            <Link className="brand" href="/">
              <span className="brand-mark">RC</span>
              <span>
                <p className="brand-title">Rob Campbell</p>
                <p className="brand-subtitle">AI Prospect Engine</p>
              </span>
            </Link>
            <div className="operator-card">
              <p className="eyebrow">Private workspace</p>
              <strong>Deposit received</strong>
              <span>$5,500 paid. Build is active.</span>
            </div>
            <nav className="desktop-nav" aria-label="Main navigation">
              {nav.map(([label, href, icon]) => (
                <Link className="nav-link" href={href} key={href}>
                  <span className="nav-token" aria-hidden="true">{icon}</span>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="sidebar-footer">
              <p>No Dynamics or NMIS writes.</p>
              <p>Human approval before external sends.</p>
            </div>
          </aside>
          <header className="mobile-topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">RC</span>
              <span>
                <p className="brand-title">Rob Campbell</p>
                <p className="brand-subtitle">AI Prospect Engine</p>
              </span>
            </Link>
          </header>
          <div className="content-shell">
            <div className="portal-topbar" aria-label="Portal utility bar">
              <div className="search-shell">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input aria-label="Search portal" placeholder="Find roadmap, requests, agents, notes" />
                <kbd>⌘F</kbd>
              </div>
              <div className="topbar-actions">
                <a className="topbar-icon" href="/request" aria-label="Request center">✉</a>
                <a className="topbar-icon has-alert" href="/action-items" aria-label="Action items">●</a>
                <div className="profile-pill" aria-label="Client profile">
                  <span className="profile-avatar">RC</span>
                  <span>
                    <strong>Rob Campbell</strong>
                    <small>AI Prospect Engine</small>
                  </span>
                </div>
              </div>
            </div>
            {children}
          </div>
          <footer className="footer">
            <div className="footer-inner">Powered by AI Acrobatics</div>
          </footer>
          <MessageMeWidget notifications={notifications} />
          <nav className="bottom-nav" aria-label="Mobile navigation">
            <div className="bottom-nav-inner">
              {mobileNav.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
