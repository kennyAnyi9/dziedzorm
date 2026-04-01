"use client";
import Link from "next/link";
import { useSound } from "@/hooks/use-sound";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { uChatScrollButtonSound } from "@/lib/u-chat-scroll-button";

export function Links() {
  const [play] = useSound(uChatScrollButtonSound);

  return (
    <div className="w-full flex flex-col gap-5 mt-20">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group inline-flex justify-between text-neutral-400 w-full relative after:absolute after:bottom-0 after:left-0 after:h-[0.25px] after:w-0 after:bg-[oklch(62.7%_0.265_303.9)] after:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] after:transition-all after:duration-300 hover:after:w-full"
          onMouseEnter={() => play()}
        >
          <span>{link.text}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {link.external ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}

type Link = {
  href: string;
  text: string;
  external?: boolean;
};

const LINKS: Link[] = [
  {
    href: "https://better-ascii.dziedzorm.xyz",
    text: "better-ascii",
    external: true,
  },
  {
    href: "https://dup.it.com",
    text: "dup.it",
    external: true,
  },
  {
    href: "https://mindops.dziedzorm.xyz",
    text: "mindOps",
    external: true,
  },
  {
    href: "/craft",
    text: "craft",
    external: false,
  },
  {
    href: "/journal",
    text: "journal",
    external: false,
  },
  {
    href: "/merch",
    text: "merch",
    external: false,
  },
];
