import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCourseById } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useLearning } from "@/contexts/LearningContext";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { useLessonNavigation } from "@/hooks/useLessonNavigation";
import { LessonContent } from "@/components/lesson/LessonContent";
import { LessonDiscussion } from "@/components/discussion/LessonDiscussion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  PlayCircle, 
  Lock, 
  Clock 
} from "lucide-react";
import Header from "@/components/Header";

const LessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { completeCourse } = useAuth();
  const { state } = useLearning();
  const course = courseId ? getCourseById(courseId) : null;
  const lesson = course?.lessons.find(l => l.id === lessonId);
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("content");

  // Mock discussion data - في التطبيق الحقيقي سيتم جلبها من قاعدة البيانات
  const [mockQuestions, setMockQuestions] = useState([
    {
      id: "q1",
      lessonId: lessonId || "",
      courseId: courseId || "",
      userId: "user1",
      userType: "student" as const,
      title: "كيف يمكنني تطبيق هذا المفهوم عملياً؟",
      content: "أواجه صعوبة في فهم كيفية تطبيق هذا المفهوم في مشروع حقيقي. هل يمكن توضيح مثال عملي؟",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isResolved: false,
      answersCount: 2,
      upvotes: 5,
      downvotes: 0,
      userVote: undefined as 'up' | 'down' | undefined,
      tags: ["تطبيق عملي", "مشروع"],
      user: {
        id: "user1",
        name: "أحمد محمد",
        avatar: "",
        role: "طالب"
      }
    }
  ]);

  // Hooks
  const { updateProgress, markCompleted } = useVideoProgress(courseId || '', lessonId || '');
  const { handlePreviousLesson, handleNextLesson } = useLessonNavigation(
    course, 
    courseId || '', 
    currentLessonIndex
  );

  useEffect(() => {
    if (course && lesson) {
      const index = course.lessons.findIndex(l => l.id === lessonId);
      setCurrentLessonIndex(index);
    }
  }, [course, lesson, lessonId]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4 font-cairo">الدرس غير موجود</h1>
          <Link to={courseId ? `/course/${courseId}` : "/"}>
            <Button className="font-cairo">العودة للدورة</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons([...completedLessons, lesson.id]);
      markCompleted();
      
      // Check if this is the last lesson to complete the course
      const updatedCompleted = [...completedLessons, lesson.id];
      if (course && updatedCompleted.length === course.lessons.length) {
        completeCourse(course.id);
      }
    }
  };

  const handleVideoProgress = (progressPercent: number) => {
    if (lesson) {
      const currentTime = (progressPercent / 100) * lesson.duration * 60;
      updateProgress(currentTime, lesson.duration * 60);
    }
  };

  const handleVideoComplete = () => {
    handleCompleteLesson();
  };

  const courseProgress = (completedLessons.length / course.lessons.length) * 100;

  // Discussion handlers
  const handleQuestionSubmit = async (questionData: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    const newQuestion = {
      id: `q${Date.now()}`,
      lessonId: lessonId || "",
      courseId: courseId || "",
      userId: state.user?.id || "anonymous",
      userType: "student" as const,
      title: questionData.title,
      content: questionData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false,
      answersCount: 0,
      upvotes: 0,
      downvotes: 0,
      userVote: undefined as 'up' | 'down' | undefined,
      tags: questionData.tags,
      user: {
        id: state.user?.id || "anonymous",
        name: state.user?.name || "مستخدم مجهول",
        avatar: state.user?.avatar || "",
        role: "طالب"
      }
    };
    
    setMockQuestions(prev => [newQuestion, ...prev]);
  };

  const handleQuestionClick = (questionId: string) => {
    // في التطبيق الحقيقي، سيتم الانتقال لصفحة تفاصيل السؤال
    console.log("Opening question:", questionId);
  };

  const handleVote = async (questionId: string, voteType: 'up' | 'down') => {
    setMockQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const currentVote = q.userVote;
        let newUpvotes = q.upvotes;
        let newDownvotes = q.downvotes;
        let newUserVote: 'up' | 'down' | undefined = voteType;

        // Remove previous vote if exists
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        // Add new vote if different from current
        if (currentVote === voteType) {
          newUserVote = undefined; // Remove vote
        } else {
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return {
          ...q,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        };
      }
      return q;
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Header for Mobile App-like Experience */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <Header />
        
        {/* Mobile-optimized Lesson Header */}
        <div className="px-4 py-3 bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <Link 
              to={`/course/${courseId}`} 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-cairo text-sm">العودة</span>
            </Link>
            <div className="text-xs text-muted-foreground font-cairo">
              {currentLessonIndex + 1}/{course.lessons.length}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-cairo font-medium">{course.title}</span>
              <span className="font-cairo">{Math.round(courseProgress)}%</span>
            </div>
            <Progress value={courseProgress} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Main Content with Mobile-first Design */}
      <div className="pt-32 md:pt-36">
        {/* Mobile Navigation Tabs */}
        <div className="sticky top-32 md:top-36 z-40 bg-background border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 rounded-none bg-muted/30">
              <TabsTrigger value="content" className="font-cairo text-xs md:text-sm">
                المحتوى
              </TabsTrigger>
              <TabsTrigger value="lessons" className="font-cairo text-xs md:text-sm">
                الدروس
              </TabsTrigger>
              <TabsTrigger value="discussion" className="font-cairo text-xs md:text-sm">
                النقاش
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Lesson Content Tab */}
          <TabsContent value="content" className="mt-0">
            <LessonContent 
              lesson={lesson}
              onVideoProgress={handleVideoProgress}
              onVideoComplete={handleVideoComplete}
            />
          </TabsContent>

          {/* Lessons List Tab (Mobile Sidebar Alternative) */}
          <TabsContent value="lessons" className="mt-0">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-bold font-cairo text-lg mb-2">قائمة الدروس</h3>
                <p className="text-sm text-muted-foreground font-cairo">
                  {completedLessons.length} من {course.lessons.length} مكتمل
                </p>
              </div>
              
              <div className="space-y-3">
                {course.lessons.map((lessonItem, index) => {
                  const isCompleted = completedLessons.includes(lessonItem.id);
                  const isCurrent = lessonItem.id === lesson.id;
                  const canAccess = index === 0 || completedLessons.includes(course.lessons[index - 1].id);
                  
                  const MobileLessonCard = () => (
                    <Card className={`border-0 shadow-card ${isCurrent ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent
                                ? 'bg-primary text-white'
                                : canAccess
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-muted/50 text-muted-foreground/50'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : !canAccess ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <span className="font-bold text-sm">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`font-medium font-cairo mb-1 ${
                              canAccess ? '' : 'text-muted-foreground/50'
                            }`}>
                              {lessonItem.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span className="font-cairo">{lessonItem.duration} دقيقة</span>
                              {isCurrent && <Badge variant="secondary" className="font-cairo">الحالي</Badge>}
                            </div>
                          </div>
                          
                          {canAccess && !isCurrent && (
                            <PlayCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );

                  if (!canAccess || isCurrent) {
                    return <MobileLessonCard key={lessonItem.id} />;
                  }

                  return (
                    <Link key={lessonItem.id} to={`/course/${courseId}/lesson/${lessonItem.id}`}>
                      <MobileLessonCard />
                    </Link>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="mt-0">
            <LessonDiscussion
              lessonId={lessonId!}
              courseId={courseId!}
              questions={mockQuestions}
              onQuestionSubmit={handleQuestionSubmit}
              onQuestionClick={handleQuestionClick}
              onVote={handleVote}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t p-4">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
            className="flex-1 font-cairo"
            size="sm"
          >
            <ChevronRight className="w-4 h-4 ml-1" />
            السابق
          </Button>
          
          <Button
            onClick={handleCompleteLesson}
            disabled={completedLessons.includes(lesson.id)}
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
            size="sm"
          >
            {completedLessons.includes(lesson.id) ? (
              <>
                <CheckCircle className="w-4 h-4 ml-1" />
                مكتمل
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 ml-1" />
                إكمال
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextLesson}
            disabled={currentLessonIndex >= course.lessons.length - 1}
            className="flex-1 font-cairo"
            size="sm"
          >
            التالي
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>
      </div>

      {/* Bottom Spacing for Fixed Navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default LessonView;