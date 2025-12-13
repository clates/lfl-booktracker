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
