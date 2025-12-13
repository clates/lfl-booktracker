-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create books table
CREATE TABLE public.books (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    location text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT books_code_key UNIQUE (code)
);

-- Create sightings table
CREATE TABLE public.sightings (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    book_id uuid NOT NULL,
    user_id uuid NOT NULL,
    location text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT sightings_pkey PRIMARY KEY (id),
    CONSTRAINT sightings_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books (id)
);

-- RLS Policies (Standard setup for Supabase)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.books FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.sightings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.sightings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grid Counters Table
CREATE TABLE public.grid_counters (
    prefix text NOT NULL,
    counter integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT grid_counters_pkey PRIMARY KEY (prefix)
);

ALTER TABLE public.grid_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.grid_counters FOR SELECT USING (true);
-- Note: Insert/Update is handled via RPC, security definer function recommended if we want to restrict direct table access, 
-- but for now we'll allow authenticated users to potentially read. 
-- Writing should be done via the function to ensure atomicity.

-- Atomic Increment Function
CREATE OR REPLACE FUNCTION public.increment_counter(prefix_in TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_value INTEGER;
BEGIN
    INSERT INTO public.grid_counters (prefix, counter)
    VALUES (prefix_in, 1)
    ON CONFLICT (prefix)
    DO UPDATE SET 
        counter = grid_counters.counter + 1,
        updated_at = now()
    RETURNING counter INTO new_value;
    
    RETURN new_value;
END;
$$;
