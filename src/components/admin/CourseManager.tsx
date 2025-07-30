import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Eye, BookOpen, Clock, DollarSign } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string | null;
  instructor_id: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'archived';
  duration_hours: number;
  level: string;
  category: string | null;
  language: string;
  prerequisites: string[] | null;
  features: string[] | null;
  created_at: string;
  updated_at: string;
  instructor?: {
    full_name: string;
  };
}

interface CourseFormData {
  title: string;
  description: string;
  short_description: string;
  price: number;
  duration_hours: number;
  level: string;
  category: string;
  prerequisites: string;
  features: string;
}

export const CourseManager: React.FC = () => {
  const { state, hasRole } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    short_description: '',
    price: 0,
    duration_hours: 0,
    level: 'beginner',
    category: '',
    prerequisites: '',
    features: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('courses')
        .select(`
          *,
          profiles!instructor_id (
            full_name
          )
        `);

      // إذا كان مدرب، اعرض دوراته فقط
      if (!hasRole('admin') && hasRole('instructor')) {
        query = query.eq('instructor_id', state.user?.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast.error('فشل في تحميل الدورات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.user) return;

    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        price: formData.price,
        duration_hours: formData.duration_hours,
        level: formData.level,
        category: formData.category,
        prerequisites: formData.prerequisites.split(',').map(p => p.trim()).filter(Boolean),
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        instructor_id: state.user.id,
        status: 'draft' as const
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success('تم تحديث الدورة بنجاح');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
        toast.success('تم إنشاء الدورة بنجاح');
      }

      setIsDialogOpen(false);
      resetForm();
      await loadCourses();
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast.error('فشل في حفظ الدورة');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      short_description: course.short_description || '',
      price: course.price,
      duration_hours: course.duration_hours,
      level: course.level,
      category: course.category || '',
      prerequisites: course.prerequisites?.join(', ') || '',
      features: course.features?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      
      toast.success('تم حذف الدورة بنجاح');
      await loadCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast.error('فشل في حذف الدورة');
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;
      
      toast.success('تم تحديث حالة الدورة بنجاح');
      await loadCourses();
    } catch (error: any) {
      console.error('Error updating course status:', error);
      toast.error('فشل في تحديث حالة الدورة');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      price: 0,
      duration_hours: 0,
      level: 'beginner',
      category: '',
      prerequisites: '',
      features: ''
    });
    setEditingCourse(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline'
    } as const;
    
    const labels = {
      draft: 'مسودة',
      published: 'منشورة',
      archived: 'مؤرشفة'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
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
          <p className="text-muted-foreground font-cairo">جاري تحميل الدورات...</p>
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
              <BookOpen className="w-5 h-5" />
              إدارة الدورات
            </CardTitle>
            <CardDescription className="font-cairo">
              إضافة وتعديل الدورات التدريبية
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="font-cairo">
                <Plus className="w-4 h-4 ml-2" />
                إضافة دورة جديدة
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-cairo">
                  {editingCourse ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
                </DialogTitle>
                <DialogDescription className="font-cairo">
                  املأ النموذج أدناه لإنشاء أو تعديل دورة تدريبية
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-cairo">عنوان الدورة</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="أدخل عنوان الدورة"
                      required
                      className="font-cairo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-cairo">التصنيف</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="مثال: تطوير الذات"
                      className="font-cairo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description" className="font-cairo">الوصف المختصر</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="وصف مختصر للدورة"
                    className="font-cairo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-cairo">الوصف التفصيلي</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اكتب وصفاً تفصيلياً للدورة"
                    rows={4}
                    required
                    className="font-cairo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="font-cairo">السعر (جنيه سوداني)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="font-cairo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration_hours" className="font-cairo">المدة (ساعات)</Label>
                    <Input
                      id="duration_hours"
                      type="number"
                      min="0"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: Number(e.target.value) })}
                      className="font-cairo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level" className="font-cairo">المستوى</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner" className="font-cairo">مبتدئ</SelectItem>
                        <SelectItem value="intermediate" className="font-cairo">متوسط</SelectItem>
                        <SelectItem value="advanced" className="font-cairo">متقدم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites" className="font-cairo">المتطلبات (مفصولة بفواصل)</Label>
                  <Input
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    placeholder="خبرة أساسية في الحاسوب, الرغبة في التعلم"
                    className="font-cairo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features" className="font-cairo">المميزات (مفصولة بفواصل)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="شهادة معتمدة, دعم مدى الحياة, مواد قابلة للتحميل"
                    className="font-cairo"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="font-cairo">
                    إلغاء
                  </Button>
                  <Button type="submit" className="font-cairo">
                    {editingCourse ? 'تحديث الدورة' : 'إنشاء الدورة'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold font-cairo text-lg">{course.title}</h3>
                    {getStatusBadge(course.status)}
                  </div>
                  <p className="text-sm text-muted-foreground font-cairo mb-2">
                    {course.short_description || course.description.substring(0, 100) + '...'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration_hours} ساعة
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {course.price} جنيه
                    </span>
                    {course.instructor && (
                      <span>المدرب: {course.instructor.full_name}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={course.status}
                    onValueChange={(value) => handleStatusChange(course.id, value as any)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft" className="font-cairo">مسودة</SelectItem>
                      <SelectItem value="published" className="font-cairo">منشورة</SelectItem>
                      <SelectItem value="archived" className="font-cairo">مؤرشفة</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-cairo">لا توجد دورات بعد</p>
              <p className="text-sm text-muted-foreground font-cairo">ابدأ بإضافة دورة جديدة</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};