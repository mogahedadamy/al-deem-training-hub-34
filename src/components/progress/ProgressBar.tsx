import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  className?: string;
  showDetails?: boolean;
}

export const ProgressBar = ({ 
  current, 
  total, 
  percentage, 
  className,
  showDetails = true 
}: ProgressBarProps) => {
  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'text-green-600';
    if (percent >= 70) return 'text-blue-600';
    if (percent >= 30) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressBadge = (percent: number) => {
    if (percent === 100) return { text: 'مكتمل', variant: 'default' as const };
    if (percent >= 70) return { text: 'متقدم', variant: 'secondary' as const };
    if (percent >= 30) return { text: 'في التقدم', variant: 'outline' as const };
    return { text: 'بداية', variant: 'outline' as const };
  };

  const progressBadge = getProgressBadge(percentage);

  return (
    <div className={cn("space-y-3", className)}>
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {percentage === 100 ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : percentage > 0 ? (
              <Clock className="w-5 h-5 text-blue-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            
            <span className="text-sm font-medium">
              {current} من {total} دروس
            </span>
          </div>

          <Badge variant={progressBadge.variant}>
            {progressBadge.text}
          </Badge>
        </div>
      )}

      <div className="space-y-2">
        <Progress 
          value={percentage} 
          className="h-3"
        />
        
        <div className="flex justify-between items-center text-sm">
          <span className={cn("font-medium", getProgressColor(percentage))}>
            {Math.round(percentage)}% مكتمل
          </span>
          
          {percentage < 100 && (
            <span className="text-muted-foreground">
              {total - current} دروس متبقية
            </span>
          )}
        </div>
      </div>
    </div>
  );
};