import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CreditCard, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Copy,
  ImageIcon
} from 'lucide-react';
import { courses } from '@/data/courses';
import { bankDetails, paymentInstructions } from '@/data/bank';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatPrice } from '@/utils/currency';
import { toast } from 'sonner';

const PaymentPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { submitPaymentVerification } = usePayment();
  const { state: authState } = useAuth();
  
  const [transactionId, setTransactionId] = useState('');
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return <div>الدورة غير موجودة</div>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة صحيح');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
        return;
      }
      
      setReceiptImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId || transactionId.length !== 4) {
      toast.error('يرجى إدخال رقم العملية المكون من 4 أرقام');
      return;
    }
    
    if (!receiptImage) {
      toast.error('يرجى رفع صورة إشعار التحويل');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await submitPaymentVerification(
        courseId!,
        transactionId,
        receiptPreview,
        notes
      );
      
      if (success) {
        navigate(`/course/${courseId}`, { 
          state: { paymentSubmitted: true } 
        });
      }
    } catch (error) {
      console.error('Payment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    toast.success('تم نسخ رقم الحساب');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/course/${courseId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للدورة
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary font-cairo">
              دفع رسوم الدورة
            </h1>
            <p className="text-muted-foreground font-cairo">
              {course.title}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Info & Bank Details */}
          <div className="space-y-6">
            {/* Course Summary */}
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cairo">
                  <CreditCard className="w-5 h-5 text-primary" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-cairo">الدورة التدريبية:</span>
                  <span className="font-medium font-cairo">{course.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-cairo">المدة:</span>
                  <span className="font-medium font-cairo">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-cairo">المستوى:</span>
                  <Badge variant="secondary" className="font-cairo">{course.level}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="font-cairo">المبلغ الإجمالي:</span>
                  <span className="text-primary font-cairo">{formatPrice(course.price)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cairo">
                  <Info className="w-5 h-5 text-primary" />
                  بيانات الحساب البنكي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-cairo">اسم البنك:</span>
                      <span className="font-medium font-cairo">{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-cairo">اسم الحساب:</span>
                      <span className="font-medium font-cairo">{bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-cairo">رقم الحساب:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg font-cairo">{bankDetails.accountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyAccountNumber}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {bankDetails.branch && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-cairo">الفرع:</span>
                        <span className="font-medium font-cairo">{bankDetails.branch}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cairo">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  تعليمات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {paymentInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm font-cairo">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cairo">
                  <Upload className="w-5 h-5 text-primary" />
                  تأكيد الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <Label htmlFor="transactionId" className="font-cairo">
                      رقم العملية <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="transactionId"
                      type="text"
                      placeholder="0000"
                      value={transactionId}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setTransactionId(value);
                      }}
                      maxLength={4}
                      className="text-center text-lg font-mono"
                      required
                    />
                    <p className="text-xs text-muted-foreground font-cairo">
                      أدخل آخر 4 أرقام من رقم العملية
                    </p>
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-2">
                    <Label className="font-cairo">
                      صورة إشعار التحويل <span className="text-red-500">*</span>
                    </Label>
                    <div
                      className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {receiptPreview ? (
                        <div className="space-y-2">
                          <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
                          />
                          <p className="text-sm text-green-600 font-cairo">تم رفع الصورة بنجاح</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                          <p className="text-muted-foreground font-cairo">
                            اضغط لرفع صورة إشعار التحويل
                          </p>
                          <p className="text-xs text-muted-foreground font-cairo">
                            PNG, JPG أو JPEG (حد أقصى 5 ميجابايت)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-cairo">ملاحظات (اختياري)</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات إضافية حول عملية التحويل..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-20 font-cairo"
                    />
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 font-cairo">تنبيه مهم:</p>
                        <p className="text-yellow-700 font-cairo">
                          تأكد من صحة جميع البيانات قبل الإرسال. سيتم مراجعة طلبك خلال 24 ساعة.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !transactionId || !receiptImage}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-cairo"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        جاري الإرسال...
                      </div>
                    ) : (
                      'إرسال طلب التحقق'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;