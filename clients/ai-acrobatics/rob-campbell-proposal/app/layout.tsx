import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Rob Campbell - AI Prospect Engine Proposal | AI Acrobatics",
  description:
    "Updated proposal for Rob Campbell's compliance-safe AI Prospect Engine, including implementation scope, payment options, monthly retainer, and next steps.",
  robots: {
    index: false,
    follow: false
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
