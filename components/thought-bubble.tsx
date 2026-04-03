"use client";

export function ThoughtBubble({ text }: { text: string }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 pointer-events-none opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
      <div className="liquid-glass rounded-2xl px-3 py-2 shadow-lg">
        <span className="liquid-glass-item rounded-2xl absolute inset-0" />
        <span className="relative z-[1] text-xs text-white/90 whitespace-nowrap">
          {text}
        </span>
      </div>

      {/* Three shrinking circles forming the thought trail */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 size-2.5 rounded-full liquid-glass">
        <span className="liquid-glass-item rounded-full absolute inset-0" />
      </div>
      <div className="absolute left-1/2 -translate-x-1 -bottom-5.5 size-1.5 rounded-full liquid-glass">
        <span className="liquid-glass-item rounded-full absolute inset-0" />
      </div>
      <div className="absolute left-1/2 -translate-x-0.5 -bottom-7.5 size-1 rounded-full liquid-glass">
        <span className="liquid-glass-item rounded-full absolute inset-0" />
      </div>
    </div>
  );
}
