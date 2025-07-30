// شهادات مخصصة لكل دورة تدريبية
export interface CertificateTemplate {
  courseId: string;
  templateImage: string;
  templateName: string;
  namePosition: {
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: string;
  };
  coursePosition: {
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: string;
  };
  datePosition: {
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: string;
  };
}

// شهادة دورة الجودة
export const certificateTemplates: CertificateTemplate[] = [
  {
    courseId: "quality-management",
    templateImage: "/lovable-uploads/34a71433-8f6a-4169-aab3-1888301d9e67.png",
    templateName: "شهادة إدارة الجودة",
    namePosition: {
      x: 50, // نسبة مئوية من عرض الشهادة
      y: 35, // نسبة مئوية من ارتفاع الشهادة
      fontSize: 24,
      fontWeight: "bold",
      color: "#2c5aa0",
      textAlign: "center"
    },
    coursePosition: {
      x: 50,
      y: 45,
      fontSize: 18,
      fontWeight: "semibold", 
      color: "#8b5a3c",
      textAlign: "center"
    },
    datePosition: {
      x: 50,
      y: 72,
      fontSize: 14,
      fontWeight: "normal",
      color: "#666666",
      textAlign: "center"
    }
  }
];

// دالة للحصول على شهادة دورة معينة
export const getCertificateTemplate = (courseId: string): CertificateTemplate | undefined => {
  return certificateTemplates.find(template => template.courseId === courseId);
};

// دالة لإضافة شهادة جديدة
export const addCertificateTemplate = (template: CertificateTemplate) => {
  const existingIndex = certificateTemplates.findIndex(t => t.courseId === template.courseId);
  if (existingIndex >= 0) {
    certificateTemplates[existingIndex] = template;
  } else {
    certificateTemplates.push(template);
  }
};