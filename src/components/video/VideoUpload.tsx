import { useState, useRef } from 'react';
import { Upload, Film, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface VideoUploadProps {
  onUploadComplete?: (videoData: {
    url: string;
    title: string;
    description: string;
    duration: number;
    thumbnail?: string;
  }) => void;
  onCancel?: () => void;
}

export const VideoUpload = ({ onUploadComplete, onCancel }: VideoUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    setSuccess(false);

    // التحقق من نوع الملف
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('نوع الملف غير مدعوم. يُسمح فقط بملفات MP4, WebM, OGG');
      return;
    }

    // التحقق من حجم الملف
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('حجم الملف كبير جداً. الحد الأقصى 500 ميجابايت');
      return;
    }

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const simulateUpload = async () => {
    if (!file || !title.trim()) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // محاكاة رفع الملف
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // محاكاة URL للفيديو المرفوع
      const videoUrl = `https://video-storage.bunnycdn.com/demo/${file.name}`;
      
      // الحصول على مدة الفيديو
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        
        onUploadComplete?.({
          url: videoUrl,
          title: title.trim(),
          description: description.trim(),
          duration: duration,
          thumbnail: `https://video-storage.bunnycdn.com/demo/${file.name}-thumb.jpg`
        });

        setSuccess(true);
        setTimeout(() => {
          resetForm();
        }, 2000);
      };

      video.src = URL.createObjectURL(file);

    } catch (err) {
      setError('حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setError('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    resetForm();
  };

  if (success) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">تم رفع الفيديو بنجاح!</h3>
        <p className="text-muted-foreground">تم حفظ الفيديو وهو جاهز للاستخدام</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">رفع فيديو جديد</h3>
          <p className="text-sm text-muted-foreground">
            ارفع الفيديوهات بحد أقصى 500 ميجابايت. الأنواع المدعومة: MP4, WebM, OGG
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!file ? (
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">اسحب وأفلت الفيديو هنا</p>
            <p className="text-sm text-muted-foreground mb-4">أو انقر لاختيار ملف</p>
            <Button variant="outline">
              <Upload className="ml-2 h-4 w-4" />
              اختر ملف
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Film className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} ميجابايت
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الفيديو *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ادخل عنوان الفيديو"
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الفيديو</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ادخل وصف للفيديو (اختياري)"
                  disabled={uploading}
                  rows={3}
                />
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>جاري الرفع...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={simulateUpload}
                disabled={uploading || !title.trim()}
                className="flex-1"
              >
                {uploading ? 'جاري الرفع...' : 'رفع الفيديو'}
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={uploading}
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};