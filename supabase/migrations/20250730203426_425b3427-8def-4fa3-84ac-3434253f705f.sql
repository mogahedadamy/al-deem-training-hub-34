-- Fix course_id column type in course_enrollments table to match courses data
-- First remove foreign key constraint
ALTER TABLE public.course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_course_id_fkey;

-- Change course_id column type to TEXT
ALTER TABLE public.course_enrollments ALTER COLUMN course_id TYPE TEXT;