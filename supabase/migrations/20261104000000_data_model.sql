-- Bar Hop SF: data model (PLAN.md section 3)
--
-- Users come from Supabase Auth (auth.users: id, email, created_at), so there
-- is no separate users table here. Every sign-up is automatically a row there.
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.

-- ---------------------------------------------------------------------------
-- neighborhoods: shared, pre-filled list of SF neighborhoods
-- ---------------------------------------------------------------------------
create table public.neighborhoods (
  id bigint generated always as identity primary key,
  name text not null unique
);

-- ---------------------------------------------------------------------------
-- bars: each user's own bar entries
-- ---------------------------------------------------------------------------
create table public.bars (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  neighborhood_id bigint not null references public.neighborhoods (id),
  name text not null check (length(trim(name)) > 0),
  type text not null check (type in ('Sports', 'Dive', 'Wine', 'Cocktail', 'Brewery', 'Other')),
  visit_status text not null check (visit_status in ('visited', 'want_to_try')),
  rating smallint check (rating between 1 and 5),
  would_return boolean,
  has_outdoor_seating boolean not null default false,
  vibe text,
  good_for text[] not null default '{}'
    check (good_for <@ array['sunny', 'sports', 'big groups', 'food']),
  notes text,
  created_at timestamptz not null default now(),

  -- A visited bar needs a rating and a would-return answer.
  constraint visited_needs_rating check (
    visit_status = 'want_to_try' or (rating is not null and would_return is not null)
  )
);

create index bars_user_id_idx on public.bars (user_id);
create index bars_neighborhood_id_idx on public.bars (neighborhood_id);

-- ---------------------------------------------------------------------------
-- stars: which bars a user has starred (many-to-many between users and bars)
-- ---------------------------------------------------------------------------
create table public.stars (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  bar_id bigint not null references public.bars (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, bar_id)
);

create index stars_bar_id_idx on public.stars (bar_id);

-- ---------------------------------------------------------------------------
-- Row-level security: each user only sees and changes their own rows
-- ---------------------------------------------------------------------------
alter table public.neighborhoods enable row level security;
alter table public.bars enable row level security;
alter table public.stars enable row level security;

create policy "Anyone can read neighborhoods"
  on public.neighborhoods for select
  to anon, authenticated
  using (true);

create policy "Users can read their own bars"
  on public.bars for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own bars"
  on public.bars for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can edit their own bars"
  on public.bars for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own bars"
  on public.bars for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own stars"
  on public.stars for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Users can only star bars they own.
create policy "Users can star their own bars"
  on public.stars for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.bars
      where bars.id = bar_id and bars.user_id = (select auth.uid())
    )
  );

create policy "Users can unstar their own bars"
  on public.stars for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Table access for the Data API. "Automatically expose new tables" is off in
-- this project, so access is granted here on purpose. Logged-out visitors
-- (anon) can only read neighborhoods.
-- ---------------------------------------------------------------------------
grant select on public.neighborhoods to anon, authenticated;
grant select, insert, update, delete on public.bars to authenticated;
grant select, insert, delete on public.stars to authenticated;

-- ---------------------------------------------------------------------------
-- Pre-filled neighborhoods
-- ---------------------------------------------------------------------------
insert into public.neighborhoods (name) values
  ('Bayview'),
  ('Bernal Heights'),
  ('Castro'),
  ('Chinatown'),
  ('Cow Hollow'),
  ('Dogpatch'),
  ('Embarcadero'),
  ('Excelsior'),
  ('Financial District'),
  ('Glen Park'),
  ('Haight-Ashbury'),
  ('Hayes Valley'),
  ('Inner Richmond'),
  ('Inner Sunset'),
  ('Japantown'),
  ('Lower Haight'),
  ('Marina'),
  ('Mission'),
  ('Nob Hill'),
  ('Noe Valley'),
  ('NoPa'),
  ('North Beach'),
  ('Outer Richmond'),
  ('Outer Sunset'),
  ('Pacific Heights'),
  ('Polk Gulch'),
  ('Potrero Hill'),
  ('Russian Hill'),
  ('SoMa'),
  ('Tenderloin'),
  ('Union Square'),
  ('Other');
