# Wallbreaker Docs Site — build & deploy

Nextra 4 (Next.js 15) documentation site, dark-themed to match the wallbreaker
dashboard. Content lives in `content/**/*.mdx`; sidebar order in the `_meta.ts`
files; theme tokens + chrome overrides in `app/globals.css`; logo/footer in
`app/layout.tsx`. Dashboard screenshots are in `public/screenshots/`.

## Local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Deploy to Vercel

1. Commit this `website/` directory to the repo (e.g. on the pt-act fork) and push.
2. On vercel.com: **Add New… → Project** → import this repository → Vercel
   auto-detects Next.js (the site is at the repo root — no Root Directory
   setting needed) → Deploy. (CLI alternative: `npx vercel` from the repo root.)
3. Project name decides the subdomain — try `wallbreaker` first
   (`wallbreaker.vercel.app`); fall back to `wallbreaker-docs` etc. if taken.
   A custom domain can be added later in Project → Settings → Domains.
4. The footer already carries the **Powered by Vercel** badge, the AGPL-3.0-only
   notice and both GitHub links — that satisfies the open-source-program badge
   expectation from day one.

Use the deployed URL in the application's "URL to view the project live" field
(the GitHub repo stays in its own field).

## Editing content

- Pages: `content/**/*.mdx` (markdown + MDX components `<Callout>`, `<StatCard>`,
  `<Terminal>`, `<TagChip>` from `components/`).
- Nav labels/order: the `_meta.ts` next to each folder.
- Brand tokens: the `:root` block in `app/globals.css`.
