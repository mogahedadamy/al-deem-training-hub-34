import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Edit2, Save, X } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface Course {
  id: string;
  title: string;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
}

const PriceManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, price, currency, status, category')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الدورات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (course: Course) => {
    setEditingCourse(course.id);
    setEditPrice(course.price.toString());
  };

  const cancelEditing = () => {
    setEditingCourse(null);
    setEditPrice('');
  };

  const updatePrice = async (courseId: string) => {
    const price = parseFloat(editPrice);
    
    if (isNaN(price) || price < 0) {
      toast({
        title: "خطأ في السعر",
        description: "يرجى إدخال سعر صحيح",
        variant: "destructive",
      });
      return;
    }

    setUpdating(courseId);
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ price })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, price } : course
      ));

      setEditingCourse(null);
      setEditPrice('');
      
      toast({
        title: "تم تحديث السعر",
        description: "تم تحديث سعر الدورة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث السعر",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      published: { label: 'منشورة', variant: 'default' as const },
      draft: { label: 'مسودة', variant: 'secondary' as const },
      archived: { label: 'مؤرشفة', variant: 'outline' as const }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري تحميل الدورات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>إدارة أسعار الدورات</CardTitle>
            <CardDescription>
              تعديل أسعار الدورات المختلفة
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <Badge variant={getStatusBadge(course.status).variant}>
                      {getStatusBadge(course.status).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    التصنيف: {course.category}
                  </p>
                  
                  {editingCourse === course.id ? (
                    <div className="flex items-center gap-2 mt-3">
                      <Label htmlFor={`price-${course.id}`} className="text-sm">
                        السعر الجديد:
                      </Label>
                      <Input
                        id={`price-${course.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-32"
                        disabled={updating === course.id}
                      />
                      <span className="text-sm text-muted-foreground">
                        {course.currency}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <CurrencyDisplay 
                        price={course.price} 
                        className="text-lg font-bold text-primary"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingCourse === course.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updatePrice(course.id)}
                        disabled={updating === course.id}
                      >
                        {updating === course.id ? (
                          <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={updating === course.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(course)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      تعديل السعر
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد دورات متاحة
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceManager;