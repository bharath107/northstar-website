-- =============================================================
-- Northstar: free consultation requests table
-- Run ONCE in Supabase: SQL Editor > New query > paste > Run
-- =============================================================

create table if not exists public.consultation_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  full_name           text not null check (char_length(full_name) between 2 and 120),
  email               text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  whatsapp            text not null check (char_length(whatsapp) between 7 and 30),
  country             text not null check (char_length(country) between 2 and 60),
  professional_status text not null check (professional_status in
                        ('MBBS student','Intern','MBBS graduate','PG resident','Specialist doctor','Other')),
  qualification       text not null check (qualification in
                        ('MBBS','MD or MS','DNB','BDS','Nursing or allied health','Other')),
  start_timeline      text not null check (start_timeline in
                        ('Immediately','Within 3 months','In 3 to 6 months','In 6 to 12 months','Just researching')),
  preferred_time      text not null check (preferred_time in
                        ('Morning, 9 am to 12 pm','Afternoon, 12 pm to 5 pm','Evening, 5 pm to 9 pm','Any time')),
  topic               text not null check (char_length(topic) between 3 and 1000),
  heard_from          text not null check (char_length(heard_from) between 2 and 120),
  wants_updates       boolean not null default false,
  consent             boolean not null check (consent = true),     -- no consent, no row
  status              text not null default 'new'                   -- you update this: new, contacted, called, enrolled
);

-- Row Level Security: with RLS on and no policy, nobody can read or write through the public API
alter table public.consultation_requests enable row level security;

-- Visitors may only INSERT, and only with consent
drop policy if exists "Public can request a consultation" on public.consultation_requests;
create policy "Public can request a consultation"
  on public.consultation_requests
  for insert
  to anon
  with check (consent = true and status = 'new');

-- Visitors can never read, update or delete
revoke all on public.consultation_requests from anon, authenticated;
grant insert on public.consultation_requests to anon;

-- Optional clean up: the old test table from the first version of the site
-- drop table if exists public.applications;
-- drop table if exists public.webinar_registrations;
