import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { getCourseById } from "@/data/courses";
import { getExamQuestions } from "@/data/examQuestions";
import { useLearning } from "@/contexts/LearningContext";
import { FinalExam } from "@/components/exam/FinalExam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Clock, Users, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { ExamAttempt } from "@/types/exam";

const ExamPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { 
    canTakeExam, 
    getLatestExamAttempt, 
    addExamAttempt, 
    hasPassed,
    getCompletionRate 
  } = useLearning();
  
  const [examStarted, setExamStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const course = courseId ? getCourseById(courseId) : null;
  const examQuestions = courseId ? getExamQuestions(courseId) : [];
  const latestAttempt = courseId ? getLatestExamAttempt(courseId) : null;
  const hasPassedExam = courseId ? hasPassed(courseId) : false;
  const canTake = courseId ? canTakeExam(courseId) : false;
  const completionRate = courseId ? getCompletionRate(courseId) : 0;

  if (!course) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4 font-cairo">الدورة غير موجودة</h1>
          <Link to="/dashboard">
            <Button className="font-cairo">العودة للوحة التحكم</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4 font-cairo">
            الاختبار النهائي غير متوفر حالياً
          </h1>
          <p className="text-muted-foreground mb-6 font-cairo">
            سيتم إضافة الاختبار النهائي لهذه الدورة قريباً
          </p>
          <Link to={`/course/${courseId}`}>
            <Button className="font-cairo">العودة للدورة</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleExamComplete = (result: ExamAttempt) => {
    addExamAttempt(courseId!, result);
    setShowResult(true);
  };

  const handleRetakeExam = () => {
    setExamStarted(false);
    setShowResult(false);
  };

  const startExam = () => {
    setExamStarted(true);
    setShowResult(false);
  };

  if (examStarted || showResult) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <FinalExam
            course={course}
            questions={examQuestions}
            onExamComplete={handleExamComplete}
            onRetakeExam={handleRetakeExam}
            previousAttempt={showResult ? latestAttempt || undefined : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2 font-cairo">
            <BookOpen className="w-4 h-4" />
            <Link to={`/course/${courseId}`} className="hover:text-primary">
              {course.title}
            </Link>
            <span>/</span>
            <span>الاختبار النهائي</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-cairo mb-4">
            الاختبار النهائي
          </h1>
        </div>

        {/* Exam Status */}
        <div className="grid gap-6 mb-8">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-cairo">
                <BookOpen className="w-5 h-5" />
                تقدم الدورة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-cairo">
                    نسبة الإكمال
                  </span>
                  <span className="font-semibold">{completionRate.toFixed(0)}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
                
                {completionRate < 100 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200 font-cairo">
                          يجب إكمال جميع دروس الدورة أولاً
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-1 font-cairo">
                          يمكنك التقدم للاختبار النهائي بعد إكمال 100% من الدروس
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exam Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-cairo">
                <Award className="w-5 h-5" />
                معلومات الاختبار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {examQuestions.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-cairo">
                    سؤال
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    80%
                  </div>
                  <div className="text-sm text-muted-foreground font-cairo">
                    النسبة المطلوبة
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ∞
                  </div>
                  <div className="text-sm text-muted-foreground font-cairo">
                    المحاولات
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Attempts */}
          {latestAttempt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cairo">
                  <Clock className="w-5 h-5" />
                  آخر محاولة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {latestAttempt.passed ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {latestAttempt.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground font-cairo">
                        {latestAttempt.score} من {latestAttempt.totalQuestions} إجابة صحيحة
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={latestAttempt.passed ? "default" : "destructive"}
                    className="font-cairo"
                  >
                    {latestAttempt.passed ? "نجح" : "لم ينجح"}
                  </Badge>
                </div>
                
                {latestAttempt.passed && (
                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200 font-cairo">
                        مبروك! أنت مؤهل للحصول على شهادة إتمام الدورة
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link to={`/course/${courseId}`}>
            <Button variant="outline" className="font-cairo">
              العودة للدورة
            </Button>
          </Link>
          
          {canTake && (
            <Button 
              onClick={startExam}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
              size="lg"
            >
              {hasPassedExam ? "إعادة الاختبار" : "بدء الاختبار النهائي"}
            </Button>
          )}
        </div>

        {!canTake && (
          <div className="text-center mt-4">
            <p className="text-muted-foreground font-cairo">
              يجب إكمال جميع دروس الدورة قبل التقدم للاختبار النهائي
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;