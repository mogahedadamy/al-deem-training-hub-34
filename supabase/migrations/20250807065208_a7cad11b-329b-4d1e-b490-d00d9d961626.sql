-- تحديث RLS policies للرسائل الصوتية - السماح للمدربين فقط بإرسالها
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.course_messages;
DROP POLICY IF EXISTS "Instructors can manage course messages" ON public.course_messages;

-- سياسة جديدة للإدراج: الطلاب يمكنهم إرسال رسائل نصية فقط، المدربين يمكنهم إرسال أي نوع
CREATE POLICY "Students can insert text messages only" 
ON public.course_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (
    -- إذا كان المستخدم مدرب، يمكنه إرسال أي نوع من الرسائل
    public.has_role(auth.uid(), 'instructor') OR
    public.has_role(auth.uid(), 'admin') OR
    -- إذا كان طالب، يمكنه إرسال رسائل نصية فقط
    (public.has_role(auth.uid(), 'student') AND message_type = 'text')
  )
);

-- سياسة التحديث: المدربين والإدارة فقط يمكنهم تعديل الرسائل
CREATE POLICY "Instructors can update messages" 
ON public.course_messages 
FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'instructor') OR 
  public.has_role(auth.uid(), 'admin')
);

-- إضافة دور مدرب إلى نظام الأدوار إذا لم يكن موجود
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');
  ELSE
    -- إضافة دور مدرب إذا لم يكن موجود
    BEGIN
      ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'instructor';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END$$;