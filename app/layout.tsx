import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
// @ts-expect-error -- CSS module
import "nextra-theme-docs/style.css";
// @ts-expect-error -- CSS module
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallbreaker Docs",
  description: "Documentation for Wallbreaker — the agentic LLM red-team harness",
};

// Self-hosted fonts: no render-blocking requests to fonts.googleapis.com,
// zero layout shift, and automatic preloading. Exposed as CSS variables
// consumed in app/globals.css and app/landing.css.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const navbar = (
  <Navbar
    logo={
      <span className="wb-logo">
        <span className="wb-logo-diamond">◆</span>
        <span className="wb-logo-wall">WALL</span>
        <span className="wb-logo-breaker">BREAKER</span>
      </span>
    }
  />
);

const footer = (
  <Footer>
    <div className="wb-footer">
      <div className="wb-footer-left">
        <a href="/break-the-wall" className="wb-footer-gem" title="break the wall — not the rules of engagement">
          break the wall — not the rules of engagement
        </a>
      </div>
      <div className="wb-footer-right">
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="wb-footer-link">
          <svg viewBox="0 0 76 65" fill="currentColor" width="14" height="14" style={{ marginRight: 4 }}>
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          Powered by Vercel
        </a>
        <span className="wb-footer-sep">·</span>
        <span className="wb-footer-license">AGPL-3.0-only</span>
        <span className="wb-footer-sep">·</span>
        <a href="https://github.com/JailbrokenAI/wallbreaker" target="_blank" rel="noopener noreferrer" className="wb-footer-link">GitHub (canonical)</a>
        <span className="wb-footer-sep">·</span>
        <a href="https://github.com/pt-act/wallbreaker" target="_blank" rel="noopener noreferrer" className="wb-footer-link">GitHub (dev fork)</a>
      </div>
    </div>
  </Footer>
);

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <Head />
      <body suppressHydrationWarning>
        <Layout
          navbar={navbar}
          nextThemes={{ attribute: "class", defaultTheme: "dark", forcedTheme: "dark" }}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/JailbrokenAI/wallbreaker/tree/main/website"
          editLink={null}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
