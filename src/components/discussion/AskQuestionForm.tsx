import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AskQuestionFormProps {
  lessonId: string;
  courseId: string;
  onQuestionSubmit: (questionData: {
    title: string;
    content: string;
    tags: string[];
  }) => Promise<void>;
  onClose: () => void;
}

export const AskQuestionForm = ({ 
  lessonId, 
  courseId, 
  onQuestionSubmit, 
  onClose 
}: AskQuestionFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onQuestionSubmit({
        title: title.trim(),
        content: content.trim(),
        tags
      });
      
      toast({
        title: "تم نشر السؤال بنجاح",
        description: "سيتم الإجابة على سؤالك قريباً"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "حدث خطأ أثناء نشر السؤال",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-cairo">
            <MessageSquare className="w-5 h-5" />
            اطرح سؤالاً جديداً
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-cairo">عنوان السؤال *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنواناً واضحاً ومحدداً لسؤالك"
              className="font-cairo"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-left font-cairo">
              {title.length}/200
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="font-cairo">تفاصيل السؤال *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اشرح سؤالك بالتفصيل. كلما كان السؤال أوضح، كانت الإجابة أفضل."
              className="min-h-[120px] font-cairo"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-left font-cairo">
              {content.length}/1000
            </p>
          </div>

          <div className="space-y-3">
            <Label className="font-cairo">العلامات (اختيارية)</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="أضف علامة"
                className="flex-1 font-cairo"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addTag}
                disabled={!newTag.trim() || tags.length >= 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="gap-1 font-cairo"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground font-cairo">
              يمكنك إضافة حتى 5 علامات لتساعد الآخرين في العثور على سؤالك
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo"
            >
              {isSubmitting ? "جاري النشر..." : "نشر السؤال"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="font-cairo"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};