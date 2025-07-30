import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Play, FileText, Move, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment';
  order_index: number;
  is_free: boolean;
  created_at: string;
  course?: {
    title: string;
  };
}

interface LessonFormData {
  course_id: string;
  title: string;
  description: string;
  content: string;
  duration_minutes: number;
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment';
  is_free: boolean;
}

export const LessonManager: React.FC = () => {
  const { state, hasRole } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<LessonFormData>({
    course_id: '',
    title: '',
    description: '',
    content: '',
    duration_minutes: 0,
    lesson_type: 'video',
    is_free: false
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadLessons(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      let query = supabase.from('courses').select('id, title');

      // إذا كان مدرب، اعرض دوراته فقط
      if (!hasRole('admin') && hasRole('instructor')) {
        query = query.eq('instructor_id', state.user?.id);
      }

      const { data, error } = await query.order('title');

      if (error) throw error;
      setCourses(data || []);
      
      if (data && data.length > 0 && !selectedCourse) {
        setSelectedCourse(data[0].id);
      }
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast.error('فشل في تحميل الدورات');
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          courses!inner (title)
        `)
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (error: any) {
      console.error('Error loading lessons:', error);
      toast.error('فشل في تحميل الدروس');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error('يرجى اختيار دورة أولاً');
      return;
    }

    try {
      // الحصول على الترقيم التلقائي للدرس
      const { data: existingLessons } = await supabase
        .from('lessons')
        .select('order_index')
        .eq('course_id', selectedCourse)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingLessons && existingLessons.length > 0 
        ? existingLessons[0].order_index + 1 
        : 1;

      const lessonData = {
        ...formData,
        course_id: selectedCourse,
        order_index: editingLesson ? editingLesson.order_index : nextOrderIndex
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;
        toast.success('تم تحديث الدرس بنجاح');
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([lessonData]);

        if (error) throw error;
        toast.success('تم إنشاء الدرس بنجاح');
      }

      setIsDialogOpen(false);
      resetForm();
      await loadLessons(selectedCourse);
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      toast.error('فشل في حفظ الدرس');
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      course_id: lesson.course_id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      duration_minutes: lesson.duration_minutes,
      lesson_type: lesson.lesson_type,
      is_free: lesson.is_free
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      
      toast.success('تم حذف الدرس بنجاح');
      await loadLessons(selectedCourse);
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      toast.error('فشل في حذف الدرس');
    }
  };

  const handleVideoUpload = async (file: File, lessonId: string) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${state.user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lesson-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('lesson-videos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('lessons')
        .update({ video_url: data.publicUrl })
        .eq('id', lessonId);

      if (updateError) throw updateError;

      toast.success('تم رفع الفيديو بنجاح');
      await loadLessons(selectedCourse);
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error('فشل في رفع الفيديو');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      course_id: '',
      title: '',
      description: '',
      content: '',
      duration_minutes: 0,
      lesson_type: 'video',
      is_free: false
    });
    setEditingLesson(null);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!hasRole('admin') && !hasRole('instructor')) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground font-cairo">غير مصرح لك بالوصول لهذه الصفحة</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-cairo">جاري تحميل الدروس...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-cairo">
              <Play className="w-5 h-5" />
              إدارة الدروس
            </CardTitle>
            <CardDescription className="font-cairo">
              إضافة وتعديل دروس الدورات التدريبية
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="اختر دورة" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id} className="font-cairo">
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()} disabled={!selectedCourse} className="font-cairo">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة درس جديد
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-cairo">
                    {editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}
                  </DialogTitle>
                  <DialogDescription className="font-cairo">
                    املأ النموذج أدناه لإنشاء أو تعديل درس
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-cairo">عنوان الدرس</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="أدخل عنوان الدرس"
                        required
                        className="font-cairo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="font-cairo">المدة (دقائق)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="0"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                        className="font-cairo"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lesson_type" className="font-cairo">نوع الدرس</Label>
                      <Select value={formData.lesson_type} onValueChange={(value: any) => setFormData({ ...formData, lesson_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video" className="font-cairo">فيديو</SelectItem>
                          <SelectItem value="text" className="font-cairo">نص</SelectItem>
                          <SelectItem value="quiz" className="font-cairo">اختبار</SelectItem>
                          <SelectItem value="assignment" className="font-cairo">مهمة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-cairo">إعدادات الوصول</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_free"
                          checked={formData.is_free}
                          onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="is_free" className="font-cairo text-sm">
                          درس مجاني (متاح للجميع)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-cairo">وصف الدرس</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="اكتب وصفاً للدرس"
                      rows={3}
                      className="font-cairo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="font-cairo">محتوى الدرس</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="اكتب محتوى الدرس التفصيلي"
                      rows={6}
                      className="font-cairo"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="font-cairo">
                      إلغاء
                    </Button>
                    <Button type="submit" className="font-cairo">
                      {editingLesson ? 'تحديث الدرس' : 'إنشاء الدرس'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!selectedCourse ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-cairo">يرجى اختيار دورة لعرض دروسها</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                      {lesson.order_index}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getLessonIcon(lesson.lesson_type)}
                        <h3 className="font-semibold font-cairo">{lesson.title}</h3>
                        {lesson.is_free && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-cairo">
                            مجاني
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-cairo">
                        {lesson.description || 'لا يوجد وصف'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration_minutes} دقيقة
                        </span>
                        <span>نوع: {lesson.lesson_type === 'video' ? 'فيديو' : lesson.lesson_type === 'text' ? 'نص' : lesson.lesson_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {lesson.lesson_type === 'video' && (
                      <>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file, lesson.id);
                          }}
                          className="hidden"
                          id={`video-upload-${lesson.id}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`video-upload-${lesson.id}`)?.click()}
                          disabled={uploading}
                          className="font-cairo"
                        >
                          <Upload className="w-4 h-4" />
                          {lesson.video_url ? 'تغيير الفيديو' : 'رفع فيديو'}
                        </Button>
                      </>
                    )}
                    
                    <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => handleDelete(lesson.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {lessons.length === 0 && (
              <div className="text-center py-8">
                <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-cairo">لا توجد دروس بعد</p>
                <p className="text-sm text-muted-foreground font-cairo">ابدأ بإضافة درس جديد</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};