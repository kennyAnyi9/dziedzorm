"use client";

import { Ascii, fonts } from "better-ascii";

export function KennedyAnyidoho() {
  return (
    <>
      <Ascii
        font={fonts.deltaCorpsPriest1}
        className="text-[4px] leading-[1.15] tracking-tight"
      >
        Ken
      </Ascii>
      <p className="mt-2 text-neutral-600">Builds interesting stuff</p>
    </>
  );
}
