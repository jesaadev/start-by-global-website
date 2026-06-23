-- ────────────────────────────────────────────────────────────────────────────
-- blog_events: tracking orgánico de artículos (views, scroll, tiempo, CTAs,
-- compartir, lectura completa) con atribución. Solo session_id anónimo, sin PII.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.blog_events (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  event_type   text not null,   -- view | scroll | engaged | cta_click | share | read_complete
  value        int,             -- % de scroll, segundos de lectura, etc.
  target       text,            -- destino del CTA o red social al compartir
  session_id   text,
  channel      text,            -- organic | paid | direct | referral | unknown
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  referrer     text,
  created_at   timestamptz not null default now()
);

create index if not exists blog_events_slug_idx    on public.blog_events (slug);
create index if not exists blog_events_type_idx    on public.blog_events (event_type);
create index if not exists blog_events_created_idx on public.blog_events (created_at desc);

alter table public.blog_events enable row level security;

-- Atribución de conversiones al artículo de origen.
alter table public.lead_events add column if not exists source_article text;
