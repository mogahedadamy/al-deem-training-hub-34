import { Link } from "react-router-dom";
import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { Course, Lesson } from "@/types/course";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  course: Course;
  currentLesson: Lesson;
  courseId: string;
  completedLessons: string[];
  className?: string;
}

export const LessonSidebar = ({
  course,
  currentLesson,
  courseId,
  completedLessons,
  className
}: LessonSidebarProps) => {
  const canAccessLesson = (lessonIndex: number) => {
    // First lesson is always accessible
    if (lessonIndex === 0) return true;
    
    // Check if previous lesson is completed
    const previousLesson = course.lessons[lessonIndex - 1];
    return completedLessons.includes(previousLesson.id);
  };

  return (
    <div className={cn("w-80 bg-muted/30 border-l hidden lg:block", className)}>
      <div className="p-4 border-b">
        <h3 className="font-bold font-cairo">قائمة الدروس</h3>
        <p className="text-sm text-muted-foreground font-cairo mt-1">
          {completedLessons.length} من {course.lessons.length} مكتمل
        </p>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {course.lessons.map((lessonItem, index) => {
          const isCompleted = completedLessons.includes(lessonItem.id);
          const isCurrent = lessonItem.id === currentLesson.id;
          const canAccess = canAccessLesson(index);
          
          const LessonCard = ({ children }: { children: React.ReactNode }) => {
            if (!canAccess) {
              return (
                <div className={cn(
                  "block p-4 border-b opacity-50 cursor-not-allowed",
                  isCurrent && "bg-primary/10 border-l-4 border-l-primary"
                )}>
                  {children}
                </div>
              );
            }

            return (
              <Link
                to={`/course/${courseId}/lesson/${lessonItem.id}`}
                className={cn(
                  "block p-4 border-b hover:bg-muted/50 transition-colors",
                  isCurrent && "bg-primary/10 border-l-4 border-l-primary"
                )}
              >
                {children}
              </Link>
            );
          };

          return (
            <LessonCard key={lessonItem.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent
                        ? 'bg-primary text-white'
                        : canAccess
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted/50 text-muted-foreground/50'
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : !canAccess ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <PlayCircle className={cn(
                    "w-4 h-4",
                    canAccess ? "text-muted-foreground" : "text-muted-foreground/50"
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-cairo",
                  canAccess ? "text-muted-foreground" : "text-muted-foreground/50"
                )}>
                  {lessonItem.duration} د
                </span>
              </div>
              <h4 className={cn(
                "font-medium text-sm font-cairo leading-tight",
                canAccess ? "" : "text-muted-foreground/50"
              )}>
                {lessonItem.title}
              </h4>
              {!canAccess && (
                <p className="text-xs text-muted-foreground/50 font-cairo mt-1">
                  أكمل الدرس السابق للوصول
                </p>
              )}
            </LessonCard>
          );
        })}
      </div>
    </div>
  );
};