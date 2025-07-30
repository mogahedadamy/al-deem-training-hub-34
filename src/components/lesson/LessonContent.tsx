import { Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Lesson } from "@/types/course";

interface LessonContentProps {
  lesson: Lesson;
  onVideoProgress: (progress: number) => void;
  onVideoComplete: () => void;
}

export const LessonContent = ({ 
  lesson, 
  onVideoProgress, 
  onVideoComplete 
}: LessonContentProps) => {
  return (
    <div className="flex-1">
      {/* Video Player / Content Area */}
      <div className="bg-black relative">
        {lesson.type === 'video' ? (
          <VideoPlayer
            src={lesson.content.videoUrl || ''}
            title={lesson.title}
            onProgress={onVideoProgress}
            onComplete={onVideoComplete}
            className="aspect-video"
            type={lesson.content.videoUrl?.includes('youtube') ? 'youtube' : 'direct'}
            qualities={lesson.content.videoQualities}
            autoplay={false}
          />
        ) : (
          <div className="aspect-video bg-muted/20 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <p className="font-cairo text-muted-foreground">محتوى نصي</p>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Content - محسن للجوال */}
      <div className="p-3 md:p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 md:mb-6">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold font-cairo mb-2">
              {lesson.title}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-cairo text-sm md:text-base flex-1">
                {lesson.description}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground ml-4">
                <Clock className="w-4 h-4" />
                <span className="font-cairo text-sm">{lesson.duration}د</span>
              </div>
            </div>
          </div>

          {/* Lesson Notes/Content - محسن للجوال */}
          <Card className="mb-4 md:mb-6 border-0 shadow-card bg-gradient-card">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-cairo text-lg font-semibold mb-3">ملاحظات الدرس</h3>
              <div className="prose max-w-none font-cairo">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {lesson.content.textContent || 
                    "هنا يمكن إضافة المحتوى النصي للدرس، الملاحظات المهمة، والنقاط الرئيسية التي يجب على الطالب التركيز عليها. يتضمن هذا القسم شرحاً مفصلاً للمفاهيم المطروحة في الفيديو مع أمثلة تطبيقية وتمارين عملية."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};