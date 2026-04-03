import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
    name: "toyota-airbag-system-upgrade.vercel.app",
    href: "https://toyota-airbag-system-upgrade.vercel.app/",
  },
  { name: "sbautoconnect.com", href: "https://sbautoconnect.com" },
];

export default function ShippedPage() {
  return (
    <main className="min-h-screen max-w-lg mx-auto w-full flex flex-col justify-center px-4 sm:px-6 py-8">
      <h1 className="text-neutral-400 mb-2">Shipped</h1>
      <p className="text-sm text-neutral-600 mb-8">
        Work built and shipped for companies through freelance, internships, and
        volunteering.
      </p>
      <div className="flex flex-col gap-5">
        {SHIPPED.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group inline-flex justify-between text-neutral-400 w-full relative after:absolute after:bottom-0 after:left-0 after:h-[0.25px] after:w-0 after:bg-[oklch(62.7%_0.265_303.9)] after:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] after:transition-all after:duration-300 hover:after:w-full"
          >
            <span>{item.name}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
