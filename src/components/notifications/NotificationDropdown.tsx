import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BellRing,
  BookOpen,
  Award,
  Clock,
  MessageSquare,
  CheckCircle,
  Settings,
  Archive,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Notification, NotificationType } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

export const NotificationDropdown = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onDelete,
  onNotificationClick
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'lesson_added':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'course_reminder':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'exam_result':
        return <Award className="w-4 h-4 text-green-600" />;
      case 'certificate_issued':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'course_completion':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'discussion_reply':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'system_update':
        return <Settings className="w-4 h-4 text-gray-600" />;
      case 'payment_confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
    setIsOpen(false);
  };

  const recentNotifications = notifications
    .filter(n => !n.isArchived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DropdownMenuLabel className="font-cairo text-lg p-0">
              الإشعارات
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs font-cairo"
              >
                تحديد الكل كمقروء
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1 font-cairo">
              لديك {unreadCount} إشعار جديد
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {recentNotifications.length > 0 ? (
            <div className="p-2">
              {recentNotifications.map((notification) => (
                <div key={notification.id}>
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                      !notification.isRead && "bg-primary/5 border-r-2 border-primary"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-medium leading-tight font-cairo",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0 mt-1",
                            getPriorityColor(notification.priority)
                          )} />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 font-cairo">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ar
                          })}
                        </span>
                        
                        {notification.actionUrl && (
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2 font-cairo">لا توجد إشعارات</h3>
              <p className="text-sm text-muted-foreground font-cairo">
                ستظهر الإشعارات الجديدة هنا
              </p>
            </div>
          )}
        </ScrollArea>

        {recentNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button 
                variant="ghost" 
                className="w-full justify-center font-cairo"
                onClick={() => setIsOpen(false)}
              >
                عرض جميع الإشعارات
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};