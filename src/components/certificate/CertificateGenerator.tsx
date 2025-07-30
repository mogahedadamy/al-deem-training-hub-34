import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award, Calendar, User, BookOpen } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface CertificateData {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  instructorName?: string;
  certificateId: string;
  grade?: number;
}

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  onDownload?: (imageBlob: Blob) => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  certificateData,
  onDownload
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff'
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Download the certificate
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `certificate-${certificateData.certificateId}.png`;
      link.click();

      // Call onDownload callback if provided
      if (onDownload) {
        onDownload(blob);
      }

      toast.success('تم تنزيل الشهادة بنجاح!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('حدث خطأ أثناء إنشاء الشهادة');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="relative bg-white border-8 border-double border-amber-600 mx-auto"
        style={{ width: '800px', height: '600px' }}
      >
        {/* Decorative border */}
        <div className="absolute inset-4 border-2 border-amber-500 rounded-lg">
          <div className="absolute inset-2 border border-amber-400 rounded-lg">
            
            {/* Header */}
            <div className="text-center pt-8 pb-4">
              <div className="flex justify-center items-center gap-4 mb-4">
                <Award className="w-12 h-12 text-amber-600" />
                <h1 className="text-4xl font-bold text-amber-700 font-cairo">شهادة إتمام</h1>
                <Award className="w-12 h-12 text-amber-600" />
              </div>
              <p className="text-xl text-gray-600 font-cairo">أكاديمية التميز للتدريب</p>
            </div>

            {/* Main Content */}
            <div className="text-center px-8 py-6 space-y-6">
              <div className="space-y-2">
                <p className="text-lg text-gray-700 font-cairo">نشهد بأن</p>
                <h2 className="text-3xl font-bold text-primary font-cairo border-b-2 border-amber-300 pb-2 mx-12">
                  {certificateData.studentName}
                </h2>
              </div>

              <div className="space-y-2">
                <p className="text-lg text-gray-700 font-cairo">قد أكمل بنجاح دورة</p>
                <h3 className="text-2xl font-semibold text-gray-800 font-cairo bg-amber-50 py-3 px-6 rounded-lg mx-8">
                  {certificateData.courseTitle}
                </h3>
              </div>

              {certificateData.grade && (
                <div className="flex justify-center items-center gap-2">
                  <span className="text-lg text-gray-700 font-cairo">بدرجة</span>
                  <span className="text-2xl font-bold text-green-600">{certificateData.grade}%</span>
                </div>
              )}

              <div className="flex justify-center items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="font-cairo">تاريخ الإكمال: {formatDate(certificateData.completionDate)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="text-center">
                {certificateData.instructorName && (
                  <>
                    <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
                    <p className="text-sm text-gray-600 font-cairo">المدرب</p>
                    <p className="font-semibold text-gray-800 font-cairo">{certificateData.instructorName}</p>
                  </>
                )}
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-gray-500">رقم الشهادة: {certificateData.certificateId}</p>
              </div>

              <div className="text-center">
                <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
                <p className="text-sm text-gray-600 font-cairo">إدارة الأكاديمية</p>
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-amber-500 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-amber-500 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-amber-500 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-amber-500 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-600" />
              <div>
                <h3 className="font-semibold font-cairo">تنزيل الشهادة</h3>
                <p className="text-sm text-muted-foreground font-cairo">
                  احفظ شهادتك كصورة عالية الجودة
                </p>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="bg-gradient-primary hover:shadow-glow font-cairo"
            >
              <Download className="w-4 h-4 ml-2" />
              تنزيل الشهادة
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 font-cairo mb-2">معلومات الشهادة:</h4>
            <div className="grid gap-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-cairo">اسم الطالب: {certificateData.studentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-cairo">الدورة: {certificateData.courseTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-cairo">تاريخ الإكمال: {formatDate(certificateData.completionDate)}</span>
              </div>
              {certificateData.grade && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="font-cairo">الدرجة: {certificateData.grade}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};