import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  Clock,
  User,
  Crown,
  GraduationCap,
  Edit,
  Flag
} from "lucide-react";
import { Answer } from "@/types/discussion";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface AnswerCardProps {
  answer: Answer;
  onVote: (answerId: string, voteType: 'up' | 'down') => void;
  onAccept?: (answerId: string) => void;
  canAccept?: boolean;
  isQuestionOwner?: boolean;
}

export const AnswerCard = ({ 
  answer, 
  onVote, 
  onAccept,
  canAccept = false,
  isQuestionOwner = false
}: AnswerCardProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting) return;
    setIsVoting(true);
    await onVote(answer.id, voteType);
    setIsVoting(false);
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(answer.id);
    }
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
        return null;
    }
  };

  return (
    <Card className={`transition-all duration-300 ${
      answer.isAccepted ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800' : ''
    } ${answer.isInstructorAnswer ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-800' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={answer.user.avatar} alt={answer.user.name} />
              <AvatarFallback className="font-cairo">
                {answer.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getUserIcon(answer.userType)}
                <span className="font-medium font-cairo">{answer.user.name}</span>
                {getUserRoleBadge(answer.userType)}
                {answer.isAccepted && (
                  <Badge className="bg-green-600 text-white font-cairo">
                    <CheckCircle className="w-3 h-3 ml-1" />
                    إجابة مقبولة
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-cairo">
                  {formatDistanceToNow(new Date(answer.createdAt), { 
                    addSuffix: true, 
                    locale: ar 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canAccept && isQuestionOwner && !answer.isAccepted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAccept}
                className="gap-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-cairo"
              >
                <CheckCircle className="w-4 h-4" />
                قبول الإجابة
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="gap-1 font-cairo">
              <Flag className="w-4 h-4" />
              إبلاغ
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose prose-sm max-w-none mb-4 font-cairo">
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {answer.content}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('up')}
              disabled={isVoting}
              className={`gap-1 ${answer.userVote === 'up' ? 'text-green-600 bg-green-100 dark:bg-green-900' : ''}`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="font-cairo">{answer.upvotes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('down')}
              disabled={isVoting}
              className={`gap-1 ${answer.userVote === 'down' ? 'text-red-600 bg-red-100 dark:bg-red-900' : ''}`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="font-cairo">{answer.downvotes}</span>
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground font-cairo">
            <Edit className="w-4 h-4" />
            تعديل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};