# How to Implement a File-Based MDX Blog in Next.js

This guide walks through implementing a fully static, file-based blog system using MDX in a Next.js (App Router) project — no database or CMS required.

---

## 1. Install Dependencies

```bash
pnpm add next-mdx-remote date-fns nuqs react-hotkeys-hook fumadocs-core schema-dts
pnpm add -D gray-matter remark remark-gfm remark-mdx rehype-slug rehype-external-links rehype-pretty-code shiki @tailwindcss/typography
```

| Package | Purpose |
|---------|---------|
| `next-mdx-remote` | Renders MDX on the server (RSC-compatible) |
| `gray-matter` | Parses YAML frontmatter from `.mdx` files |
| `date-fns` | Formats dates for display |
| `nuqs` | URL query-state for search (`?q=...`) |
| `rehype-pretty-code` + `shiki` | Syntax highlighting in code blocks |
| `rehype-slug` | Adds `id` attributes to headings |
| `rehype-external-links` | Makes external links open in new tabs |
| `remark-gfm` | GitHub Flavored Markdown (tables, strikethrough, etc.) |
| `fumadocs-core` | Extracts table of contents from MDX content |
| `schema-dts` | TypeScript types for JSON-LD structured data |
| `react-hotkeys-hook` | Keyboard shortcuts (prev/next navigation) |
| `@tailwindcss/typography` | `prose` class for styled article content |

---

## 2. Define the Document Types

Create `src/features/doc/types/document.ts`:

```typescript
export type DocMetadata = {
  title: string
  description: string
  image?: string        // OG image URL (1200x630 recommended)
  category?: string     // e.g. "components" — omit for blog posts
  new?: boolean         // Show a "New" badge
  pinned?: boolean      // Pin to top of list
  createdAt: string     // ISO date: YYYY-MM-DD
  updatedAt: string     // ISO date: YYYY-MM-DD
}

export type Doc = {
  metadata: DocMetadata
  slug: string          // Derived from filename (without .mdx)
  content: string       // Raw MDX content body
}
```

---

## 3. Create the Content Directory

Store all blog posts as `.mdx` files in a single directory:

```
src/features/doc/content/
├── welcome.mdx
├── my-first-post.mdx
└── another-post.mdx
```

Each file uses YAML frontmatter:

```mdx
---
title: Welcome to My Blog
description: An introduction to what this blog is about.
image: https://example.com/og-image.png
pinned: true
createdAt: 2025-02-14
updatedAt: 2025-03-26
---

## Hello World

This is the body of the post written in MDX.
```

The filename becomes the URL slug (e.g., `welcome.mdx` → `/blog/welcome`).

---

## 4. Build the Document Data Layer

Create `src/features/doc/data/documents.ts`:

```typescript
import fs from "fs"
import matter from "gray-matter"
import path from "path"
import { cache } from "react"

import type { Doc, DocMetadata } from "@/features/doc/types/document"

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)
  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles.map<Doc>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    return { metadata, slug, content }
  })
}

// React cache() ensures this only runs once per render pass
export const getAllDocs = cache(() => {
  return getMDXData(
    path.join(process.cwd(), "src/features/doc/content")
  ).sort((a, b) => {
    // Pinned posts first
    if (a.metadata.pinned && !b.metadata.pinned) return -1
    if (!a.metadata.pinned && b.metadata.pinned) return 1
    // Then by date, newest first
    return (
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
    )
  })
})

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug)
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata?.category === category)
}

export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length
  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      }
    }
  }
  return { previous: null, next: null }
}
```

Key design decisions:
- **`React.cache()`** deduplicates filesystem reads within a single render pass — no need for a database or external caching layer.
- **Sorting**: pinned posts first, then by `createdAt` descending.
- **`findNeighbour()`**: enables previous/next navigation between posts.

---

## 5. Create the MDX Renderer Component

Create `src/components/mdx.tsx`:

```typescript
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

// Map standard HTML elements to your custom styled components
const components: MDXRemoteProps["components"] = {
  h1: (props) => <h1 className="text-3xl font-bold" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="text-xl font-medium" {...props} />,
  // Add table, code, and any custom components here
}

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener" }],
      rehypeSlug,
      // Add rehypePrettyCode for syntax highlighting:
      // [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" } }],
    ],
  },
}

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />
}
```

This uses `next-mdx-remote/rsc` which renders MDX as a React Server Component — no client-side JS needed for the content itself.

---

## 6. Build the Blog Listing Page

Create `src/app/blog/page.tsx`:

```typescript
import type { Metadata } from "next"
import { Suspense } from "react"

import { getAllDocs } from "@/features/doc/data/documents"
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { PostList } from "@/features/blog/components/post-list"

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on development, design, and ideas.",
}

export default function Page() {
  const allPosts = getAllDocs()

  return (
    <div>
      <h1>Blog</h1>

      <Suspense fallback={<div className="h-9 w-full rounded-lg border" />}>
        <PostSearchInput />
      </Suspense>

      {/* Suspense boundary: shows all posts initially, then filters client-side */}
      <Suspense fallback={<PostList posts={allPosts} />}>
        <PostListWithSearch posts={allPosts} />
      </Suspense>
    </div>
  )
}
```

---

## 7. Build the Blog Post Page

Create `src/app/blog/[slug]/page.tsx`:

```typescript
import { getTableOfContents } from "fumadocs-core/content/toc"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { BlogPosting, WithContext } from "schema-dts"

import { MDX } from "@/components/mdx"
import { SITE_URL } from "@/config/site"
import {
  findNeighbour,
  getAllDocs,
  getDocBySlug,
} from "@/features/doc/data/documents"

// Fully static — no ISR, no fallback for unknown slugs
export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)
  if (!doc) return notFound()

  const { title, description, image, createdAt, updatedAt } = doc.metadata

  return {
    title,
    description,
    openGraph: {
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: image ? { url: image, width: 1200, height: 630, alt: title } : undefined,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)
  if (!doc) notFound()

  const toc = getTableOfContents(doc.content)
  const allDocs = getAllDocs()
  const { previous, next } = findNeighbour(allDocs, slug)

  // JSON-LD structured data for SEO
  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.metadata.title,
    description: doc.metadata.description,
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    url: `${SITE_URL}/blog/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="prose dark:prose-invert max-w-none px-4">
        <h1>{doc.metadata.title}</h1>
        <p className="text-muted-foreground">{doc.metadata.description}</p>

        {/* Table of contents extracted from headings */}
        {/* <InlineTOC items={toc} /> */}

        <MDX code={doc.content} />
      </article>

      {/* Previous/Next navigation */}
      <nav>
        {previous && <a href={`/blog/${previous.slug}`}>← {previous.metadata.title}</a>}
        {next && <a href={`/blog/${next.slug}`}>{next.metadata.title} →</a>}
      </nav>
    </>
  )
}
```

Key features:
- **`generateStaticParams()`** pre-renders all blog posts at build time.
- **`force-static` + `dynamicParams = false`** ensures unknown slugs return 404.
- **JSON-LD** structured data for search engine rich results.
- **`fumadocs-core`** extracts table of contents from MDX headings.

---

## 8. Implement Client-Side Search

### Search query hook (`src/features/blog/hooks/use-search-query.ts`):

```typescript
import { useQueryState } from "nuqs"

export function useSearchQuery() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" })
  return { query, setQuery }
}
```

### Filtering hook (`src/features/blog/hooks/use-filtered-posts.ts`):

```typescript
import type { Doc } from "@/features/doc/types/document"
import { useSearchQuery } from "./use-search-query"

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "")

const matchesQuery = (post: Doc, normalizedQuery: string) => {
  return (
    normalize(post.metadata.title).includes(normalizedQuery) ||
    normalize(post.metadata.description).includes(normalizedQuery)
  )
}

export function useFilteredPosts(posts: Doc[]) {
  const { query } = useSearchQuery()
  if (!query) return posts
  return posts.filter((post) => matchesQuery(post, normalize(query)))
}
```

### Search input component (`src/features/blog/components/post-search-input.tsx`):

```typescript
"use client"

import { useSearchQuery } from "../hooks/use-search-query"

export function PostSearchInput() {
  const { query, setQuery } = useSearchQuery()

  return (
    <input
      type="text"
      placeholder="Search Blog…"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
```

### List wrapper with search (`src/features/blog/components/post-list-with-search.tsx`):

```typescript
"use client"

import type { Doc } from "@/features/doc/types/document"
import { useFilteredPosts } from "../hooks/use-filtered-posts"
import { PostList } from "./post-list"

export function PostListWithSearch({ posts }: { posts: Doc[] }) {
  const filteredPosts = useFilteredPosts(posts)
  return <PostList posts={filteredPosts} />
}
```

The search state lives in the URL (`?q=react`), which means it's shareable, bookmarkable, and works with the browser back button — all handled by `nuqs`.

---

## 9. Build the Post List and Post Item Components

### Post list (`src/features/blog/components/post-list.tsx`):

```typescript
import type { Doc } from "@/features/doc/types/document"
import { PostItem } from "./post-item"

export function PostList({ posts }: { posts: Doc[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {posts.map((post, index) => (
        <PostItem key={post.slug} post={post} shouldPreloadImage={index <= 4} />
      ))}
      {posts.length === 0 && <p>No posts found.</p>}
    </div>
  )
}
```

### Post item (`src/features/blog/components/post-item.tsx`):

```typescript
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import type { Doc } from "@/features/doc/types/document"

export function PostItem({
  post,
  shouldPreloadImage,
}: {
  post: Doc
  shouldPreloadImage?: boolean
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2 p-2">
      {post.metadata.image && (
        <Image
          src={post.metadata.image}
          alt={post.metadata.title}
          width={1200}
          height={630}
          priority={shouldPreloadImage}
        />
      )}

      <h3 className="text-lg font-medium">
        {post.metadata.title}
        {post.metadata.new && (
          <span className="ml-2 inline-block size-2 rounded-full bg-blue-500" />
        )}
      </h3>

      <time dateTime={new Date(post.metadata.createdAt).toISOString()}>
        {format(new Date(post.metadata.createdAt), "dd.MM.yyyy")}
      </time>
    </Link>
  )
}
```

---

## 10. Add an RSS Feed

Create `src/app/blog/rss/route.ts`:

```typescript
import { getAllDocs } from "@/features/doc/data/documents"

const SITE_URL = "https://yoursite.com"
const SITE_NAME = "Your Site"

export const revalidate = false
export const dynamic = "force-static"

export function GET() {
  const allPosts = getAllDocs()

  const itemsXml = allPosts
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${SITE_URL}/blog/${post.slug}</link>
          <description>${post.metadata.description || ""}</description>
          <pubDate>${new Date(post.metadata.createdAt).toISOString()}</pubDate>
        </item>`
    )
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Blog | ${SITE_NAME}</title>
      <link>${SITE_URL}</link>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: { "Content-Type": "text/xml" },
  })
}
```

---

## 11. Category Filtering (Optional)

The same document system supports multiple content types via the `category` frontmatter field. For example, to create a separate "Components" section:

```mdx
---
title: My Component
description: A reusable UI component.
category: components
createdAt: 2025-03-08
updatedAt: 2025-03-08
---
```

Then filter in your page:

```typescript
const components = getDocsByCategory("components")
```

This lets you reuse the same content pipeline for blog posts, component docs, tutorials, etc.

---

## Architecture Summary

```
src/
├── features/doc/
│   ├── content/           # MDX files (the actual posts)
│   │   ├── welcome.mdx
│   │   └── my-post.mdx
│   ├── data/
│   │   └── documents.ts   # Filesystem reader + cache + sorting
│   └── types/
│       └── document.ts    # TypeScript types
├── features/blog/
│   ├── components/
│   │   ├── post-list.tsx
│   │   ├── post-item.tsx
│   │   ├── post-list-with-search.tsx
│   │   └── post-search-input.tsx
│   └── hooks/
│       ├── use-search-query.ts
│       └── use-filtered-posts.ts
├── components/
│   └── mdx.tsx             # MDX renderer with plugins
└── app/
    └── blog/
        ├── page.tsx        # Blog listing
        ├── [slug]/
        │   └── page.tsx    # Blog post (statically generated)
        └── rss/
            └── route.ts    # RSS feed
```

### How data flows

1. **Build time**: `generateStaticParams()` reads all `.mdx` files → generates static pages for each slug.
2. **Listing page**: `getAllDocs()` reads files, parses frontmatter with `gray-matter`, sorts by date → passed to client components as props.
3. **Search**: All posts are passed to a client component. `nuqs` syncs the search query with the URL. Posts are filtered client-side by title/description match.
4. **Post page**: `getDocBySlug()` finds the post → MDX content is rendered server-side by `next-mdx-remote/rsc` with remark/rehype plugins → output is static HTML with syntax highlighting, linked headings, etc.
5. **RSS**: A route handler generates XML from the same `getAllDocs()` function.

### Key patterns

- **No database** — content lives in the repo as `.mdx` files.
- **No client JS for content** — MDX renders as RSC; only search is a client component.
- **URL-driven search** — shareable, bookmarkable search via `nuqs`.
- **`React.cache()`** — deduplicates file reads within a render pass.
- **Fully static** — `force-static` + `dynamicParams = false` for optimal performance.
- **SEO built-in** — JSON-LD structured data, Open Graph metadata, RSS feed.
