-- ────────────────────────────────────────────────────────────────────────────
-- Medición: añade la variante A/B de navegación y el "camino" (segmento del
-- hero / origen del CTA) a cada evento de conversión, para comparar conversión
-- por variante y por avatar en el medidor de Atribución.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.lead_events
  add column if not exists nav_variant text,  -- 'a' (sidebar) | 'b' (top nav)
  add column if not exists segment     text;  -- p.ej. sin_presencia | web_no_genera | outsourcing | hero_cta | form | nav

create index if not exists lead_events_nav_variant_idx on public.lead_events (nav_variant);
create index if not exists lead_events_segment_idx      on public.lead_events (segment);
