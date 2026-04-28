import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Ascii, fonts } from "better-ascii";

export const metadata: Metadata = {
  title: "Shipped",
  description: "Work shipped during internships and volunteering.",
};

type ShippedItem = {
  name: string;
  href: string;
};

const SHIPPED: ShippedItem[] = [
  { name: "imhogen.com", href: "https://imhogen.com" },
  { name: "wislawedufund.com", href: "https://wislawedufund.com" },
  {
    name: "ncanvas.art",
    href: "https://ncanvas.art",
  },
  {
    name: "toyota-airbag-system-upgrade.vercel.app",
    href: "https://toyota-airbag-system-upgrade.vercel.app/",
  },
  { name: "sbautoconnect.com", href: "https://sbautoconnect.com" },
];

export default function ShippedPage() {
  return (
    <main className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Ascii
          font={fonts.deltaCorpsPriest1}
          className="text-[4px] leading-[1.15] tracking-tight whitespace-pre"
        >
          Shipped
        </Ascii>
        <p className="mt-2 text-sm text-neutral-600">
          Work built and shipped for companies through freelance, internships,
          and volunteering.
        </p>
        <BackButton href="/" className="mt-4" />
      </div>
      <div className="flex flex-col gap-5">
        {SHIPPED.map((item) => {
          const hostname = new URL(item.href).hostname;
          return (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex justify-between text-neutral-400 w-full"
            >
              <span className="inline-flex items-center gap-2.5">
                <span className="size-6 rounded-md border border-neutral-700 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[oklch(62.7%_0.265_303.9)] group-hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                    alt=""
                    width={14}
                    height={14}
                  />
                </span>
                {item.name}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
