import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { courses } from '@/data/courses';
import { formatPrice } from '@/utils/currency';
import { useNavigate } from 'react-router-dom';

const MyPayments = () => {
  const { state: authState } = useAuth();
  const { getUserTransactions } = usePayment();
  const navigate = useNavigate();

  if (!authState.user) {
    return <div>يرجى تسجيل الدخول أولاً</div>;
  }

  const userTransactions = getUserTransactions(authState.user.id);

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'دورة غير معروفة';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'في انتظار الإرسال', icon: Clock, color: 'text-gray-600' },
      verification_submitted: { variant: 'default' as const, label: 'في انتظار المراجعة', icon: Clock, color: 'text-blue-600' },
      verified: { variant: 'default' as const, label: 'مؤكدة', icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, label: 'مرفوضة', icon: XCircle, color: 'text-red-600' }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge 
        variant={config.variant} 
        className={`flex items-center gap-1 font-cairo ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusMessage = (status: string, rejectionReason?: string) => {
    switch (status) {
      case 'pending':
        return 'لم يتم إرسال طلب التحقق بعد';
      case 'verification_submitted':
        return 'تم إرسال طلب التحقق وهو قيد المراجعة. سيتم الرد خلال 24 ساعة.';
      case 'verified':
        return 'تم تأكيد الدفعة بنجاح! يمكنك الآن الوصول للدورة.';
      case 'rejected':
        return `تم رفض الدفعة: ${rejectionReason || 'لم يتم تحديد السبب'}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للملف الشخصي
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary font-cairo">
              مدفوعاتي
            </h1>
            <p className="text-muted-foreground font-cairo">
              تتبع حالة دفعاتك وطلبات التحقق
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-cairo">إجمالي المدفوعات</p>
                  <p className="text-2xl font-bold text-primary font-cairo">
                    {userTransactions.length}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-cairo">مؤكدة</p>
                  <p className="text-2xl font-bold text-green-600 font-cairo">
                    {userTransactions.filter(t => t.status === 'verified').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-cairo">في انتظار المراجعة</p>
                  <p className="text-2xl font-bold text-blue-600 font-cairo">
                    {userTransactions.filter(t => t.status === 'verification_submitted').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="space-y-6">
          {userTransactions.length === 0 ? (
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardContent className="p-12 text-center">
                <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold text-secondary mb-2 font-cairo">
                  لا توجد مدفوعات بعد
                </h3>
                <p className="text-muted-foreground font-cairo">
                  عندما تسجل في دورة مدفوعة، ستظهر هنا حالة الدفع
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-gradient-primary hover:shadow-glow font-cairo"
                >
                  تصفح الدورات
                </Button>
              </CardContent>
            </Card>
          ) : (
            userTransactions.map((transaction) => (
              <Card key={transaction.id} className="border-0 shadow-card bg-gradient-card hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-cairo">
                        {getCourseTitle(transaction.courseId)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-cairo">
                        رقم العملية: <span className="font-mono font-bold">{transaction.transactionId}</span>
                      </p>
                    </div>
                    <div className="text-left">
                      {getStatusBadge(transaction.status)}
                      <p className="text-lg font-bold text-secondary mt-2 font-cairo">
                        {formatPrice(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Status Message */}
                    <div className={`p-4 rounded-lg border ${
                      transaction.status === 'verified' ? 'bg-green-50 border-green-200' :
                      transaction.status === 'rejected' ? 'bg-red-50 border-red-200' :
                      transaction.status === 'verification_submitted' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`text-sm font-cairo ${
                        transaction.status === 'verified' ? 'text-green-800' :
                        transaction.status === 'rejected' ? 'text-red-800' :
                        transaction.status === 'verification_submitted' ? 'text-blue-800' :
                        'text-gray-800'
                      }`}>
                        {getStatusMessage(transaction.status, transaction.rejectionReason)}
                      </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground font-cairo">تاريخ الإرسال:</span>
                        <p className="font-medium font-cairo">
                          {new Date(transaction.submittedAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      {transaction.verifiedAt && (
                        <div>
                          <span className="text-muted-foreground font-cairo">تاريخ التأكيد:</span>
                          <p className="font-medium font-cairo">
                            {new Date(transaction.verifiedAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-2">
                        {transaction.status === 'verified' && (
                          <Button
                            onClick={() => navigate(`/course/${transaction.courseId}`)}
                            className="bg-gradient-primary hover:shadow-glow font-cairo"
                            size="sm"
                          >
                            دخول الدورة
                          </Button>
                        )}
                        {transaction.status === 'rejected' && (
                          <Button
                            onClick={() => navigate(`/payment/${transaction.courseId}`)}
                            variant="outline"
                            className="font-cairo"
                            size="sm"
                          >
                            إعادة المحاولة
                          </Button>
                        )}
                      </div>

                      {transaction.receiptImage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(transaction.receiptImage, '_blank')}
                          className="font-cairo"
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          عرض الإشعار
                        </Button>
                      )}
                    </div>

                    {/* Notes */}
                    {transaction.notes && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-muted-foreground font-cairo">ملاحظاتك:</span>
                        <p className="text-sm font-cairo">{transaction.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPayments;