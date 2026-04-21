import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { getAllDocs } from "@/lib/journal/documents";

export const metadata: Metadata = {
  title: "Journal",
  description: "Thoughts and notes.",
};

export default function JournalPage() {
  const posts = getAllDocs();

  return (
    <main className="min-h-screen max-w-3xl mx-auto w-full flex flex-col justify-center px-4 sm:px-6 py-8">
      <h1 className="text-neutral-400 mb-8">Journal</h1>
      <div className="flex flex-col gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="group inline-flex justify-between text-neutral-400 w-full relative after:absolute after:bottom-0 after:left-0 after:h-[0.25px] after:w-0 after:bg-[oklch(62.7%_0.265_303.9)] after:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] after:transition-all after:duration-300 hover:after:w-full"
          >
            <span>{post.metadata.title}</span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">
                {format(new Date(post.metadata.createdAt), "dd.MM.yyyy")}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={14} strokeWidth={1.5} />
              </span>
            </span>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-neutral-600">No entries yet.</p>
        )}
      </div>
    </main>
  );
}
