import { highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/copy-button";

export async function CodeBlock({
  code,
  title,
  language = "tsx",
}: {
  code: string;
  title?: string;
  language?: string;
}) {
  const html = await highlight(code, language);

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-2">
          {title && <span className="text-xs text-neutral-500">{title}</span>}
          <span className="text-[10px] text-neutral-700 border border-neutral-800 rounded px-1.5 py-0.5">
            {language}
          </span>
        </div>
        <CopyButton text={code} />
      </div>
      {/* Highlighted code */}
      <div
        className="overflow-x-auto p-4 text-xs leading-relaxed bg-neutral-950 [&_.shiki]:text-xs [&_code]:text-xs [&_code]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
