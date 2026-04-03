"use client";

import { useDarkMode } from "@/hooks/use-dark-mode";

export function DarkModeToggle() {
  useDarkMode();
  return null;
}
