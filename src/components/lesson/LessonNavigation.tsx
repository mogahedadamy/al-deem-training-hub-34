import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Course, Lesson } from "@/types/course";

interface LessonNavigationProps {
  course: Course;
  lesson: Lesson;
  currentLessonIndex: number;
  completedLessons: string[];
  onPreviousLesson: () => void;
  onNextLesson: () => void;
  onCompleteLesson: () => void;
}

export const LessonNavigation = ({
  course,
  lesson,
  currentLessonIndex,
  completedLessons,
  onPreviousLesson,
  onNextLesson,
  onCompleteLesson
}: LessonNavigationProps) => {
  const isCompleted = completedLessons.includes(lesson.id);
  const canGoPrevious = currentLessonIndex > 0;
  const canGoNext = currentLessonIndex < course.lessons.length - 1;

  return (
    <div className="flex items-center justify-between p-6 border-t bg-muted/20">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onPreviousLesson}
          disabled={!canGoPrevious}
          className="font-cairo"
        >
          <ChevronRight className="w-4 h-4 ml-2" />
          الدرس السابق
        </Button>
        
        <Button
          variant="outline"
          onClick={onNextLesson}
          disabled={!canGoNext}
          className="font-cairo"
        >
          الدرس التالي
          <ChevronLeft className="w-4 h-4 mr-2" />
        </Button>
      </div>

      <Button
        onClick={onCompleteLesson}
        disabled={isCompleted}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
      >
        {isCompleted ? (
          <>
            <CheckCircle className="w-5 h-5 ml-2" />
            مكتمل
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 ml-2" />
            إكمال الدرس
          </>
        )}
      </Button>
    </div>
  );
};