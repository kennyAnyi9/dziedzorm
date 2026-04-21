"use client";

import { useRef, type ComponentProps } from "react";
import { CopyButton } from "@/components/copy-button";

export function CodePre(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);

  // Extract language from the inner <code> element's class (e.g. "language-tsx")
  const codeChild =
    props.children &&
    typeof props.children === "object" &&
    "props" in props.children
      ? (props.children as { props: { className?: string } })
      : null;
  const className = codeChild?.props?.className ?? "";
  const lang = className.replace(/language-/, "") || "";

  function getCode() {
    return ref.current?.textContent ?? "";
  }

  return (
    <div className="not-prose border border-neutral-800 rounded-lg overflow-hidden my-6">
      <div className="flex items-center justify-end px-4 py-2 border-b border-neutral-800 bg-neutral-950">
        <CopyButton textFn={getCode} />
      </div>
      <pre
        ref={ref}
        className={`overflow-x-auto p-4 text-xs leading-relaxed bg-neutral-950 [&_code]:text-xs [&_code]:leading-relaxed ${props.className ?? ""}`}
      >
        {props.children}
      </pre>
    </div>
  );
}
