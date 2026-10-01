-- ────────────────────────────────────────────────────────────────────────────
-- showcase_items: trabajo real mostrado en los mockups del sitio (webs de
-- clientes y creativos de anuncios). Las imágenes viven en el bucket público
-- "showcase" de Storage. Regla de dato real: nada se publica sin la
-- autorización del cliente (forzado también aquí con un CHECK).
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.showcase_items (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'web' check (kind in ('web', 'ad')),
  title         text not null,
  client_name   text,
  domain        text,             -- dominio mostrado en la barra del navegador
  persona       text,             -- clave de landing opcional (landing_a…)
  desktop_image text,             -- URL pública (captura de escritorio / creativo)
  mobile_image  text,             -- URL pública (captura móvil)
  authorized    boolean not null default false, -- permiso escrito del cliente
  published     boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint showcase_publish_requires_authorization check (not published or authorized)
);

create index if not exists showcase_items_public_idx
  on public.showcase_items (published, authorized, kind, sort_order);

alter table public.showcase_items enable row level security;
