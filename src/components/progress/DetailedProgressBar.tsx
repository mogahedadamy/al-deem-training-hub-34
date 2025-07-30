import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play } from 'lucide-react';

interface DetailedProgressBarProps {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  className?: string;
  showDetails?: boolean;
}

export const DetailedProgressBar: React.FC<DetailedProgressBarProps> = ({
  progress,
  totalLessons,
  completedLessons,
  className = '',
  showDetails = true
}) => {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressBadge = (progress: number) => {
    if (progress === 100) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 ml-1" />
          مكتمل
        </Badge>
      );
    }
    if (progress > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Play className="w-3 h-3 ml-1" />
          جاري
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        <Clock className="w-3 h-3 ml-1" />
        لم يبدأ
      </Badge>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showDetails && getProgressBadge(progress)}
          <span className={`text-sm font-semibold font-cairo ${getProgressColor(progress)}`}>
            {progress.toFixed(0)}%
          </span>
        </div>
        
        {showDetails && (
          <div className="text-sm text-muted-foreground font-cairo">
            {completedLessons} من {totalLessons} درس
          </div>
        )}
      </div>
      
      <Progress 
        value={progress} 
        className={`h-2 ${
          progress === 100 
            ? '[&>[data-orientation=horizontal]>[data-state=complete]]:bg-green-500' 
            : progress >= 75 
            ? '[&>[data-orientation=horizontal]>[data-state=complete]]:bg-blue-500' 
            : progress >= 50 
            ? '[&>[data-orientation=horizontal]>[data-state=complete]]:bg-yellow-500' 
            : '[&>[data-orientation=horizontal]>[data-state=complete]]:bg-gray-400'
        }`}
      />
      
      {showDetails && progress > 0 && progress < 100 && (
        <p className="text-xs text-muted-foreground font-cairo">
          استمر في التعلم للوصول إلى {Math.ceil((totalLessons - completedLessons))} دروس متبقية
        </p>
      )}
      
      {showDetails && progress === 100 && (
        <p className="text-xs text-green-600 font-cairo">
          🎉 تهانينا! لقد أكملت جميع دروس هذه الدورة
        </p>
      )}
    </div>
  );
};