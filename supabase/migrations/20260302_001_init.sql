-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.basket_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  basket_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  purchase_price numeric,
  CONSTRAINT basket_items_pkey PRIMARY KEY (id),
  CONSTRAINT basket_items_basket_id_fkey FOREIGN KEY (basket_id) REFERENCES public.baskets(id),
  CONSTRAINT basket_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.baskets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'validated'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  validated_at timestamp with time zone,
  CONSTRAINT baskets_pkey PRIMARY KEY (id),
  CONSTRAINT baskets_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id),
  CONSTRAINT baskets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT baskets_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  name text NOT NULL,
  stock integer DEFAULT 0,
  purchase_price numeric DEFAULT 0,
  sale_price numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.store_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  user_id uuid NOT NULL,
  is_owner boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT store_users_pkey PRIMARY KEY (id),
  CONSTRAINT store_users_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id),
  CONSTRAINT store_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.stores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT stores_pkey PRIMARY KEY (id),
  CONSTRAINT stores_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);