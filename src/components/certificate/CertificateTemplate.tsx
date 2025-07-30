import { forwardRef } from 'react';
import { Award, Calendar, Verified } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCertificateTemplate } from '@/data/certificateTemplates';

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  courseHours: number;
  certificateId: string;
  courseId?: string; // معرف الدورة لاختيار الشهادة المناسبة
}

interface CertificateTemplateProps {
  data: CertificateData;
  className?: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ data, className }, ref) => {
    // الحصول على شهادة مخصصة للدورة إذا كانت متوفرة
    const customTemplate = data.courseId ? getCertificateTemplate(data.courseId) : null;

    // إذا كانت هناك شهادة مخصصة، استخدمها
    if (customTemplate) {
      return (
        <div 
          ref={ref}
          className={cn(
            "w-full max-w-4xl mx-auto relative overflow-hidden bg-white",
            "aspect-[4/3]",
            className
          )}
          dir="rtl"
        >
          {/* الشهادة الخلفية */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${customTemplate.templateImage})`,
            }}
          />
          
          {/* اسم الطالب */}
          <div 
            className="absolute text-center"
            style={{
              left: `${customTemplate.namePosition.x}%`,
              top: `${customTemplate.namePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${customTemplate.namePosition.fontSize}px`,
              fontWeight: customTemplate.namePosition.fontWeight,
              color: customTemplate.namePosition.color,
              textAlign: customTemplate.namePosition.textAlign as any,
              minWidth: '300px'
            }}
          >
            {data.studentName}
          </div>

          {/* اسم الدورة */}
          <div 
            className="absolute text-center"
            style={{
              left: `${customTemplate.coursePosition.x}%`,
              top: `${customTemplate.coursePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${customTemplate.coursePosition.fontSize}px`,
              fontWeight: customTemplate.coursePosition.fontWeight,
              color: customTemplate.coursePosition.color,
              textAlign: customTemplate.coursePosition.textAlign as any,
              minWidth: '400px'
            }}
          >
            {data.courseName}
          </div>

          {/* تاريخ الإتمام */}
          <div 
            className="absolute text-center"
            style={{
              left: `${customTemplate.datePosition.x}%`,
              top: `${customTemplate.datePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${customTemplate.datePosition.fontSize}px`,
              fontWeight: customTemplate.datePosition.fontWeight,
              color: customTemplate.datePosition.color,
              textAlign: customTemplate.datePosition.textAlign as any,
              minWidth: '200px'
            }}
          >
            {data.completionDate}
          </div>
        </div>
      );
    }

    // الشهادة الافتراضية إذا لم توجد شهادة مخصصة
    return (
      <div 
        ref={ref}
        className={cn(
          "w-full max-w-4xl mx-auto bg-white text-gray-800 relative overflow-hidden",
          "aspect-[4/3] p-12 border-8 border-primary",
          className
        )}
        dir="rtl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <div className="absolute top-0 left-0 w-32 h-32 border-4 border-primary/20 rounded-full" />
          <div className="absolute bottom-0 right-0 w-40 h-40 border-4 border-secondary/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">شهادة إتمام</h1>
          <h2 className="text-2xl font-semibold text-secondary">Certificate of Completion</h2>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-lg mb-4">نشهد بأن</p>
          <p className="text-lg mb-4 text-gray-600">This is to certify that</p>
          
          <div className="my-6">
            <h3 className="text-3xl font-bold text-primary border-b-2 border-primary inline-block pb-2 px-8">
              {data.studentName}
            </h3>
          </div>

          <p className="text-lg mb-2">قد أتم بنجاح دورة</p>
          <p className="text-lg mb-4 text-gray-600">has successfully completed the course</p>

          <div className="my-6">
            <h4 className="text-2xl font-bold text-secondary bg-secondary/10 py-3 px-6 rounded-lg inline-block">
              {data.courseName}
            </h4>
          </div>

          <div className="flex justify-center items-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>تاريخ الإتمام: {data.completionDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Verified className="w-5 h-5 text-primary" />
              <span>عدد الساعات: {data.courseHours} ساعة</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-auto relative z-10">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 px-8">
              <p className="font-semibold">{data.instructorName}</p>
              <p className="text-sm text-gray-600">المدرب</p>
            </div>
          </div>

          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 px-8">
              <p className="font-semibold">منصة التعلم</p>
              <p className="text-sm text-gray-600">Learning Platform</p>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          رقم الشهادة: {data.certificateId}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="absolute top-4 left-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <Verified className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';