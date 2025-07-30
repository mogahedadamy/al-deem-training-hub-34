import { useState } from 'react';
import { Download, Share2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CertificateTemplate } from './CertificateTemplate';
import { useToast } from '@/hooks/use-toast';

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  courseHours: number;
  certificateId: string;
}

interface CertificateViewerProps {
  data: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

export const CertificateViewer = ({
  data,
  onDownload,
  onShare,
  className
}: CertificateViewerProps) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const { toast } = useToast();

  const handleDownload = () => {
    // Simulate PDF download
    onDownload?.();
    toast({
      title: "تم التحميل",
      description: "تم تحميل الشهادة بصيغة PDF بنجاح",
    });
  };

  const handleShare = () => {
    // Simulate sharing functionality
    if (navigator.share) {
      navigator.share({
        title: `شهادة إتمام دورة ${data.courseName}`,
        text: `حصلت على شهادة إتمام دورة ${data.courseName}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الشهادة إلى الحافظة",
      });
    }
    onShare?.();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={className}>
      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            >
              {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {isPreviewVisible ? 'إخفاء المعاينة' : 'عرض المعاينة'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 size={16} />
              مشاركة
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              طباعة
            </Button>
            
            <Button
              size="sm"
              onClick={handleDownload}
            >
              <Download size={16} />
              تحميل PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Certificate Preview */}
      {isPreviewVisible && (
        <Card className="p-8 bg-gray-50">
          <div className="print:p-0 print:bg-white">
            <CertificateTemplate data={data} />
          </div>
        </Card>
      )}

      {/* Certificate Info */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">تفاصيل الشهادة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">اسم الطالب:</span>
            <span className="mr-2">{data.studentName}</span>
          </div>
          <div>
            <span className="font-medium">اسم الدورة:</span>
            <span className="mr-2">{data.courseName}</span>
          </div>
          <div>
            <span className="font-medium">تاريخ الإتمام:</span>
            <span className="mr-2">{data.completionDate}</span>
          </div>
          <div>
            <span className="font-medium">المدرب:</span>
            <span className="mr-2">{data.instructorName}</span>
          </div>
          <div>
            <span className="font-medium">عدد الساعات:</span>
            <span className="mr-2">{data.courseHours} ساعة</span>
          </div>
          <div>
            <span className="font-medium">رقم الشهادة:</span>
            <span className="mr-2">{data.certificateId}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};