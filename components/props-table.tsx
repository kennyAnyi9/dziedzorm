import type { PropDef } from "@/lib/craft/types";

export function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-950">
            <th className="text-left px-4 py-2.5 text-neutral-600 font-normal tracking-widest uppercase">Prop</th>
            <th className="text-left px-4 py-2.5 text-neutral-600 font-normal tracking-widest uppercase">Type</th>
            <th className="text-left px-4 py-2.5 text-neutral-600 font-normal tracking-widest uppercase hidden sm:table-cell">Default</th>
            <th className="text-left px-4 py-2.5 text-neutral-600 font-normal tracking-widest uppercase hidden md:table-cell">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, i) => (
            <tr
              key={prop.name}
              className={i < props.length - 1 ? "border-b border-neutral-800/60" : ""}
            >
              <td className="px-4 py-3 align-top whitespace-nowrap">
                <span className="text-[oklch(62.7%_0.265_303.9)]">{prop.name}</span>
                {prop.required && (
                  <span className="ml-1 text-red-500 text-[10px]">*</span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <span className="text-neutral-400 break-all">{prop.type}</span>
              </td>
              <td className="px-4 py-3 align-top whitespace-nowrap hidden sm:table-cell">
                <span className="text-neutral-600">{prop.default}</span>
              </td>
              <td className="px-4 py-3 align-top hidden md:table-cell">
                <span className="text-neutral-500 leading-relaxed">{prop.description}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
