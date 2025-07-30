import { Check, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types/course';

interface LessonProgressProps {
  lessons: Lesson[];
  currentLessonId?: string;
  completedLessons: string[];
  onLessonSelect: (lessonId: string) => void;
  className?: string;
}

export const LessonProgress = ({
  lessons,
  currentLessonId,
  completedLessons,
  onLessonSelect,
  className
}: LessonProgressProps) => {
  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);
  const isLessonAccessible = (lesson: Lesson, index: number) => {
    // First lesson is always accessible
    if (index === 0) return true;
    // Other lessons are accessible if previous lesson is completed
    return isLessonCompleted(lessons[index - 1].id);
  };

  const getLessonIcon = (lesson: Lesson, index: number) => {
    if (isLessonCompleted(lesson.id)) {
      return <Check className="w-4 h-4 text-green-600" />;
    }
    if (isLessonAccessible(lesson, index)) {
      return <Play className="w-4 h-4 text-primary" />;
    }
    return <Lock className="w-4 h-4 text-muted-foreground" />;
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'text': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case 'video': return 'فيديو';
      case 'text': return 'نص';
      case 'quiz': return 'اختبار';
      case 'assignment': return 'مهمة';
      default: return type;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {lessons.map((lesson, index) => {
        const isCompleted = isLessonCompleted(lesson.id);
        const isAccessible = isLessonAccessible(lesson, index);
        const isCurrent = lesson.id === currentLessonId;

        return (
          <Card key={lesson.id} className={cn(
            "transition-all duration-200",
            isCurrent && "ring-2 ring-primary",
            isCompleted && "bg-green-50 border-green-200",
            !isAccessible && "opacity-50"
          )}>
            <Button
              variant="ghost"
              className="w-full p-4 h-auto justify-start"
              onClick={() => isAccessible && onLessonSelect(lesson.id)}
              disabled={!isAccessible}
            >
              <div className="flex items-start gap-3 w-full">
                {/* Lesson Number & Icon */}
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold",
                    isCompleted && "bg-green-600 border-green-600 text-white",
                    isCurrent && !isCompleted && "bg-primary border-primary text-white",
                    !isCurrent && !isCompleted && isAccessible && "border-muted-foreground text-muted-foreground",
                    !isAccessible && "border-muted text-muted"
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : lesson.order}
                  </div>
                  {getLessonIcon(lesson, index)}
                </div>

                {/* Lesson Content */}
                <div className="flex-1 text-right space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getLessonTypeColor(lesson.type))}
                    >
                      {getLessonTypeText(lesson.type)}
                    </Badge>
                    
                    <h4 className={cn(
                      "font-medium text-sm leading-tight",
                      isCompleted && "text-green-700",
                      isCurrent && "text-primary",
                      !isAccessible && "text-muted-foreground"
                    )}>
                      {lesson.title}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-right">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {lesson.duration} دقيقة
                    </span>
                    
                    {isCompleted && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        مكتمل
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
