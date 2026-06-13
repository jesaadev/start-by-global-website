-- ────────────────────────────────────────────────────────────────────────────
-- site_settings: configuración global de SEO, datos de organización y pixels.
-- Tabla singleton (una sola fila con id = 'global') que contiene un JSONB.
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase (el mismo que
-- usa el sitio para conversations / sales_insights / prompt_overrides).
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.site_settings (
  id          text primary key default 'global',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Fila por defecto. Si ya existe, no se sobrescribe.
insert into public.site_settings (id, data)
values (
  'global',
  jsonb_build_object(
    'seo', jsonb_build_object(
      'siteName', 'Start By Global',
      'titleDefault', 'Start By Global | Soluciones Web & Marketing Digital',
      'titleTemplate', '%s | Start By Global',
      'description', 'Agencia de marketing digital con presencia en Rep. Dominicana, España, Latinoamérica y EE.UU. Soluciones web innovadoras para impulsar tu negocio.',
      'keywords', jsonb_build_array('marketing digital','desarrollo web','SEO','Rep. Dominicana','agencia digital'),
      'canonicalBase', 'https://startbyglobal.com',
      'defaultOgImage', '/logo-black.svg',
      'twitterHandle', '',
      'locale', 'es_DO',
      'indexable', true
    ),
    'organization', jsonb_build_object(
      'name', 'Start By Global',
      'legalName', 'Start By Global',
      'logo', '/logo-black.svg',
      'email', 'info@startbyglobal.com',
      'telephone', '+18493562247',
      'sameAs', jsonb_build_array('https://www.instagram.com/startbyglobal/'),
      'streetAddress', '',
      'city', 'Santo Domingo',
      'region', '',
      'postalCode', '',
      'country', 'DO'
    ),
    'pixels', jsonb_build_object(
      'ga4Id', '',
      'gtmId', '',
      'metaPixelId', '',
      'clarityId', '',
      'tiktokPixelId', '',
      'googleSiteVerification', ''
    )
  )
)
on conflict (id) do nothing;

-- RLS: solo el service_role (servidor) debe leer/escribir. El sitio accede con
-- la service key desde el backend, así que mantenemos RLS habilitado sin policies
-- públicas (el service_role bypassa RLS).
alter table public.site_settings enable row level security;
