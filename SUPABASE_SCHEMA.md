# Runwise Supabase Schema Proposal (MVP)

## Schema Strategy

MVP uses two core tables:

- `recommendations`: canonical record of every generated recommendation (also serves as history).
- `saved_plans`: user-bookmarked recommendations.

No separate `recommendation_history` table is required in MVP because history is directly derived from `recommendations`.

## SQL Proposal

```sql
-- Required extension for UUID generation
create extension if not exists pgcrypto;

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  target_distance_km numeric(4,1) not null check (target_distance_km >= 1 and target_distance_km <= 30),
  available_time_min integer not null check (available_time_min >= 15 and available_time_min <= 180),
  preferred_intensity text not null check (preferred_intensity in ('easy', 'moderate', 'hard')),
  run_goal text not null check (run_goal in ('consistency', 'endurance', 'speed', 'recovery', 'stress_relief')),
  location_query text,

  weather_status text not null check (weather_status in ('ok', 'unavailable', 'skipped')),
  weather_temp_c numeric(4,1),
  weather_precip_mm numeric(5,2),
  weather_wind_kph numeric(5,1),
  weather_condition text,
  weather_observed_at timestamptz,

  recommendation_type text not null check (
    recommendation_type in (
      'easy_flow_run',
      'tempo_lite_session',
      'recovery_jog',
      'steady_endurance_run',
      'heat_adjusted_short_run',
      'weather_adjusted_easy_run'
    )
  ),
  recommendation_title text not null,
  recommendation_label text not null,
  recommendation_explanation text not null,
  weather_note text not null,

  suggested_distance_km numeric(4,1) not null check (suggested_distance_km >= 1 and suggested_distance_km <= 30),
  suggested_duration_min integer not null check (suggested_duration_min >= 10 and suggested_duration_min <= 180),
  recommended_intensity text not null check (recommended_intensity in ('easy', 'moderate', 'hard')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recommendation_id uuid not null references public.recommendations(id) on delete cascade,

  custom_name text,
  notes text,
  is_archived boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, recommendation_id)
);

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers
create trigger recommendations_set_updated_at
before update on public.recommendations
for each row execute function public.set_updated_at();

create trigger saved_plans_set_updated_at
before update on public.saved_plans
for each row execute function public.set_updated_at();

-- Indexes
create index if not exists recommendations_user_created_idx
  on public.recommendations (user_id, created_at desc);

create index if not exists recommendations_goal_idx
  on public.recommendations (user_id, run_goal, created_at desc);

create index if not exists saved_plans_user_created_idx
  on public.saved_plans (user_id, created_at desc)
  where is_archived = false;

create index if not exists saved_plans_recommendation_idx
  on public.saved_plans (recommendation_id);

-- Row-level security
alter table public.recommendations enable row level security;
alter table public.saved_plans enable row level security;

create policy "recommendations_select_own"
on public.recommendations for select
using (auth.uid() = user_id);

create policy "recommendations_insert_own"
on public.recommendations for insert
with check (auth.uid() = user_id);

create policy "recommendations_update_own"
on public.recommendations for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "saved_plans_select_own"
on public.saved_plans for select
using (auth.uid() = user_id);

create policy "saved_plans_insert_own"
on public.saved_plans for insert
with check (auth.uid() = user_id);

create policy "saved_plans_update_own"
on public.saved_plans for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "saved_plans_delete_own"
on public.saved_plans for delete
using (auth.uid() = user_id);
```

## Relationships

- `saved_plans.recommendation_id -> recommendations.id`
- Ownership guard: both tables keyed by `user_id`

## Practical MVP Simplifications

- History is read directly from `recommendations`.
- No separate profile table required.
- No denormalized analytics table required for MVP stats.

## Optional Alternative (If No Auth in MVP)

If anonymous auth is intentionally skipped, replace `user_id` with `device_id` (`text`) and relax RLS. This is acceptable only for demo environments and should be treated as temporary.
