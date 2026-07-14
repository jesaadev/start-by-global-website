-- i18n: idioma de los artículos del blog y mercado de los leads.
-- 'es' por defecto → todo lo existente conserva su comportamiento.

alter table public.blog_posts add column if not exists locale text not null default 'es'
  check (locale in ('es', 'en'));
create index if not exists blog_posts_locale_status_idx on public.blog_posts (locale, status);

alter table public.lead_events add column if not exists locale text default 'es';
