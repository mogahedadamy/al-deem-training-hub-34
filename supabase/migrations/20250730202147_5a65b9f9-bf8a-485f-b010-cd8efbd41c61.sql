-- Remove foreign key constraint and change course_id to TEXT
ALTER TABLE public.payments DROP CONSTRAINT payments_course_id_fkey;
ALTER TABLE public.payments ALTER COLUMN course_id TYPE TEXT;