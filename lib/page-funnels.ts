// Páginas de venta (además de las landings por persona) cuyo embudo se mide con
// PageFunnelTracker + LeadForm y aparece en la pestaña "Landings" del admin.
// La clave es el `landingKey` que usan esas páginas.
export const PAGE_FUNNELS: Record<string, { name: string; slug: string }> = {
  home: { name: "Home (página principal)", slug: "" },
  diseno_web: { name: "Diseño web (servicio)", slug: "diseno-paginas-web" },
  publicidad: { name: "Publicidad (servicio)", slug: "publicidad-ads" },
}
