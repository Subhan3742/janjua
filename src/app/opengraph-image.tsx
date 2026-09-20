import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — Premium Curtains & Blinds in UAE`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, rendered at build time in the brand palette. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#080808",
          color: "#f7f3ea",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: "1px solid rgba(201,154,61,0.35)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#c99a3d",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 56, height: 1, background: "#c99a3d" }} />
          UAE · Curtains &amp; Blinds
        </div>

        <div style={{ display: "flex", fontSize: 82, lineHeight: 1.05, marginTop: 34 }}>
          Janjua Curtain House
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#e4c477", marginTop: 26 }}>
          Style · Comfort · Elegance
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(247,243,234,0.6)",
            marginTop: 40,
            maxWidth: 820,
            lineHeight: 1.5,
          }}
        >
          Custom curtains and blinds designed, stitched and professionally fitted.
        </div>
      </div>
    ),
    size,
  );
}
