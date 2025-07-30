import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Award, RotateCcw } from "lucide-react";
import { ExamQuestion, ExamAttempt } from "@/types/exam";
import { Course } from "@/types/course";
import { useLearning } from "@/contexts/LearningContext";
import { useToast } from "@/hooks/use-toast";

interface FinalExamProps {
  course: Course;
  questions: ExamQuestion[];
  onExamComplete: (result: ExamAttempt) => void;
  onRetakeExam: () => void;
  previousAttempt?: ExamAttempt;
}

export const FinalExam = ({ 
  course, 
  questions, 
  onExamComplete, 
  onRetakeExam,
  previousAttempt 
}: FinalExamProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const { state } = useLearning();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 60000));
    }, 60000);

    return () => clearInterval(timer);
  }, [startTime]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const canProceed = answers[currentQuestion.id] !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const submitExam = () => {
    const correctAnswers = calculateScore();
    const percentage = (correctAnswers / questions.length) * 100;
    const passed = percentage >= 80;

    const attempt: ExamAttempt = {
      id: `exam-${course.id}-${Date.now()}`,
      courseId: course.id,
      userId: state.user?.id || 'anonymous',
      questions,
      answers,
      score: correctAnswers,
      totalQuestions: questions.length,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      timeSpent
    };

    setIsSubmitted(true);
    onExamComplete(attempt);

    if (passed) {
      toast({
        title: "مبروك! لقد نجحت في الاختبار",
        description: `حصلت على ${percentage.toFixed(1)}% وأصبحت مؤهلاً للحصول على الشهادة`,
      });
    } else {
      toast({
        title: "لم تحقق النسبة المطلوبة",
        description: `حصلت على ${percentage.toFixed(1)}%. تحتاج إلى 80% أو أكثر للحصول على الشهادة`,
        variant: "destructive"
      });
    }
  };

  const getResultColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isSubmitted && previousAttempt) {
    const { percentage, passed, score, totalQuestions } = previousAttempt;
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 font-cairo text-2xl">
            {passed ? (
              <>
                <Award className="w-8 h-8 text-green-600" />
                مبروك! لقد نجحت في الاختبار
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-600" />
                لم تحقق النسبة المطلوبة
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className={`text-4xl font-bold ${getResultColor(percentage)}`}>
              {percentage.toFixed(1)}%
            </div>
            <div className="text-muted-foreground font-cairo">
              أجبت بشكل صحيح على {score} من {totalQuestions} أسئلة
            </div>
            
            {passed ? (
              <Badge variant="default" className="bg-green-600 text-white font-cairo">
                <Award className="w-4 h-4 ml-2" />
                مؤهل للشهادة
              </Badge>
            ) : (
              <Badge variant="destructive" className="font-cairo">
                <XCircle className="w-4 h-4 ml-2" />
                تحتاج إلى 80% أو أكثر
              </Badge>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 font-cairo">ملخص الإجابات:</h3>
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = previousAttempt.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="flex items-start gap-2 p-2 rounded border">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate font-cairo">
                        {index + 1}. {question.question}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-muted-foreground mt-1 font-cairo">
                          الإجابة الصحيحة: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!passed && (
              <Button 
                onClick={onRetakeExam}
                className="font-cairo"
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </Button>
            )}
            <Button 
              onClick={() => window.history.back()}
              className="font-cairo"
            >
              العودة للدورة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-cairo text-xl">
            الاختبار النهائي - {course.title}
          </CardTitle>
          <Badge variant="outline" className="font-cairo">
            <Clock className="w-4 h-4 ml-2" />
            {timeSpent} دقيقة
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground font-cairo">
            <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
            <span>النسبة المطلوبة: 80%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-cairo">
            {currentQuestion.question}
          </h3>
          
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer font-cairo"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="font-cairo"
          >
            السؤال السابق
          </Button>

          <div className="text-sm text-muted-foreground font-cairo">
            تم الإجابة على {Object.keys(answers).length} من {questions.length} أسئلة
          </div>

          {isLastQuestion ? (
            <Button
              onClick={submitExam}
              disabled={!allQuestionsAnswered}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
            >
              إنهاء الاختبار
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="font-cairo"
            >
              السؤال التالي
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};