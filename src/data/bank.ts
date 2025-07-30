import { BankDetails } from "@/types/payment";

export const bankDetails: BankDetails = {
  accountNumber: "1234567",
  accountName: "أكاديمية التميز للتدريب",
  bankName: "بنك فيصل الإسلامي السوداني",
  branch: "الفرع الرئيسي - الخرطوم"
};

export const paymentInstructions = [
  "قم بتحويل المبلغ المطلوب إلى الحساب المصرفي أعلاه",
  "احتفظ بإشعار التحويل أو لقطة شاشة من العملية",
  "أدخل رقم العملية المكون من 4 أرقام",
  "قم برفع صورة واضحة لإشعار التحويل",
  "انتظر التحقق من الدفعة خلال 24 ساعة"
];