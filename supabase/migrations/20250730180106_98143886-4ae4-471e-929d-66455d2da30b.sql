-- إنشاء buckets للتخزين
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-thumbnails', 'course-thumbnails', true),
  ('lesson-videos', 'lesson-videos', false),
  ('course-materials', 'course-materials', false);

-- سياسات التخزين للصور المصغرة للدورات (عامة)
CREATE POLICY "Anyone can view course thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Instructors can upload course thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-thumbnails' AND 
    (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'))
  );

-- سياسات التخزين لفيديوهات الدروس (خاصة)
CREATE POLICY "Enrolled users can view lesson videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lesson-videos' AND (
      public.has_role(auth.uid(), 'admin') OR
      public.has_role(auth.uid(), 'instructor') OR
      EXISTS (
        SELECT 1 FROM public.course_enrollments ce
        JOIN public.lessons l ON l.course_id = ce.course_id
        WHERE ce.user_id = auth.uid() 
        AND l.video_url LIKE '%' || name || '%'
      )
    )
  );

CREATE POLICY "Instructors can upload lesson videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lesson-videos' AND 
    (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'))
  );

-- سياسات التخزين لمواد الدورات
CREATE POLICY "Enrolled users can view course materials" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'course-materials' AND (
      public.has_role(auth.uid(), 'admin') OR
      public.has_role(auth.uid(), 'instructor') OR
      EXISTS (
        SELECT 1 FROM public.course_enrollments ce
        WHERE ce.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Instructors can upload course materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-materials' AND 
    (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'))
  );