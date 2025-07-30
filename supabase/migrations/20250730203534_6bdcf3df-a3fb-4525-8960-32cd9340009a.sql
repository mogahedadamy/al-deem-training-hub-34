-- Remove policies that depend on course_id
DROP POLICY IF EXISTS "Users can view lessons from enrolled courses" ON lessons;
DROP POLICY IF EXISTS "Instructors can insert lessons to their courses" ON lessons;

-- Fix course_id column type in course_enrollments table
ALTER TABLE public.course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_course_id_fkey;
ALTER TABLE public.course_enrollments ALTER COLUMN course_id TYPE TEXT;

-- Recreate the policies with updated types
CREATE POLICY "Users can view lessons from enrolled courses" 
ON lessons 
FOR SELECT 
USING (
  (EXISTS ( SELECT 1
   FROM course_enrollments
  WHERE ((course_enrollments.course_id = lessons.course_id) AND (course_enrollments.user_id = auth.uid())))) 
  OR (is_free = true) 
  OR has_role(auth.uid(), 'admin'::app_role) 
  OR (EXISTS ( SELECT 1
   FROM courses
  WHERE ((courses.id = lessons.course_id) AND (courses.instructor_id = auth.uid()))))
);

CREATE POLICY "Instructors can insert lessons to their courses" 
ON lessons 
FOR INSERT 
WITH CHECK (
  (EXISTS ( SELECT 1
   FROM courses
  WHERE ((courses.id = lessons.course_id) AND (courses.instructor_id = auth.uid())))) 
  OR has_role(auth.uid(), 'admin'::app_role)
);