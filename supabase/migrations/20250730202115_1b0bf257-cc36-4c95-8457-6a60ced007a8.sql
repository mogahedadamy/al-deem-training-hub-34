-- Fix course_id column type in payments table
ALTER TABLE public.payments ALTER COLUMN course_id TYPE TEXT;