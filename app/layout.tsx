import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChaseLog — overdue invoice tracker for freelancers",
  description: "Know which client invoice to chase today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
