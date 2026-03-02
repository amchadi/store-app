-- 20260302_001_init.sql
-- But: Initialisation du schéma (tables de base)

-- 1) Extensions (UUID)
create extension if not exists "pgcrypto";

-- 2) Stores
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- 3) Store users (link user <-> store)
create table if not exists public.store_users (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (store_id, user_id)
);

-- 4) Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  sale_price numeric not null default 0,
  purchase_price numeric not null default 0,
  stock int not null default 0,
  created_at timestamptz not null default now()
);

-- 5) Baskets
create table if not exists public.baskets (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'draft', -- draft | validated | canceled
  created_at timestamptz not null default now(),
  validated_at timestamptz
);

-- 6) Basket items
create table if not exists public.basket_items (
  id uuid primary key default gen_random_uuid(),
  basket_id uuid not null references public.baskets(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity int not null default 1,
  sale_price numeric not null default 0,
  purchase_price numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (basket_id, product_id)
);

-- 7) Enable RLS (policies غادي نديروهم ف migration رقم 002)
alter table public.stores enable row level security;
alter table public.store_users enable row level security;
alter table public.products enable row level security;
alter table public.baskets enable row level security;
alter table public.basket_items enable row level security;

-- 8) Indexes (باش performance يكون مزيان)
create index if not exists idx_products_store_id on public.products(store_id);
create index if not exists idx_baskets_store_status on public.baskets(store_id, status);
create index if not exists idx_basket_items_basket_id on public.basket_items(basket_id);