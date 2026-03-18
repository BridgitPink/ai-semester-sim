create extension if not exists pgcrypto;

create table if not exists public.game_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  save_version integer not null,
  save_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists game_saves_user_id_idx on public.game_saves(user_id);

create or replace function public.set_game_saves_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_game_saves_updated_at on public.game_saves;
create trigger trg_game_saves_updated_at
before update on public.game_saves
for each row
execute function public.set_game_saves_updated_at();

alter table public.game_saves enable row level security;

create policy "Users can read own save"
on public.game_saves
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own save"
on public.game_saves
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own save"
on public.game_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own save"
on public.game_saves
for delete
to authenticated
using (auth.uid() = user_id);
