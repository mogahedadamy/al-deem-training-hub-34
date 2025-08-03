import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { usePaginatedCourses } from '@/hooks/usePaginatedQuery';
import { OptimizedImage } from '@/components/optimization/OptimizedImage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// مرشحات الكورسات
const courseFilters = {
  categories: [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'اللغات', label: 'اللغات' },
    { value: 'التكنولوجيا', label: 'التكنولوجيا' },
    { value: 'الأعمال', label: 'الأعمال' },
    { value: 'التصميم', label: 'التصميم' }
  ],
  levels: [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'beginner', label: 'مبتدئ' },
    { value: 'intermediate', label: 'متوسط' },
    { value: 'advanced', label: 'متقدم' }
  ]
};

const OptimizedCoursesGrid = () => {
  const { state } = useAuth();
  const { getTransactionForCourse } = usePayment();
  
  // حالات الفلترة
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all'
  });

  // استخدام الpagination المحسنة
  const {
    data: courses,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh
  } = usePaginatedCourses({
    ...(filters.category !== 'all' && { category: filters.category }),
    ...(filters.level !== 'all' && { level: filters.level })
  });

  // دالة تحديد زر التسجيل
  const getEnrollmentButton = (course: any) => {
    if (!state.isAuthenticated) {
      return (
        <Button asChild className="w-full font-cairo">
          <Link to="/auth">سجل للالتحاق</Link>
        </Button>
      );
    }

    const transaction = getTransactionForCourse(course.id);
    
    if (transaction?.status === 'verified') {
      return (
        <Button asChild className="w-full font-cairo">
          <Link to={`/course/${course.id}`}>ادخل الكورس</Link>
        </Button>
      );
    }

    if (transaction?.status === 'pending') {
      return (
        <Button disabled className="w-full font-cairo opacity-60">
          في انتظار التحقق
        </Button>
      );
    }

    if (transaction?.status === 'rejected') {
      return (
        <Button asChild variant="destructive" className="w-full font-cairo">
          <Link to={`/payment/${course.id}`}>إعادة المحاولة</Link>
        </Button>
      );
    }

    return (
      <Button asChild className="w-full font-cairo">
        <Link to={`/payment/${course.id}`}>اشترك الآن</Link>
      </Button>
    );
  };

  // معالجة تغيير الفلاتر
  const handleFilterChange = (type: 'category' | 'level', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-cairo mb-4">حدث خطأ في تحميل الكورسات</p>
        <Button onClick={refresh} variant="outline" className="font-cairo">
          <RefreshCw className="w-4 h-4 ml-2" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* الفلاتر */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courseFilters.categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courseFilters.levels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground font-cairo">
          {totalCount} كورس متاح
        </div>
      </div>

      {/* شبكة الكورسات */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <Card 
            key={course.id} 
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-video relative overflow-hidden">
              <OptimizedImage
                src={course.thumbnail_url || `/lovable-uploads/placeholder-${(index % 3) + 1}.png`}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                width={400}
                height={225}
                priority={index < 6}
              />
              
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-white/90 text-primary font-cairo">
                  {course.level}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground mr-2">4.8</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>150+</span>
                  </div>
                </div>

                <h3 className="font-bold text-xl font-cairo leading-tight line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-muted-foreground text-sm font-cairo line-clamp-2">
                  {course.short_description || course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-cairo">{course.duration_hours} ساعة</span>
                  </div>
                  <span className="font-cairo">{course.category}</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary font-cairo">
                      {course.price.toLocaleString()} ج.س
                    </span>
                  </div>

                  {getEnrollmentButton(course)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* زر تحميل المزيد */}
      {hasMore && (
        <div className="text-center mt-12">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline" 
            size="lg"
            className="font-cairo min-w-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                جاري التحميل...
              </>
            ) : (
              <>
                عرض المزيد
                <ArrowLeft className="w-4 h-4 mr-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Loading للصفحة الأولى */}
      {loading && courses.length === 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardContent className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const OptimizedCoursesSection = () => {
  return (
    <section id="courses" className="py-20 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4 font-cairo">
            دوراتنا التدريبية
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-cairo">
            برامج تدريبية متميزة
          </h2>
        </div>

        <ErrorBoundary>
          <OptimizedCoursesGrid />
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default OptimizedCoursesSection;