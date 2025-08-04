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

// شهادات دورات الجودة و ISO
export const certificateTemplates: CertificateTemplate[] = [
  {
    courseId: "quality-management",
    templateImage: "/lovable-uploads/34a71433-8f6a-4169-aab3-1888301d9e67.png",
    templateName: "شهادة إدارة الجودة الشاملة",
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
  },
  {
    courseId: "iso-standards",
    templateImage: "/lovable-uploads/d108ca26-bf9e-4b4b-9aa6-7ddcb8db0d34.png",
    templateName: "شهادة المعايير الدولية ISO",
    namePosition: {
      x: 50,
      y: 35,
      fontSize: 24,
      fontWeight: "bold",
      color: "#1e3a8a",
      textAlign: "center"
    },
    coursePosition: {
      x: 50,
      y: 45,
      fontSize: 18,
      fontWeight: "semibold",
      color: "#92400e",
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