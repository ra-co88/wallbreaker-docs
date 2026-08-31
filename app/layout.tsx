import type { ReactNode } from "react";
import type { Metadata } from "next";
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
        <span className="wb-footer-tagline">
          break the wall — not the rules of engagement
        </span>
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
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
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
