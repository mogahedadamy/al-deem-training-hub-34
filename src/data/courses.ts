import { Shield, TrendingUp, CheckSquare, BookOpen, Settings, Users } from "lucide-react";
import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "english-language",
    title: "كورسات اللغة الإنجليزية",
    description: "دورات شاملة لتعلم اللغة الإنجليزية من المستوى المبتدئ إلى المتقدم",
    icon: BookOpen,
    duration: "6 أسابيع",
    level: "جميع المستويات",
    price: "25,000 ج.س",
    rating: 4.8,
    students: 320,
    badge: "الأكثر طلباً",
    gradient: "from-primary to-secondary",
    thumbnail: "/lovable-uploads/069f09a8-bc56-4d2e-b341-8897fcf9b0e5.png",
    features: [
      "قواعد اللغة الإنجليزية",
      "المحادثة والنطق",
      "الكتابة الأكاديمية",
      "شهادة معتمدة دولياً"
    ],
    instructor: {
      name: "د. سارة محمد",
      avatar: "/instructors/sara-mohamed.jpg",
      bio: "خبيرة تدريس اللغة الإنجليزية مع أكثر من 12 عاماً من الخبرة",
      experience: "12 سنة"
    },
    lessons: [
      {
        id: "english-lesson-1",
        title: "أساسيات اللغة الإنجليزية",
        description: "مقدمة في القواعد الأساسية والمفردات",
        duration: 60,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=english1",
          textContent: "تعلم أساسيات اللغة الإنجليزية..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "اللغات",
    language: "العربية والإنجليزية",
    totalHours: 48,
    certificate: true,
    prerequisites: []
  },
  {
    id: "volunteer-work",
    title: "كورسات العمل الطوعي",
    description: "تعلم مبادئ العمل التطوعي وإدارة المشاريع الخيرية",
    icon: Users,
    duration: "3 أسابيع",
    level: "مبتدئ",
    price: "مجاني",
    rating: 4.9,
    students: 150,
    badge: "مجاني",
    gradient: "from-secondary to-primary",
    thumbnail: "/lovable-uploads/51892ddc-4af3-4220-b31d-fd640cbccd88.png",
    features: [
      "مبادئ العمل التطوعي",
      "إدارة المشاريع الخيرية",
      "التطوع المجتمعي",
      "شهادة تطوع"
    ],
    instructor: {
      name: "أ. أحمد السيد",
      avatar: "/instructors/ahmed-sayed.jpg",
      bio: "مختص في العمل التطوعي والمسؤولية المجتمعية",
      experience: "8 سنوات"
    },
    lessons: [
      {
        id: "volunteer-lesson-1",
        title: "مقدمة في العمل التطوعي",
        description: "أهمية العمل التطوعي في المجتمع",
        duration: 45,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=volunteer1",
          textContent: "العمل التطوعي ركيزة أساسية في بناء المجتمع..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "التنمية المجتمعية",
    language: "العربية",
    totalHours: 18,
    certificate: true,
    prerequisites: []
  },
  {
    id: "smart-board",
    title: "السبورة الذكية التفاعلية",
    description: "تعلم استخدام التكنولوجيا الحديثة في التعليم",
    icon: Settings,
    duration: "أسبوعين",
    level: "متوسط",
    price: "20,000 ج.س",
    rating: 4.7,
    students: 85,
    badge: "تقني",
    gradient: "from-primary to-accent",
    thumbnail: "/lovable-uploads/6dce5d89-3789-496c-8ad1-23ba0688ab67.png",
    features: [
      "استخدام السبورة الذكية",
      "التطبيقات التعليمية",
      "التفاعل الرقمي",
      "التقييم الإلكتروني"
    ],
    instructor: {
      name: "م. محمد علي",
      avatar: "/instructors/mohamed-ali.jpg",
      bio: "خبير في التكنولوجيا التعليمية والأدوات الرقمية",
      experience: "10 سنوات"
    },
    lessons: [
      {
        id: "smartboard-lesson-1",
        title: "مقدمة في السبورة الذكية",
        description: "التعرف على مكونات وإمكانيات السبورة الذكية",
        duration: 50,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=smartboard1",
          textContent: "السبورة الذكية أداة تعليمية متطورة..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "التكنولوجيا",
    language: "العربية",
    totalHours: 16,
    certificate: true,
    prerequisites: ["معرفة أساسية بالحاسوب"]
  },
  {
    id: "mini-mba",
    title: "الماجستير المهني المصغر في إدارة الأعمال",
    description: "برنامج مكثف في إدارة الأعمال والاستراتيجية",
    icon: TrendingUp,
    duration: "12 أسبوع",
    level: "متقدم",
    price: "85,000 ج.س",
    rating: 4.9,
    students: 45,
    badge: "متقدم",
    gradient: "from-secondary to-accent",
    thumbnail: "/lovable-uploads/8c209175-be1c-4662-a860-d8fbc512bc46.png",
    features: [
      "الإدارة الاستراتيجية",
      "التسويق والمبيعات",
      "الإدارة المالية",
      "القيادة والإدارة"
    ],
    instructor: {
      name: "د. خالد الزهراني",
      avatar: "/instructors/khalid-zahrani.jpg",
      bio: "دكتوراه في إدارة الأعمال مع خبرة عملية 20 عاماً",
      experience: "20 سنة"
    },
    lessons: [
      {
        id: "mba-lesson-1",
        title: "أساسيات إدارة الأعمال",
        description: "المفاهيم الأساسية في عالم الأعمال",
        duration: 90,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=mba1",
          textContent: "إدارة الأعمال علم وفن..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "إدارة الأعمال",
    language: "العربية",
    totalHours: 96,
    certificate: true,
    prerequisites: ["خبرة عملية 3 سنوات"]
  },
  {
    id: "crisis-management",
    title: "إدارة الأزمات والكوارث وتخطيط الوقت",
    description: "تعلم كيفية إدارة الأزمات والتخطيط الفعال",
    icon: Shield,
    duration: "4 أسابيع",
    level: "متوسط",
    price: "38,000 ج.س",
    rating: 4.8,
    students: 95,
    badge: "مطلوب",
    gradient: "from-primary to-secondary",
    thumbnail: "/lovable-uploads/7a61d005-a1b5-4e4a-8fe8-5bc7d60e70be.png",
    features: [
      "تحليل المخاطر",
      "خطط الطوارئ",
      "إدارة الوقت",
      "اتخاذ القرارات"
    ],
    instructor: {
      name: "د. فاطمة أحمد",
      avatar: "/instructors/fatima-ahmed.jpg",
      bio: "خبيرة في إدارة الأزمات والتخطيط الاستراتيجي",
      experience: "15 سنة"
    },
    lessons: [
      {
        id: "crisis-lesson-1",
        title: "مقدمة في إدارة الأزمات",
        description: "تعريف الأزمة وأنواعها",
        duration: 60,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=crisis1",
          textContent: "الأزمة حدث مفاجئ يتطلب تدخلاً سريعاً..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "الإدارة",
    language: "العربية",
    totalHours: 32,
    certificate: true,
    prerequisites: []
  },
  {
    id: "public-relations",
    title: "العلاقات العامة",
    description: "فن بناء العلاقات وإدارة سمعة المؤسسة",
    icon: Users,
    duration: "5 أسابيع",
    level: "متوسط",
    price: "32,000 ج.س",
    rating: 4.6,
    students: 78,
    badge: "شائع",
    gradient: "from-accent to-primary",
    thumbnail: "/lovable-uploads/71fc2688-a42e-4e3c-bd77-c52d5e11c083.png",
    features: [
      "إدارة السمعة",
      "التواصل الإعلامي",
      "إدارة الأحداث",
      "التسويق الرقمي"
    ],
    instructor: {
      name: "أ. نورا سالم",
      avatar: "/instructors/nora-salem.jpg",
      bio: "أخصائية علاقات عامة مع خبرة في الإعلام",
      experience: "11 سنة"
    },
    lessons: [
      {
        id: "pr-lesson-1",
        title: "أساسيات العلاقات العامة",
        description: "مفهوم العلاقات العامة ووظائفها",
        duration: 55,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=pr1",
          textContent: "العلاقات العامة جسر التواصل مع الجمهور..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "التسويق والإعلام",
    language: "العربية",
    totalHours: 35,
    certificate: true,
    prerequisites: []
  },
  {
    id: "health-safety",
    title: "الصحة والسلامة المهنية",
    description: "دورات شاملة في السلامة المهنية وإدارة المخاطر في بيئة العمل",
    icon: Shield,
    duration: "6 أسابيع",
    level: "جميع المستويات",
    price: "35,000 ج.س",
    rating: 4.9,
    students: 250,
    badge: "معتمد",
    gradient: "from-primary to-secondary",
    thumbnail: "/lovable-uploads/2383b1a4-dde9-4ced-bed0-b4252aa44764.png",
    features: [
      "قوانين السلامة المهنية",
      "تحليل المخاطر",
      "إدارة الحوادث",
      "شهادة معتمدة"
    ],
    instructor: {
      name: "د. محمد العلي",
      avatar: "/instructors/mohamed-ali.jpg",
      bio: "خبير السلامة المهنية مع أكثر من 15 عاماً من الخبرة",
      experience: "15 سنة"
    },
    lessons: [
      {
        id: "safety-lesson-1",
        title: "مقدمة في السلامة المهنية",
        description: "التعريف بأساسيات السلامة المهنية والأهداف العامة",
        duration: 45,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=safety1",
          textContent: "تعتبر السلامة المهنية من أهم الجوانب في بيئة العمل..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "السلامة المهنية",
    language: "العربية",
    totalHours: 42,
    certificate: true,
    prerequisites: []
  },
  {
    id: "pmp-project-management",
    title: "إدارة المشاريع الاحترافية (PMP)",
    description: "برنامج إعداد لشهادة PMP المعتمدة عالمياً",
    icon: Settings,
    duration: "8 أسابيع",
    level: "متقدم",
    price: "65,000 ج.س",
    rating: 4.8,
    students: 65,
    badge: "احترافي",
    gradient: "from-secondary to-accent",
    thumbnail: "/lovable-uploads/038d1880-f65c-46f0-aeac-883f2afb59e5.png",
    features: [
      "منهجية PMI",
      "تخطيط المشاريع",
      "إدارة المخاطر",
      "شهادة PMP"
    ],
    instructor: {
      name: "م. خالد الزهراني",
      avatar: "/instructors/khalid-zahrani.jpg",
      bio: "مدير مشاريع معتمد PMP مع خبرة في إدارة المشاريع الكبرى",
      experience: "20 سنة"
    },
    lessons: [
      {
        id: "pmp-lesson-1",
        title: "مقدمة في إدارة المشاريع",
        description: "أساسيات إدارة المشاريع ومنهجية PMI",
        duration: 90,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=pmp1",
          textContent: "إدارة المشاريع الاحترافية تتطلب منهجية علمية..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "إدارة المشاريع",
    language: "العربية",
    totalHours: 64,
    certificate: true,
    prerequisites: ["خبرة في إدارة المشاريع 3 سنوات"]
  },
  {
    id: "time-management",
    title: "إدارة الوقت والتدريب على إعداد خطط زمنية",
    description: "تعلم فن إدارة الوقت وإعداد الجداول الزمنية الفعالة",
    icon: CheckSquare,
    duration: "3 أسابيع",
    level: "مبتدئ",
    price: "22,000 ج.س",
    rating: 4.7,
    students: 180,
    badge: "أساسي",
    gradient: "from-primary to-accent",
    thumbnail: "/lovable-uploads/70386337-296c-4659-80fc-2a169d90a179.png",
    features: [
      "تقنيات إدارة الوقت",
      "التخطيط الزمني",
      "ترتيب الأولويات",
      "أدوات التنظيم"
    ],
    instructor: {
      name: "أ. سارة أحمد",
      avatar: "/instructors/sara-ahmed.jpg",
      bio: "مدربة معتمدة في الإنتاجية وإدارة الوقت",
      experience: "9 سنوات"
    },
    lessons: [
      {
        id: "time-lesson-1",
        title: "أساسيات إدارة الوقت",
        description: "مفهوم الوقت وأهميته في الحياة المهنية",
        duration: 50,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=time1",
          textContent: "الوقت أثمن ما يملكه الإنسان..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "التطوير الذاتي",
    language: "العربية",
    totalHours: 24,
    certificate: true,
    prerequisites: []
  },
  {
    id: "total-quality",
    title: "برامج الجودة الشاملة",
    description: "تطبيق مبادئ الجودة الشاملة في المؤسسات",
    icon: CheckSquare,
    duration: "5 أسابيع",
    level: "متوسط",
    price: "42,000 ج.س",
    rating: 4.8,
    students: 105,
    badge: "معتمد",
    gradient: "from-accent to-secondary",
    thumbnail: "/lovable-uploads/7161ea27-f60d-4df8-ad08-08cac1a92e2c.png",
    features: [
      "مبادئ الجودة الشاملة",
      "أدوات الجودة",
      "التحسين المستمر",
      "شهادة جودة"
    ],
    instructor: {
      name: "د. أحمد محمود",
      avatar: "/instructors/ahmed-mahmoud.jpg",
      bio: "خبير جودة معتمد مع خبرة في تطبيق أنظمة الجودة",
      experience: "16 سنة"
    },
    lessons: [
      {
        id: "quality-lesson-1",
        title: "مقدمة في الجودة الشاملة",
        description: "مفهوم الجودة الشاملة وأهدافها",
        duration: 60,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=quality1",
          textContent: "الجودة الشاملة فلسفة إدارية متكاملة..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "الجودة",
    language: "العربية",
    totalHours: 40,
    certificate: true,
    prerequisites: []
  },
  {
    id: "report-writing",
    title: "مهارات إعداد وكتابة التقارير",
    description: "تعلم فن كتابة التقارير المهنية والأكاديمية",
    icon: BookOpen,
    duration: "4 أسابيع",
    level: "متوسط",
    price: "28,000 ج.س",
    rating: 4.6,
    students: 125,
    badge: "عملي",
    gradient: "from-primary to-secondary",
    thumbnail: "/lovable-uploads/a4f2e052-f478-4857-924c-99805e877326.png",
    features: [
      "أنواع التقارير",
      "هيكلة التقرير",
      "اللغة المهنية",
      "العرض والتقديم"
    ],
    instructor: {
      name: "د. ليلى سالم",
      avatar: "/instructors/laila-salem.jpg",
      bio: "أستاذة اللغة العربية ومدربة في الكتابة المهنية",
      experience: "13 سنة"
    },
    lessons: [
      {
        id: "report-lesson-1",
        title: "أساسيات كتابة التقارير",
        description: "عناصر التقرير الأساسية وقواعد الكتابة",
        duration: 55,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=report1",
          textContent: "التقرير وسيلة اتصال مهنية مهمة..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "المهارات المكتبية",
    language: "العربية",
    totalHours: 32,
    certificate: true,
    prerequisites: []
  },
  {
    id: "human-resources-advanced",
    title: "إدارة الموارد البشرية",
    description: "إدارة الموارد البشرية وتطوير الكفاءات المؤسسية",
    icon: Users,
    duration: "6 أسابيع",
    level: "متوسط",
    price: "45,000 ج.س",
    rating: 4.7,
    students: 110,
    badge: "مطلوب",
    gradient: "from-secondary to-primary",
    thumbnail: "/lovable-uploads/29d65b0d-dbe1-4661-95a1-293e023ccf90.png",
    features: [
      "استقطاب المواهب",
      "تقييم الأداء",
      "التدريب والتطوير",
      "إدارة التعويضات"
    ],
    instructor: {
      name: "أ. نورا الفيصل",
      avatar: "/instructors/nora-faisal.jpg",
      bio: "أخصائية موارد بشرية معتمدة مع خبرة في التطوير التنظيمي",
      experience: "14 سنة"
    },
    lessons: [
      {
        id: "hr-advanced-lesson-1",
        title: "أساسيات إدارة الموارد البشرية",
        description: "مقدمة في إدارة الموارد البشرية والوظائف الأساسية",
        duration: 60,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=hr1",
          textContent: "إدارة الموارد البشرية هي قلب المنظمة..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "الموارد البشرية",
    language: "العربية",
    totalHours: 48,
    certificate: true,
    prerequisites: []
  },
  {
    id: "train-trainers",
    title: "تدريب المدربين (TOT)",
    description: "إعداد مدربين محترفين وتطوير مهارات التدريب",
    icon: TrendingUp,
    duration: "4 أسابيع",
    level: "متقدم",
    price: "55,000 ج.س",
    rating: 4.9,
    students: 55,
    badge: "احترافي",
    gradient: "from-accent to-primary",
    thumbnail: "/lovable-uploads/422f3c84-40ea-4587-a710-ac7e72d0b400.png",
    features: [
      "تقنيات التدريب",
      "تصميم البرامج",
      "إدارة القاعة",
      "التقييم والمتابعة"
    ],
    instructor: {
      name: "د. محمد الخطيب",
      avatar: "/instructors/mohamed-khateeb.jpg",
      bio: "خبير تدريب معتمد دولياً مع أكثر من 18 عاماً في التدريب",
      experience: "18 سنة"
    },
    lessons: [
      {
        id: "tot-lesson-1",
        title: "أساسيات التدريب",
        description: "مفهوم التدريب وخصائص المدرب الناجح",
        duration: 75,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=tot1",
          textContent: "التدريب فن ومهارة تحتاج إلى إتقان..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "التدريب والتطوير",
    language: "العربية",
    totalHours: 32,
    certificate: true,
    prerequisites: ["خبرة في التدريب أو التعليم"]
  },
  {
    id: "strategic-planning",
    title: "التخطيط الاستراتيجي وإعداد الخطط التنفيذية",
    description: "تعلم فن التخطيط الاستراتيجي وتحويل الرؤى إلى خطط قابلة للتنفيذ",
    icon: TrendingUp,
    duration: "6 أسابيع",
    level: "متقدم",
    price: "58,000 ج.س",
    rating: 4.8,
    students: 70,
    badge: "استراتيجي",
    gradient: "from-primary to-accent",
    thumbnail: "/lovable-uploads/eb1b0ef0-baae-43ce-9153-cafd151172ab.png",
    features: [
      "تحليل البيئة الاستراتيجية",
      "وضع الرؤية والرسالة",
      "الخطط التنفيذية",
      "المتابعة والتقييم"
    ],
    instructor: {
      name: "د. عبدالله الحسن",
      avatar: "/instructors/abdullah-hassan.jpg",
      bio: "استشاري التخطيط الاستراتيجي مع خبرة 22 عاماً",
      experience: "22 سنة"
    },
    lessons: [
      {
        id: "strategic-lesson-1",
        title: "مقدمة في التخطيط الاستراتيجي",
        description: "مفهوم الاستراتيجية وأهمية التخطيط",
        duration: 80,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=strategic1",
          textContent: "التخطيط الاستراتيجي خارطة طريق النجاح..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "الإدارة الاستراتيجية",
    language: "العربية",
    totalHours: 48,
    certificate: true,
    prerequisites: ["خبرة إدارية 5 سنوات"]
  },
  {
    id: "warehouse-accounting",
    title: "إدارة المخازن والمحاسبة المالية",
    description: "إدارة المخازن المتقدمة والمحاسبة المالية المتكاملة",
    icon: BookOpen,
    duration: "7 أسابيع",
    level: "متوسط",
    price: "48,000 ج.س",
    rating: 4.7,
    students: 90,
    badge: "تطبيقي",
    gradient: "from-secondary to-accent",
    thumbnail: "/lovable-uploads/5bf4061e-4070-45c6-a8a7-e5a65a3a1b6d.png",
    features: [
      "أنظمة إدارة المخازن",
      "المحاسبة المالية",
      "التكاليف والتسعير",
      "التقارير المالية"
    ],
    instructor: {
      name: "أ. فاطمة سالم",
      avatar: "/instructors/fatima-salem.jpg",
      bio: "محاسبة معتمدة ومدربة في الأنظمة المالية وإدارة المخازن",
      experience: "12 سنة"
    },
    lessons: [
      {
        id: "warehouse-lesson-1",
        title: "أساسيات إدارة المخازن",
        description: "مبادئ إدارة المخازن والتحكم في المخزون",
        duration: 65,
        type: "video",
        content: {
          videoUrl: "https://www.youtube.com/watch?v=warehouse1",
          textContent: "إدارة المخازن علم يتطلب دقة وتنظيماً..."
        },
        isCompleted: false,
        order: 1
      }
    ],
    category: "المحاسبة والمالية",
    language: "العربية",
    totalHours: 56,
    certificate: true,
    prerequisites: ["معرفة أساسية بالمحاسبة"]
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return courses.filter(course => course.category === category);
};

export const searchCourses = (query: string): Course[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return courses;
  
  return courses.filter(course => 
    course.title.toLowerCase().includes(normalizedQuery) ||
    course.description.toLowerCase().includes(normalizedQuery) ||
    course.category.toLowerCase().includes(normalizedQuery) ||
    course.instructor.name.toLowerCase().includes(normalizedQuery) ||
    course.features.some(feature => feature.toLowerCase().includes(normalizedQuery))
  );
};

export const filterCourses = (filters: {
  category?: string;
  level?: string;
  price?: 'free' | 'paid';
  rating?: number;
}): Course[] => {
  return courses.filter(course => {
    if (filters.category && course.category !== filters.category) return false;
    if (filters.level && course.level !== filters.level) return false;
    if (filters.price === 'free' && course.price !== 'مجاني') return false;
    if (filters.price === 'paid' && course.price === 'مجاني') return false;
    if (filters.rating && course.rating < filters.rating) return false;
    return true;
  });
};

export const getCategories = (): string[] => {
  return [...new Set(courses.map(course => course.category))];
};

export const getLevels = (): string[] => {
  return [...new Set(courses.map(course => course.level))];
};

export const getPopularCourses = (limit: number = 3): Course[] => {
  return [...courses]
    .sort((a, b) => b.students - a.students)
    .slice(0, limit);
};

export const getFreeCourses = (): Course[] => {
  return courses.filter(course => course.price === 'مجاني');
};