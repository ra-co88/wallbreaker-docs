import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "nextra-theme-docs";
import { Callout } from "@/components/callout";
import { StatCard, StatStrip } from "@/components/stat-card";
import { Terminal } from "@/components/terminal";
import { TagChip } from "@/components/tag-chip";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props: {
  params: Promise<{ mdxPath: string[] }>;
}) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const customComponents = {
  Callout,
  StatCard,
  StatStrip,
  Terminal,
  TagChip,
};

export default async function Page(props: {
  params: Promise<{ mdxPath: string[] }>;
}) {
  const params = await props.params;
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath
  );
  const mdxComponents = getMDXComponents(customComponents);
  const Wrapper = mdxComponents.wrapper;
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent components={mdxComponents} />
    </Wrapper>
  );
}
