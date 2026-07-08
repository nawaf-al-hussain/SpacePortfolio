import { ImageResponse } from "next/og";
import { PROFILE, SITE_URL } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${PROFILE.name} — ${PROFILE.role}`;

const STACK = "React · Next.js · TypeScript · Laravel · Flutter · AI";
const DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

/**
 * Branded 1200×630 social card, rendered with next/og (Satori) at build time.
 * Shared by the Open Graph and Twitter image routes. Satori only supports
 * flexbox + a CSS subset, so every container is an explicit flex box.
 */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#02010a",
          backgroundImage:
            "radial-gradient(1100px 620px at 80% 12%, rgba(217,119,87,0.32), rgba(2,1,10,0) 58%), radial-gradient(820px 520px at 6% 96%, rgba(76,201,240,0.18), rgba(2,1,10,0) 55%)",
          color: "#eef2ff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 5,
            color: "#8ea3c8",
          }}
        >
          <div style={{ display: "flex" }}>PORTFOLIO</div>
          <div style={{ display: "flex" }}>SDE · FULL-STACK · AI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
            }}
          >
            {PROFILE.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 42,
              marginTop: 22,
              color: "#cbd5f5",
            }}
          >
            {PROFILE.role}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              marginTop: 26,
              color: "#8090b6",
            }}
          >
            {STACK}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#8ea3c8",
          }}
        >
          <div style={{ display: "flex" }}>{DOMAIN}</div>
          <div style={{ display: "flex" }}>{PROFILE.location}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
