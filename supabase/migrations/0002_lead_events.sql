-- ────────────────────────────────────────────────────────────────────────────
-- lead_events: registro de eventos de conversión con atribución (UTM / canal)
-- para el medidor de Insights (orgánico vs ads) y trazabilidad de campañas.
-- Solo se registran eventos significativos (Lead, Contact), no pageviews.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.lead_events (
  id            uuid primary key default gen_random_uuid(),
  event_name    text not null,                 -- Lead | Contact
  source_type   text not null,                 -- contact_form | chat_email | whatsapp
  channel       text not null default 'unknown', -- organic | paid | direct | referral | unknown
  email         text,
  name          text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,
  referrer      text,
  landing_page  text,
  page_url      text,
  fbclid        text,
  gclid         text,
  capi_status   text,                          -- sent | error | skipped
  created_at    timestamptz not null default now()
);

create index if not exists lead_events_created_at_idx on public.lead_events (created_at desc);
create index if not exists lead_events_channel_idx     on public.lead_events (channel);
create index if not exists lead_events_campaign_idx     on public.lead_events (utm_campaign);

-- RLS habilitado sin policies públicas: solo el service_role (servidor) accede.
alter table public.lead_events enable row level security;
