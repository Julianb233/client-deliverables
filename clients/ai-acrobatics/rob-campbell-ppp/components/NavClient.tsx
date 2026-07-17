"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const nav = [
  ["Dashboard", "/", "D"],
  ["Live Command Center", "https://rob.aiacrobatics.com/rob-os", "L"],
  ["Workspace", "/workspace", "W"],
  ["Hermes Agency", "/agency-workspace", "H"],
  ["AI Roadmap", "/progress", "R"],
  ["Game Plans", "/game-plans", "P"],
  ["Meeting Deck", "/meeting-deck", "M"],
  ["Onboarding", "/onboarding", "K"],
  ["Request Center", "/request", "Q"],
  ["Book Call", "/book-onboarding", "C"],
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
  ["Command", "https://rob.aiacrobatics.com/rob-os"],
  ["Plans", "/game-plans"],
  ["Actions", "/action-items"],
  ["Request", "/request"],
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="desktop-nav" aria-label="Main navigation">
      {nav.map(([label, href, icon]) => {
        const isActive = href === "/" ? pathname === "/" : href.startsWith("/") && pathname.startsWith(href);
        return (
          <Link
            className={`nav-link${isActive ? " active" : ""}`}
            href={href}
            key={href}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="nav-token" aria-hidden="true">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <div className="bottom-nav-inner">
        {mobileNav.map(([label, href]) => {
          const isActive = href === "/" ? pathname === "/" : href.startsWith("/") && pathname.startsWith(href);
          return (
            <Link
              href={href}
              key={href}
              className={isActive ? "active" : ""}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
