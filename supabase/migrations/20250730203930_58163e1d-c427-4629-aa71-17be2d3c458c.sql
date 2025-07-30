-- Drop foreign key constraint and change verified_by to TEXT
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_verified_by_fkey;
ALTER TABLE public.payments ALTER COLUMN verified_by TYPE TEXT;