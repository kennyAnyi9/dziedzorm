"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sound-engine";
import { uChatScrollButtonSound } from "@/lib/u-chat-scroll-button";

export function NavigationSoundProvider() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Internal links only: starts with / and not a hash-only link
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      if (!isInternal) return;

      playSound(uChatScrollButtonSound.dataUri, { volume: 0.8 });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
