export type CodeExample = {
  title: string;
  language: string;
  code: string;
};

export type ComponentPreview = {
  id: string;
  title: string;
};

export type CraftComponentMeta = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  registryId: string;
  /** Map position as CSS percentage strings */
  x: string;
  y: string;
  /** If provided, multiple preview sections are shown on the detail page */
  previews?: ComponentPreview[];
  examples: CodeExample[];
};
