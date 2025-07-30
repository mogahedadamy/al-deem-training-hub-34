import { ExamQuestion } from "@/types/exam";

// Example exam questions for different courses
export const examQuestions: Record<string, ExamQuestion[]> = {
  "python-basics": [
    {
      id: "py-q1",
      question: "ما هو الأمر المستخدم لطباعة النص في Python؟",
      options: ["echo", "print", "display", "show"],
      correctAnswer: 1,
      explanation: "الأمر print() هو الأمر المستخدم لطباعة النص في Python"
    },
    {
      id: "py-q2", 
      question: "أي من هذه الأنواع يستخدم لتخزين الأرقام الصحيحة؟",
      options: ["str", "float", "int", "bool"],
      correctAnswer: 2,
      explanation: "النوع int يستخدم لتخزين الأرقام الصحيحة"
    },
    {
      id: "py-q3",
      question: "ما هو المتغير الصحيح في Python؟",
      options: ["2variable", "variable-name", "variable_name", "variable name"],
      correctAnswer: 2,
      explanation: "أسماء المتغيرات في Python يمكن أن تحتوي على أحرف وأرقام وشرطة سفلية ولا تبدأ برقم"
    },
    {
      id: "py-q4",
      question: "أي من هذه العبارات تستخدم للتحقق من الشروط؟",
      options: ["for", "while", "if", "def"],
      correctAnswer: 2,
      explanation: "العبارة if تستخدم للتحقق من الشروط في Python"
    },
    {
      id: "py-q5",
      question: "ما هو الرمز المستخدم للتعليقات في Python؟",
      options: ["//", "/*", "#", "<!--"],
      correctAnswer: 2,
      explanation: "الرمز # يستخدم للتعليقات في Python"
    },
    {
      id: "py-q6",
      question: "أي من هذه الدوال تستخدم لقراءة المدخلات من المستخدم؟",
      options: ["input()", "read()", "get()", "scan()"],
      correctAnswer: 0,
      explanation: "الدالة input() تستخدم لقراءة المدخلات من المستخدم"
    },
    {
      id: "py-q7",
      question: "ما هو نوع البيانات المناسب لتخزين قائمة من العناصر؟",
      options: ["string", "integer", "list", "boolean"],
      correctAnswer: 2,
      explanation: "نوع list يستخدم لتخزين قائمة من العناصر"
    },
    {
      id: "py-q8",
      question: "أي من هذه العمليات تستخدم للجمع في Python؟",
      options: ["&", "+", "add", "sum"],
      correctAnswer: 1,
      explanation: "الرمز + يستخدم للجمع في Python"
    },
    {
      id: "py-q9",
      question: "ما هو الأمر المستخدم لإنشاء دالة في Python؟",
      options: ["function", "def", "create", "func"],
      correctAnswer: 1,
      explanation: "الكلمة المفتاحية def تستخدم لإنشاء دالة في Python"
    },
    {
      id: "py-q10",
      question: "أي من هذه القيم تعتبر False في Python؟",
      options: ["1", "True", "0", "\"hello\""],
      correctAnswer: 2,
      explanation: "القيمة 0 تعتبر False في Python"
    }
  ],
  
  "web-development": [
    {
      id: "web-q1",
      question: "ما هي لغة الترميز المستخدمة لإنشاء هيكل صفحات الويب؟",
      options: ["CSS", "JavaScript", "HTML", "PHP"],
      correctAnswer: 2,
      explanation: "HTML هي لغة الترميز المستخدمة لإنشاء هيكل صفحات الويب"
    },
    {
      id: "web-q2",
      question: "أي من هذه اللغات تستخدم لتنسيق مظهر صفحات الويب؟",
      options: ["HTML", "CSS", "JavaScript", "Python"],
      correctAnswer: 1,
      explanation: "CSS تستخدم لتنسيق مظهر صفحات الويب"
    },
    {
      id: "web-q3",
      question: "ما هو العنصر الرئيسي في صفحة HTML؟",
      options: ["<body>", "<head>", "<html>", "<title>"],
      correctAnswer: 2,
      explanation: "العنصر <html> هو العنصر الرئيسي الذي يحتوي على كامل المحتوى"
    },
    {
      id: "web-q4",
      question: "أي من هذه الخصائص تستخدم لتغيير لون النص في CSS؟",
      options: ["background-color", "color", "font-color", "text-color"],
      correctAnswer: 1,
      explanation: "الخاصية color تستخدم لتغيير لون النص في CSS"
    },
    {
      id: "web-q5",
      question: "ما هو العنصر المستخدم لإنشاء رابط في HTML؟",
      options: ["<link>", "<url>", "<a>", "<href>"],
      correctAnswer: 2,
      explanation: "العنصر <a> يستخدم لإنشاء الروابط في HTML"
    },
    {
      id: "web-q6",
      question: "أي من هذه الطرق تستخدم لربط ملف CSS بصفحة HTML؟",
      options: ["<style>", "<css>", "<link>", "<import>"],
      correctAnswer: 2,
      explanation: "العنصر <link> يستخدم لربط ملفات CSS الخارجية"
    },
    {
      id: "web-q7",
      question: "ما هي اللغة المستخدمة لإضافة التفاعل لصفحات الويب؟",
      options: ["HTML", "CSS", "JavaScript", "XML"],
      correctAnswer: 2,
      explanation: "JavaScript تستخدم لإضافة التفاعل والحركة لصفحات الويب"
    },
    {
      id: "web-q8",
      question: "أي من هذه العناصر يستخدم لإدراج صورة؟",
      options: ["<image>", "<img>", "<picture>", "<photo>"],
      correctAnswer: 1,
      explanation: "العنصر <img> يستخدم لإدراج الصور في HTML"
    },
    {
      id: "web-q9",
      question: "ما هو البروتوكول الأساسي لنقل صفحات الويب؟",
      options: ["FTP", "SMTP", "HTTP", "TCP"],
      correctAnswer: 2,
      explanation: "HTTP هو البروتوكول الأساسي لنقل صفحات الويب"
    },
    {
      id: "web-q10",
      question: "أي من هذه الطرق تستخدم لتحديد عنصر بواسطة ID في CSS؟",
      options: [".element", "#element", "*element", "@element"],
      correctAnswer: 1,
      explanation: "الرمز # يستخدم لتحديد عنصر بواسطة ID في CSS"
    }
  ],

  "data-science": [
    {
      id: "ds-q1",
      question: "ما هي المكتبة الأكثر استخداماً لتحليل البيانات في Python؟",
      options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
      correctAnswer: 1,
      explanation: "Pandas هي المكتبة الأكثر استخداماً لتحليل ومعالجة البيانات"
    },
    {
      id: "ds-q2",
      question: "ما هو الهدف من Machine Learning؟",
      options: ["تخزين البيانات", "تعلم الأنماط من البيانات", "إنشاء قواعد البيانات", "تصميم المواقع"],
      correctAnswer: 1,
      explanation: "الهدف من Machine Learning هو تعلم الأنماط من البيانات لعمل تنبؤات"
    },
    {
      id: "ds-q3",
      question: "أي من هذه المقاييس يستخدم لقياس دقة نموذج التصنيف؟",
      options: ["MSE", "RMSE", "Accuracy", "R-squared"],
      correctAnswer: 2,
      explanation: "Accuracy يستخدم لقياس دقة نماذج التصنيف"
    },
    {
      id: "ds-q4",
      question: "ما هو الفرق بين Supervised و Unsupervised Learning؟",
      options: [
        "لا يوجد فرق",
        "Supervised يستخدم بيانات مُصنفة مسبقاً",
        "Unsupervised أسرع",
        "Supervised للنصوص فقط"
      ],
      correctAnswer: 1,
      explanation: "Supervised Learning يستخدم بيانات مُصنفة مسبقاً للتدريب"
    },
    {
      id: "ds-q5",
      question: "أي من هذه الخوارزميات تستخدم للتصنيف؟",
      options: ["K-Means", "Linear Regression", "Decision Tree", "PCA"],
      correctAnswer: 2,
      explanation: "Decision Tree هي خوارزمية تصنيف"
    },
    {
      id: "ds-q6",
      question: "ما هو الغرض من Data Preprocessing؟",
      options: [
        "تقليل حجم البيانات فقط",
        "تنظيف وتحضير البيانات للتحليل",
        "زيادة البيانات",
        "حذف البيانات"
      ],
      correctAnswer: 1,
      explanation: "Data Preprocessing يهدف لتنظيف وتحضير البيانات للتحليل"
    },
    {
      id: "ds-q7",
      question: "ما هي أفضل طريقة للتعامل مع القيم المفقودة؟",
      options: [
        "حذف جميع الصفوف",
        "تجاهلها",
        "استبدالها بالمتوسط أو الوسيط",
        "تحويلها لصفر"
      ],
      correctAnswer: 2,
      explanation: "استبدال القيم المفقودة بالمتوسط أو الوسيط هو أحد الطرق الشائعة"
    },
    {
      id: "ds-q8",
      question: "أي من هذه المكتبات تستخدم لرسم البيانات؟",
      options: ["Pandas", "NumPy", "Matplotlib", "Requests"],
      correctAnswer: 2,
      explanation: "Matplotlib هي مكتبة رسم البيانات في Python"
    },
    {
      id: "ds-q9",
      question: "ما هو Overfitting في Machine Learning؟",
      options: [
        "النموذج يعمل بشكل مثالي",
        "النموذج يحفظ بيانات التدريب ولا يعمم جيداً",
        "النموذج بطيء",
        "النموذج يحتاج بيانات أكثر"
      ],
      correctAnswer: 1,
      explanation: "Overfitting يحدث عندما يحفظ النموذج بيانات التدريب ولا يعمم على بيانات جديدة"
    },
    {
      id: "ds-q10",
      question: "أي من هذه الطرق تستخدم لتقليل أبعاد البيانات؟",
      options: ["Linear Regression", "PCA", "K-Means", "Decision Tree"],
      correctAnswer: 1,
      explanation: "PCA (Principal Component Analysis) تستخدم لتقليل أبعاد البيانات"
    }
  ]
};

export const getExamQuestions = (courseId: string): ExamQuestion[] => {
  return examQuestions[courseId] || [];
};