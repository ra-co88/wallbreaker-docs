declare module "nextra/pages" {
  import type { ComponentType } from "react";

  interface ImportPageResult {
    default: ComponentType<{ components?: Record<string, ComponentType> }>;
    toc: Array<Record<string, any>>;
    metadata: Record<string, any>;
    sourceCode: string;
  }

  export function generateStaticParamsFor(
    paramKey?: string
  ): (
    ...args: any[]
  ) => Promise<Array<Record<string, string | string[] | undefined>>>;

  export function importPage(
    mdxPath: string[] | undefined
  ): Promise<ImportPageResult>;
}
