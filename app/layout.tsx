import { ThemeProvider } from "@/components/theme/theme-provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backroom",
  description:
    "Operations platform for performance departments in sport. Track requests, measure turnaround, simulate load.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      {/*
        suppressHydrationWarning on <body> ignores attributes injected by
        browser extensions (ColorZilla's cz-shortcut-listen, Grammarly's
        data-gr-*, 1Password's data-lpignore, etc.). Without it, every user
        with a common extension sees a hydration warning in dev. No effect on
        legitimate hydration checks — those still fail as normal.
      */}
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
