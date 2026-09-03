import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/docs",
  defaultShowCopyCode: true,
});

export default withNextra({
  // Docs-only site: the former landing page at `/` was retired, so the root
  // bounces straight to the docs index. `permanent: false` (307) keeps the
  // redirect un-cached in case the landing ever comes back.
  async redirects() {
    return [{ source: "/", destination: "/docs", permanent: false }];
  },
  // Pin the workspace root: a stray package-lock.json in the home directory
  // otherwise makes Next.js infer /Users/rna as the root, which slows down
  // file tracing and watching during development.
  outputFileTracingRoot: import.meta.dirname,
});