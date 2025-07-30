import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, XCircle, Award, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
  answers: { [questionId: string]: number };
}

interface CourseExamProps {
  courseId: string;
  courseTitle: string;
  questions: ExamQuestion[];
  passingScore?: number;
  timeLimit?: number; // in minutes
  onComplete: (result: ExamResult) => void;
}

export const CourseExam: React.FC<CourseExamProps> = ({
  courseId,
  courseTitle,
  questions,
  passingScore = 70,
  timeLimit = 30,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (examStarted && !examCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examStarted, examCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    toast.success('بدأ الاختبار! حظ موفق!');
  };

  const handleAnswerSelect = (value: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmitExam = () => {
    const score = calculateScore();
    const passed = score >= passingScore;
    const timeSpent = (timeLimit * 60) - timeLeft;

    const examResult: ExamResult = {
      score,
      totalQuestions: questions.length,
      passed,
      timeSpent,
      answers
    };

    setResult(examResult);
    setExamCompleted(true);
    setShowResults(true);
    
    onComplete(examResult);

    if (passed) {
      toast.success(`تهانينا! لقد نجحت في الاختبار بدرجة ${score.toFixed(1)}%`);
    } else {
      toast.error(`للأسف لم تنجح في الاختبار. تحتاج ${passingScore}% للنجاح`);
    }
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  const progressPercentage = (currentQuestion + 1) / questions.length * 100;

  // Pre-exam screen
  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-cairo">اختبار الدورة</CardTitle>
            <p className="text-muted-foreground font-cairo">{courseTitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold font-cairo">عدد الأسئلة</p>
                  <p className="text-sm text-muted-foreground">{questions.length} سؤال</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-semibold font-cairo">الوقت المحدد</p>
                  <p className="text-sm text-muted-foreground">{timeLimit} دقيقة</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Award className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold font-cairo">درجة النجاح</p>
                  <p className="text-sm text-muted-foreground">{passingScore}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-semibold font-cairo">محاولة واحدة</p>
                  <p className="text-sm text-muted-foreground">لا يمكن إعادة الاختبار</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 font-cairo mb-2">تعليمات مهمة:</h4>
              <ul className="text-sm text-yellow-700 space-y-1 font-cairo">
                <li>• اقرأ كل سؤال بعناية قبل الإجابة</li>
                <li>• يمكنك العودة لتعديل الإجابات قبل التسليم</li>
                <li>• سيتم تسليم الاختبار تلقائياً عند انتهاء الوقت</li>
                <li>• تأكد من اتصالك بالإنترنت طوال فترة الاختبار</li>
              </ul>
            </div>

            <Button 
              onClick={handleStartExam}
              className="w-full bg-gradient-primary hover:shadow-glow font-cairo"
              size="lg"
            >
              بدء الاختبار
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results screen
  if (showResults && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.passed ? (
                <Award className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <CardTitle className={`text-2xl font-cairo ${
              result.passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.passed ? 'نجحت في الاختبار!' : 'لم تنجح في الاختبار'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.score.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground font-cairo">درجتك</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  {Math.round((result.score / 100) * result.totalQuestions)}/{result.totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground font-cairo">الإجابات الصحيحة</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{formatTime(result.timeSpent)}</p>
                <p className="text-sm text-muted-foreground font-cairo">الوقت المستغرق</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{passingScore}%</p>
                <p className="text-sm text-muted-foreground font-cairo">درجة النجاح المطلوبة</p>
              </div>
            </div>

            {result.passed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-green-800 font-cairo mb-2">
                  🎉 تهانينا! لقد أكملت الدورة بنجاح
                </h4>
                <p className="text-sm text-green-700 font-cairo">
                  ستحصل على شهادة إتمام الدورة قريباً
                </p>
              </div>
            )}

            {!result.passed && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-red-800 font-cairo mb-2">
                  لم تحصل على الدرجة المطلوبة للنجاح
                </h4>
                <p className="text-sm text-red-700 font-cairo">
                  يمكنك مراجعة محتوى الدورة والمحاولة مرة أخرى لاحقاً
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam screen
  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with timer and progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="font-cairo">
            السؤال {currentQuestion + 1} من {questions.length}
          </Badge>
          <div className="text-sm text-muted-foreground font-cairo">
            تم الإجابة على {getAnsweredQuestionsCount()} من {questions.length} أسئلة
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className={`font-mono font-bold ${
            timeLeft < 300 ? 'text-red-500' : 'text-foreground'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-2" />

      {/* Question card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-cairo">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup 
            value={answers[currentQ.id]?.toString() || ''} 
            onValueChange={handleAnswerSelect}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
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
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="font-cairo"
        >
          السؤال السابق
        </Button>

        <div className="flex gap-2">
          {!isLastQuestion ? (
            <Button
              onClick={handleNextQuestion}
              disabled={!(currentQ.id in answers)}
              className="font-cairo"
            >
              السؤال التالي
            </Button>
          ) : (
            <Button
              onClick={handleSubmitExam}
              disabled={getAnsweredQuestionsCount() !== questions.length}
              className="bg-green-600 hover:bg-green-700 font-cairo"
            >
              تسليم الاختبار
            </Button>
          )}
        </div>
      </div>

      {/* Question overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-cairo">ملخص الإجابات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className={`
                  ${answers[questions[index].id] !== undefined ? 'bg-green-100 border-green-300' : ''}
                  ${currentQuestion === index ? 'ring-2 ring-primary' : ''}
                `}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};