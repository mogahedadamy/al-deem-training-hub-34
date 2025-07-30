import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { AskQuestionForm } from "./AskQuestionForm";
import { Question } from "@/types/discussion";
import { useLearning } from "@/contexts/LearningContext";

interface LessonDiscussionProps {
  lessonId: string;
  courseId: string;
  questions: Question[];
  onQuestionSubmit: (questionData: {
    title: string;
    content: string;
    tags: string[];
  }) => Promise<void>;
  onQuestionClick: (questionId: string) => void;
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
}

export const LessonDiscussion = ({
  lessonId,
  courseId,
  questions,
  onQuestionSubmit,
  onQuestionClick,
  onVote
}: LessonDiscussionProps) => {
  const [showAskForm, setShowAskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);
  const { state } = useLearning();

  useEffect(() => {
    let filtered = questions.filter(q => q.lessonId === lessonId);

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    switch (filterBy) {
      case 'resolved':
        filtered = filtered.filter(q => q.isResolved);
        break;
      case 'unresolved':
        filtered = filtered.filter(q => !q.isResolved);
        break;
      case 'my-questions':
        filtered = filtered.filter(q => q.userId === state.user?.id);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-voted':
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'most-answers':
        filtered.sort((a, b) => b.answersCount - a.answersCount);
        break;
    }

    setFilteredQuestions(filtered);
  }, [questions, lessonId, searchTerm, sortBy, filterBy, state.user?.id]);

  const stats = {
    total: questions.filter(q => q.lessonId === lessonId).length,
    resolved: questions.filter(q => q.lessonId === lessonId && q.isResolved).length,
    unresolved: questions.filter(q => q.lessonId === lessonId && !q.isResolved).length,
    myQuestions: questions.filter(q => q.lessonId === lessonId && q.userId === state.user?.id).length
  };

  if (showAskForm) {
    return (
      <div className="space-y-6">
        <AskQuestionForm
          lessonId={lessonId}
          courseId={courseId}
          onQuestionSubmit={onQuestionSubmit}
          onClose={() => setShowAskForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-cairo">
              <MessageSquare className="w-5 h-5" />
              مناقشة الدرس
            </CardTitle>
            <Button 
              onClick={() => setShowAskForm(true)}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
            >
              <Plus className="w-4 h-4 ml-2" />
              اطرح سؤالاً
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground font-cairo">إجمالي الأسئلة</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground font-cairo">تم الحل</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{stats.unresolved}</div>
              <div className="text-xs text-muted-foreground font-cairo">في الانتظار</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{stats.myQuestions}</div>
              <div className="text-xs text-muted-foreground font-cairo">أسئلتي</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ابحث في الأسئلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-cairo"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 font-cairo">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="font-cairo">الأحدث</SelectItem>
                <SelectItem value="oldest" className="font-cairo">الأقدم</SelectItem>
                <SelectItem value="most-voted" className="font-cairo">الأكثر تقييماً</SelectItem>
                <SelectItem value="most-answers" className="font-cairo">الأكثر إجابات</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48 font-cairo">
                <SelectValue placeholder="فلترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-cairo">جميع الأسئلة</SelectItem>
                <SelectItem value="resolved" className="font-cairo">تم الحل</SelectItem>
                <SelectItem value="unresolved" className="font-cairo">في الانتظار</SelectItem>
                <SelectItem value="my-questions" className="font-cairo">أسئلتي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onQuestionClick={onQuestionClick}
              onVote={onVote}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 font-cairo">لا توجد أسئلة بعد</h3>
              <p className="text-muted-foreground mb-4 font-cairo">
                كن أول من يطرح سؤالاً حول هذا الدرس
              </p>
              <Button 
                onClick={() => setShowAskForm(true)}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
              >
                <Plus className="w-4 h-4 ml-2" />
                اطرح السؤال الأول
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};