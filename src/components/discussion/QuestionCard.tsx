import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  Clock,
  User,
  Crown,
  GraduationCap
} from "lucide-react";
import { Question } from "@/types/discussion";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface QuestionCardProps {
  question: Question;
  onQuestionClick: (questionId: string) => void;
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
  showLessonInfo?: boolean;
}

export const QuestionCard = ({ 
  question, 
  onQuestionClick, 
  onVote,
  showLessonInfo = false 
}: QuestionCardProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting) return;
    setIsVoting(true);
    await onVote(question.id, voteType);
    setIsVoting(false);
  };

  const getUserIcon = (userType: string) => {
    switch (userType) {
      case 'instructor':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUserRoleBadge = (userType: string) => {
    switch (userType) {
      case 'instructor':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 font-cairo">
            مدرب
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-cairo">
            مشرف
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-cairo">
            طالب
          </Badge>
        );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1" onClick={() => onQuestionClick(question.id)}>
            <div className="flex items-center gap-2 mb-2">
              {question.isResolved && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <h3 className="font-semibold text-lg font-cairo line-clamp-2 hover:text-primary transition-colors">
                {question.title}
              </h3>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-2 font-cairo mb-3">
              {question.content}
            </p>

            {question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs font-cairo">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={question.user.avatar} alt={question.user.name} />
                <AvatarFallback className="text-xs font-cairo">
                  {question.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {getUserIcon(question.userType)}
                  <span className="text-sm font-medium font-cairo">{question.user.name}</span>
                </div>
                {getUserRoleBadge(question.userType)}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="font-cairo">
                {formatDistanceToNow(new Date(question.createdAt), { 
                  addSuffix: true, 
                  locale: ar 
                })}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`gap-1 ${question.userVote === 'up' ? 'text-green-600 bg-green-100 dark:bg-green-900' : ''}`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="font-cairo">{question.upvotes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`gap-1 ${question.userVote === 'down' ? 'text-red-600 bg-red-100 dark:bg-red-900' : ''}`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="font-cairo">{question.downvotes}</span>
              </Button>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-cairo">{question.answersCount} إجابة</span>
            </div>
          </div>

          {showLessonInfo && (
            <Badge variant="outline" className="font-cairo">
              الدرس #{question.lessonId}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};