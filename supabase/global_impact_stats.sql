-- Worldwide impact metrics for the Home page.
-- Run this once in the Supabase SQL editor of the project the app points at.
-- It exposes ONLY aggregate counts — never any individual row — so it is safe
-- for anonymous and authenticated readers even though RLS protects the tables.

create table if not exists public.packet_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  case_id uuid,
  created_at timestamptz not null default now()
);

grant insert on public.packet_downloads to authenticated;
grant all on public.packet_downloads to service_role;
alter table public.packet_downloads enable row level security;

drop policy if exists "Users log their own downloads" on public.packet_downloads;
create policy "Users log their own downloads"
on public.packet_downloads
for insert
to authenticated
with check (auth.uid() = user_id);

create or replace function public.global_impact_stats()
returns table (
  workers bigint,
  evidence_files bigint,
  timeline_events bigint,
  discrepancies_flagged bigint,
  packets_built bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(distinct user_id) from public.cases)                        as workers,
    (select count(*) from public.evidence)                                    as evidence_files,
    (select coalesce(sum(jsonb_array_length(
        coalesce(latest_analysis -> 'timeline_events', '[]'::jsonb))), 0)
       from public.cases
      where latest_analysis is not null)                                      as timeline_events,
    (select coalesce(sum(jsonb_array_length(
        coalesce(latest_analysis -> 'possible_discrepancies', '[]'::jsonb))), 0)
       from public.cases
      where latest_analysis is not null)                                      as discrepancies_flagged,
    (select count(*) from public.packet_downloads)                            as packets_built;
$$;

grant execute on function public.global_impact_stats() to anon, authenticated;
