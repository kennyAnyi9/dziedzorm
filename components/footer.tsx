import Link from "next/link";
import { Github, Linkedin, Twitter, FileText } from "lucide-react";

const SOCIAL_LINKS = [
  {
    href: "https://github.com/kennyAnyi9",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://linkedin.com/in/kennyAnyi9",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://x.com/kennyAnyi9",
    label: "X",
    icon: Twitter,
  },
];

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-4 py-6">
      {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="size-7 rounded-md border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-200 hover:border-[oklch(62.7%_0.265_303.9)] hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] transition-all duration-300"
        >
          <Icon size={13} strokeWidth={1.5} />
        </Link>
      ))}

      <Link
        href="https://ishortn.ink/ken_resume"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-200 border border-neutral-700 hover:border-[oklch(62.7%_0.265_303.9)] hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] rounded-md px-2.5 py-1 transition-all duration-300"
      >
        <FileText size={12} strokeWidth={1.5} />
        resume
      </Link>
    </footer>
  );
}
