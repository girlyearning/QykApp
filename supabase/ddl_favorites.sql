-- Favorites table
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('note','entry','confession','question')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.favorites enable row level security;

create policy "favorites-select-own" on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites-insert-own" on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites-delete-own" on public.favorites for delete
  using (auth.uid() = user_id);

-- Avoid duplicates per user/type/id
create unique index if not exists favorites_unique_user_item
on public.favorites (user_id, item_type, item_id);
