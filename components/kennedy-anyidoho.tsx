"use client";

import { Ascii, fonts } from "better-ascii";

export function KennedyAnyidoho() {
  return (
    <>
      <Ascii
        font={fonts.deltaCorpsPriest1}
        className="text-[4px] leading-[1.15] text-center tracking-tight whitespace-pre"
      >
        Kennedy Anyidoho
      </Ascii>
      <p className="mt-5 max-w-lg text-neutral-600 text-center">
        Hey there! I am a software engineer. I specialize in translating complex
        ideas into functional, scalable, maintainable, reliable, elegant code.
      </p>
    </>
  );
}
