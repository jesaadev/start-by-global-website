-- ────────────────────────────────────────────────────────────────────────────
-- landing_events: embudo de las landings por buyer persona. Registra cada paso
-- (view → scroll75 → lead / lead_magnet / contact) por landing, con atribución.
-- Solo session_id anónimo, sin PII. Alimenta la pestaña "Landings" del admin.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.landing_events (
  id           uuid primary key default gen_random_uuid(),
  landing      text not null,   -- clave de la landing (segment): landing_a…
  event_type   text not null,   -- view | scroll75 | lead | lead_magnet | contact
  session_id   text,
  path         text,
  channel      text,            -- organic | paid | direct | referral | unknown
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  created_at   timestamptz not null default now()
);

create index if not exists landing_events_landing_idx on public.landing_events (landing);
create index if not exists landing_events_type_idx    on public.landing_events (event_type);
create index if not exists landing_events_created_idx on public.landing_events (created_at desc);

alter table public.landing_events enable row level security;

-- Retención: 180 días (mismos criterios que blog_events).
create or replace function public.cleanup_landing_events()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.landing_events where created_at < now() - interval '180 days';
$$;

select cron.unschedule(jobid) from cron.job where jobname = 'cleanup-landing-events';

select cron.schedule(
  'cleanup-landing-events',
  '20 3 * * *',
  $$select public.cleanup_landing_events();$$
);
