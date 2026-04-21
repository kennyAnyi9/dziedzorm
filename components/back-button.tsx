import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackButton({
  href,
  label = "back",
  onClick,
  className = "",
}: {
  href?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  const styles = `inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-200 transition-colors ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        <ChevronLeft size={14} strokeWidth={1.5} />
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${styles} cursor-pointer`}>
      <ChevronLeft size={14} strokeWidth={1.5} />
      {label}
    </button>
  );
}
