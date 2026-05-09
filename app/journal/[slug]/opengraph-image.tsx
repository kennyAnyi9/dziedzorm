import { ImageResponse } from "next/og";
import { getDocBySlug } from "@/lib/journal/documents";
import fs from "fs";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  const title = doc?.metadata.title ?? "Journal";

  const font = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#171717",
          padding: "80px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            color: "#a855f7",
          }}
        >
          KENNEDY ANYIDOHO / JOURNAL
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          {title}
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#a855f7",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "JetBrains Mono", data: font, weight: 700 }],
    }
  );
}
