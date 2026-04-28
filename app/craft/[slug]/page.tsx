import { notFound } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import type { Metadata } from "next";
import { getCraftComponent, CRAFT_COMPONENTS } from "@/lib/craft/components";
import { CommandBlock } from "@/components/command-block";
import { CodeBlock } from "@/components/code-block";
import { PropsTable } from "@/components/props-table";
import { FluidMapPreview } from "@/registry/default";
import { PreviewFrame } from "@/components/preview-frame";

export const dynamic = "force-static";

export function generateStaticParams() {
  return CRAFT_COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getCraftComponent(slug);
  if (!component) return {};
  return { title: component.title, description: component.description };
}

const PREVIEWS: Record<string, Record<string, React.ReactNode>> = {
  "fluid-map": {
    default: <FluidMapPreview />,
  },
};

export default async function CraftDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getCraftComponent(slug);
  if (!component) notFound();

  const slugPreviews = PREVIEWS[slug] ?? {};

  return (
    <main className="min-h-screen max-w-2xl mx-auto w-full px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-neutral-200 text-lg">{component.title}</h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          {component.description}
        </p>
        <BackButton href="/craft" label="craft" className="mt-4" />
      </div>

      {/* Live preview */}
      <section className="mb-10">
        <PreviewFrame>{slugPreviews["default"] ?? null}</PreviewFrame>
      </section>

      {/* Install */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-neutral-600 uppercase tracking-widest">
            Install
          </p>
          <Link
            href={`https://v0.dev/chat/api/open?url=https://dziedzorm.xyz/r/${slug}.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 border border-neutral-800 rounded-md px-2.5 py-1 hover:text-neutral-200 hover:border-[oklch(62.7%_0.265_303.9)] hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] transition-all duration-300"
          >
            {/* v0 logo */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 40 20"
              fill="currentColor"
              aria-hidden
            >
              <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V13.0053C39.9136 16.8684 36.7819 20 32.9188 20H23.3919L23.3919 0Z" />
              <path d="M0 0H9.52699L19.0539 20H9.52699L0 0Z" />
              <path
                d="M19.0539 0H9.52699L0 20H9.52699L19.0539 0Z"
                opacity="0.5"
              />
            </svg>
            Open in v0
          </Link>
        </div>
        <CommandBlock
          registryUrl={`https://dziedzorm.xyz/r/${component.slug}.json`}
        />
      </section>

      {/* Usage */}
      <section className="mb-10">
        <p className="text-xs text-neutral-600 mb-3 uppercase tracking-widest">
          Usage
        </p>
        <div className="flex flex-col gap-4">
          {component.examples.map((example) => (
            <CodeBlock
              key={example.title}
              title={example.title}
              language={example.language}
              code={example.code}
            />
          ))}
        </div>
      </section>

      {/* Props */}
      {component.props && component.props.length > 0 && (
        <section>
          <p className="text-xs text-neutral-600 mb-3 uppercase tracking-widest">
            Props
          </p>
          <PropsTable props={component.props} />
        </section>
      )}
    </main>
  );
}
