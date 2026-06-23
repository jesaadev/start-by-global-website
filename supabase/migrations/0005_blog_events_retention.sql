-- Retención de blog_events: conservamos 180 días de datos de tracking.
-- Los agregados del panel usan ventanas de 7/30/90 días, así que 180 da
-- holgura sin dejar crecer la tabla sin tope.
create extension if not exists pg_cron;

-- Función de limpieza (SECURITY DEFINER para poder borrar desde el job).
create or replace function public.cleanup_blog_events()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.blog_events where created_at < now() - interval '180 days';
$$;

-- Programa la limpieza diaria a las 03:15 UTC. Desprogramamos primero cualquier
-- job con el mismo nombre para que reaplicar la migración sea idempotente y no
-- deje duplicados ejecutándose en paralelo.
select cron.unschedule(jobid) from cron.job where jobname = 'cleanup-blog-events';

select cron.schedule(
  'cleanup-blog-events',
  '15 3 * * *',
  $$select public.cleanup_blog_events();$$
);
