-- Create message_type enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
    CREATE TYPE public.message_type AS ENUM ('text', 'audio');
  END IF;
END$$;

-- Ensure app_role contains 'instructor'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');
  ELSE
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_enum e 
      JOIN pg_type t ON e.enumtypid = t.oid 
      WHERE t.typname = 'app_role' AND e.enumlabel = 'instructor'
    ) THEN
      ALTER TYPE public.app_role ADD VALUE 'instructor';
    END IF;
  END IF;
END$$;

-- Create course_messages table
CREATE TABLE IF NOT EXISTS public.course_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  lesson_id uuid,
  user_id uuid NOT NULL,
  content text,
  audio_url text,
  message_type public.message_type NOT NULL DEFAULT 'text',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present
DROP POLICY IF EXISTS "Students can insert text messages only" ON public.course_messages;
DROP POLICY IF EXISTS "Instructors can update messages" ON public.course_messages;
DROP POLICY IF EXISTS "Users can view course messages" ON public.course_messages;

-- View policy: enrolled students, course instructor, or admin
CREATE POLICY "Users can view course messages"
ON public.course_messages
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_messages.course_id AND c.instructor_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.course_enrollments ce
    WHERE ce.course_id = course_messages.course_id AND ce.user_id = auth.uid()
  )
);

-- Insert policy: students only text; instructors/admin any message type
CREATE POLICY "Students can insert text messages only" 
ON public.course_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (
    public.has_role(auth.uid(), 'instructor'::app_role) OR
    public.has_role(auth.uid(), 'admin'::app_role) OR
    (public.has_role(auth.uid(), 'student'::app_role) AND message_type = 'text')
  )
);

-- Update policy: instructors and admins only
CREATE POLICY "Instructors can update messages" 
ON public.course_messages 
FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'instructor'::app_role) OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger to update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_course_messages_updated_at'
  ) THEN
    CREATE TRIGGER update_course_messages_updated_at
    BEFORE UPDATE ON public.course_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;