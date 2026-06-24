-- ────────────────────────────────────────────────────────────────────────────
-- blog_posts: artículos del blog/insights como fuente de verdad en BD.
-- Permite que rutinas/API obtengan y modifiquen contenido en caliente, con
-- flujo borrador → aprobación → publicado. Solo acceso service-role (RLS sin
-- policies). El render usa ISR + revalidación on-demand.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists moddatetime schema extensions;

create table if not exists public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  excerpt           text not null default '',
  author            text not null default 'Start By Global',
  author_role       text not null default '',
  category          text not null default '',
  image             text not null default '',
  read_time         text not null default '',
  date_iso          date,
  last_modified_iso date,
  keywords          text[] not null default '{}',
  primary_keyword   text,
  content           text not null default '',
  status            text not null default 'draft'  check (status in ('draft','published','archived')),
  origin            text not null default 'manual' check (origin in ('manual','ai_generated','ai_improved')),
  improves_post_id  uuid references public.blog_posts(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  published_at      timestamptz
);

create index if not exists blog_posts_status_idx   on public.blog_posts (status);
create index if not exists blog_posts_category_idx  on public.blog_posts (category);
create index if not exists blog_posts_pkw_idx       on public.blog_posts (primary_keyword);

alter table public.blog_posts enable row level security;

-- updated_at automático en cada UPDATE.
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute procedure extensions.moddatetime (updated_at);
