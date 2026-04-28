"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Hammer,
  BookOpen,
  ShoppingBag,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { ThoughtBubble } from "@/components/thought-bubble";
import { playSound } from "@/lib/sound-engine";
import { uChatScrollButtonSound } from "@/lib/u-chat-scroll-button";

export function MapLinksOverlay({
  onJournalClick,
}: {
  onJournalClick?: () => void;
}) {
  return (
    <>
      {MAP_LINKS.map((link) => {
        const isJournal = link.id === "journal";
        const commonClass =
          "group absolute inline-flex items-center gap-1.5 text-base text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer";
        const commonStyle = { left: link.x, top: link.y };

        if (isJournal && onJournalClick) {
          return (
            <button
              key={link.href}
              onClick={() => {
                playSound(uChatScrollButtonSound.dataUri, { volume: 0.8 });
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

export function MapLinksMobile({
  onJournalClick,
}: {
  onJournalClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {MAP_LINKS.map((link) => {
        const isJournal = link.id === "journal";
        const commonClass =
          "group inline-flex items-center gap-2.5 text-sm text-neutral-400 hover:text-neutral-200 active:text-neutral-200 transition-colors cursor-pointer";

        const content = (
          <>
            {link.icon && (
              <span className="size-6 rounded-md border border-neutral-700 flex items-center justify-center transition-all duration-300 group-hover:border-[oklch(62.7%_0.265_303.9)] group-hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)]">
                <link.icon size={12} strokeWidth={1} />
              </span>
            )}
            <span>{link.text}</span>
            {link.external && <ArrowUpRight size={12} />}
          </>
        );

        if (isJournal && onJournalClick) {
          return (
            <button key={link.href} onClick={onJournalClick} className={commonClass}>
              {content}
            </button>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={commonClass}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}

const MAP_LINKS: MapLink[] = [
  {
    href: "https://better-ascii.dziedzorm.xyz",
    text: "better-ascii",
    description: "ASCII art library for react",
    external: true,
    x: "5%",
    y: "20%",
  },
  {
    href: "https://dup.it.com",
    text: "dup.it",
    description:
      "Share text and code snippets securely. You control everything!",
    external: true,
    x: "18%",
    y: "55%",
  },
  {
    href: "https://mindops.dziedzorm.xyz",
    text: "mindOps",
    description: "AI powered task management tool",
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
