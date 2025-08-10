-- Remove overly-permissive public SELECT on profiles and add restricted policies
-- 1) Drop existing public view policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view all profiles'
  ) THEN
    EXECUTE 'DROP POLICY "Users can view all profiles" ON public.profiles';
  END IF;
END $$;

-- 2) Create restricted SELECT policies
-- Allow users to view their own profile (and admin override)
CREATE POLICY "Users can view their own profile (restricted)"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role)
);

-- Allow users to view profiles of instructors for courses they are enrolled in (and admin override)
CREATE POLICY "Users can view their instructors' profiles"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1
    FROM public.courses c
    JOIN public.course_enrollments ce ON ce.course_id = c.id
    WHERE ce.user_id = auth.uid()
      AND c.instructor_id = profiles.id
  )
);
