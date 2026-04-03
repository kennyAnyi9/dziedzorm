"use client";

import Link from "next/link";
import { useSound } from "@/hooks/use-sound";
import {
  ArrowUpRight,
  Hammer,
  BookOpen,
  ShoppingBag,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { uChatScrollButtonSound } from "@/lib/u-chat-scroll-button";
import { ThoughtBubble } from "@/components/thought-bubble";

export function MapLinksOverlay({
  onJournalClick,
}: {
  onJournalClick?: () => void;
}) {
  const [play] = useSound(uChatScrollButtonSound);

  return (
    <>
      {MAP_LINKS.map((link) => {
        const isJournal = link.id === "journal";
        const commonClass =
          "group absolute inline-flex items-center gap-1.5 text-base text-neutral-400 hover:text-neutral-200 transition-colors";
        const commonStyle = { left: link.x, top: link.y };

        if (isJournal && onJournalClick) {
          return (
            <button
              key={link.href}
              onClick={() => {
                play();
                onJournalClick();
              }}
              className={commonClass}
              style={commonStyle}
            >
              <ThoughtBubble text={link.description} />
              {link.icon ? (
                <span className="size-6 rounded-md border border-neutral-700 flex items-center justify-center transition-all duration-300 group-hover:border-[oklch(62.7%_0.265_303.9)] group-hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)]">
                  <link.icon size={12} strokeWidth={1} />
                </span>
              ) : null}
              <span>{link.text}</span>
            </button>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={commonClass}
            style={commonStyle}
            onMouseEnter={() => play()}
          >
            <ThoughtBubble text={link.description} />
            {link.icon ? (
              <span className="size-6 rounded-md border border-neutral-700 flex items-center justify-center transition-all duration-300 group-hover:border-[oklch(62.7%_0.265_303.9)] group-hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)]">
                <link.icon size={12} strokeWidth={1} />
              </span>
            ) : null}
            <span>{link.text}</span>
            {link.external && <ArrowUpRight size={12} />}
          </Link>
        );
      })}
    </>
  );
}

type MapLink = {
  href: string;
  text: string;
  description: string;
  external?: boolean;
  icon?: LucideIcon;
  x: string;
  y: string;
  id?: string;
};

const MAP_LINKS: MapLink[] = [
  {
    href: "https://better-ascii.dziedzorm.xyz",
    text: "better-ascii",
    description: "ASCII art generator for the web",
    external: true,
    x: "5%",
    y: "20%",
  },
  {
    href: "https://dup.it.com",
    text: "dup.it",
    description: "Duplicate anything, instantly",
    external: true,
    x: "18%",
    y: "55%",
  },
  {
    href: "https://mindops.dziedzorm.xyz",
    text: "mindOps",
    description: "Mental models for developers",
    external: true,
    x: "42%",
    y: "18%",
  },
  {
    href: "/craft",
    text: "craft",
    description: "Things I'm tinkering with",
    icon: Hammer,
    external: false,
    x: "75%",
    y: "18%",
  },
  {
    id: "journal",
    href: "/journal",
    text: "journal",
    description: "Thoughts and technical notes",
    icon: BookOpen,
    external: false,
    x: "55%",
    y: "50%",
  },
  {
    href: "/merch",
    text: "merch",
    description: "Wearable stuff coming soon",
    icon: ShoppingBag,
    external: false,
    x: "78%",
    y: "75%",
  },
  {
    href: "/shipped",
    text: "shipped",
    description: "Work done for real companies",
    icon: Rocket,
    external: false,
    x: "25%",
    y: "80%",
  },
];
