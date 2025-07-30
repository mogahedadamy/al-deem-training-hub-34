import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/types/course";

interface LessonHeaderProps {
  course: Course;
  courseId: string;
  currentLessonIndex: number;
  courseProgress: number;
}

export const LessonHeader = ({ 
  course, 
  courseId, 
  currentLessonIndex, 
  courseProgress 
}: LessonHeaderProps) => {
  return (
    <div className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link 
              to={`/course/${courseId}`} 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="font-cairo">العودة للدورة</span>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <h1 className="font-bold text-lg font-cairo">{course.title}</h1>
          </div>
          <div className="text-sm text-muted-foreground font-cairo">
            الدرس {currentLessonIndex + 1} من {course.lessons.length}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-cairo">التقدم في الدورة</span>
            <span className="font-cairo">{Math.round(courseProgress)}%</span>
          </div>
          <Progress value={courseProgress} className="h-2" />
        </div>
      </div>
    </div>
  );
};