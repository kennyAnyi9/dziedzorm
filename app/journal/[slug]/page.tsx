import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDX } from "@/components/mdx";
import {
  findNeighbour,
  getAllDocs,
  getDocBySlug,
} from "@/lib/journal/documents";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const doc = getDocBySlug(slug);
  if (!doc) return notFound();

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
  };
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const allDocs = getAllDocs();
  const { previous, next } = findNeighbour(allDocs, slug);

  return (
    <main className="min-h-screen max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
      <article className="prose prose-invert prose-neutral max-w-none">
        <h1>{doc.metadata.title}</h1>
        <p className="text-muted-foreground">{doc.metadata.description}</p>
        <p className="text-sm text-neutral-500 font-mono not-prose -mt-2 mb-6">
          {new Date(doc.metadata.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          {doc.metadata.updatedAt !== doc.metadata.createdAt && (
            <span className="ml-3 text-neutral-600">
              updated {new Date(doc.metadata.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </p>
        <MDX code={doc.content} />
      </article>

      <nav className="flex justify-between mt-12 text-neutral-400 text-sm">
        {previous ? (
          <Link href={`/journal/${previous.slug}`}>
            &larr; {previous.metadata.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/journal/${next.slug}`}>
            {next.metadata.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
