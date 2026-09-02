import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/docs",
  defaultShowCopyCode: true,
});

export default withNextra({
  // Pin the workspace root: a stray package-lock.json in the home directory
  // otherwise makes Next.js infer /Users/rna as the root, which slows down
  // file tracing and watching during development.
  outputFileTracingRoot: import.meta.dirname,
});