export type DocMetadata = {
  title: string;
  description: string;
  image?: string;
  category?: string;
  new?: boolean;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Doc = {
  metadata: DocMetadata;
  slug: string;
  content: string;
};
