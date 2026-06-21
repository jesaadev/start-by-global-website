import { ImageResponse } from "next/og"

// Imagen Open Graph por defecto (1200×630) generada dinámicamente, de marca.
// Se aplica a todo el sitio salvo que una ruta defina la suya o el admin fije
// una imagen OG personalizada.

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Start By Global — Diseño Web y Publicidad Digital"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, background: "#e0632b" }} />
          <div style={{ color: "#e2e8f0", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            Start By Global
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ color: "#ffffff", fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 940 }}>
            Webs y marketing que convierten visitantes en clientes
          </div>
          <div style={{ color: "#94a3b8", fontSize: 30 }}>
            Diseño web · Publicidad digital (Google &amp; Meta Ads) · SEO
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#64748b", fontSize: 26 }}>RD · España · LATAM · EE.UU.</div>
          <div
            style={{
              display: "flex",
              background: "#e0632b",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 12,
            }}
          >
            startbyglobal.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
