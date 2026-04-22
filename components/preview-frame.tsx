"use client";

import { useState } from "react";

const VIEWPORTS = [
  { id: "desktop", width: "100%", label: "Desktop", icon: DesktopIcon },
  { id: "tablet", width: "768px", label: "Tablet", icon: TabletIcon },
  { id: "mobile", width: "375px", label: "Mobile", icon: MobileIcon },
] as const;

type ViewportId = (typeof VIEWPORTS)[number]["id"];

export function PreviewFrame({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = useState<ViewportId>("desktop");
  const [fullscreen, setFullscreen] = useState(false);

  const activeWidth =
    VIEWPORTS.find((v) => v.id === viewport)?.width ?? "100%";

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            {VIEWPORTS.map((v) => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === v.id
                    ? "bg-neutral-800 text-neutral-200"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
                title={v.label}
              >
                <v.icon />
              </button>
            ))}
            <div className="w-px h-4 bg-neutral-800 mx-0.5" />
            <button
              onClick={() => setFullscreen(false)}
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-300 transition-colors"
              title="Exit fullscreen"
            >
              <CollapseIcon />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div
            className="h-full transition-[width] duration-300 ease-in-out"
            style={{ width: activeWidth, maxWidth: "100%" }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-neutral-600 uppercase tracking-widest">
          Preview
        </p>
        <div className="flex items-center gap-0.5 border border-neutral-800 rounded-md px-1 py-0.5">
          {VIEWPORTS.map((v) => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
              className={`p-1 rounded transition-colors ${
                viewport === v.id
                  ? "bg-neutral-800 text-neutral-200"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
              title={v.label}
            >
              <v.icon />
            </button>
          ))}
          <div className="w-px h-3.5 bg-neutral-800 mx-0.5" />
          <button
            onClick={() => setFullscreen(true)}
            className="p-1 rounded text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Fullscreen"
          >
            <ExpandIcon />
          </button>
        </div>
      </div>
      <div className="border border-neutral-800 rounded-xl bg-neutral-950 h-72 flex items-center justify-center px-4 overflow-hidden">
        <div
          className="h-full transition-[width] duration-300 ease-in-out mx-auto"
          style={{ width: activeWidth, maxWidth: "100%" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function DesktopIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14h6v6" />
      <path d="M20 10h-6V4" />
      <path d="M14 10l7-7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}
