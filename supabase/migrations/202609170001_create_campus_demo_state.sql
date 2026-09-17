create table if not exists public.campus_demo_state (
  bucket text primary key check (
    bucket in ('documents', 'complaints', 'passes', 'notifications', 'feedback', 'campusfind')
  ),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.campus_demo_state is
  'Server-managed persistence for the Yukti AI local demonstration.';

alter table public.campus_demo_state enable row level security;

-- The browser never talks to this table directly. Access is restricted to the
-- server-side Supabase secret key, which bypasses RLS.
revoke all on table public.campus_demo_state from anon, authenticated;
