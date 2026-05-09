import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#171717",
          padding: "80px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            KENNEDY ANYIDOHO
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 28,
              color: "#a855f7",
            }}
          >
            Software Engineer
          </span>
        </div>
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
