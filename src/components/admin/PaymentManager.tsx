import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Eye, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/currency';

interface StudentInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

interface CourseInfo {
  id: string;
  title: string;
}

export const PaymentManager = () => {
  const { state, verifyPayment, rejectPayment, getAllTransactions, loadTransactions } = usePayment();
  const { state: authState } = useAuth();
  const [students, setStudents] = useState<{ [key: string]: StudentInfo }>({});
  const [courses, setCourses] = useState<{ [key: string]: CourseInfo }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Load students and courses data
  useEffect(() => {
    const loadStudentsAndCourses = async () => {
      try {
        // Load students
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .order('full_name');

        const studentsMap: { [key: string]: StudentInfo } = {};
        studentsData?.forEach(student => {
          studentsMap[student.id] = {
            id: student.id,
            full_name: student.full_name,
            email: 'متاح في لوحة المشرف',
            phone: student.phone
          };
        });
        setStudents(studentsMap);

        // Load courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title')
          .order('title');

        const coursesMap: { [key: string]: CourseInfo } = {};
        coursesData?.forEach(course => {
          coursesMap[course.id] = course;
        });
        setCourses(coursesMap);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadStudentsAndCourses();
  }, []);

  const handleVerifyPayment = async (transactionId: string) => {
    if (!authState.user?.id) return;
    
    setIsLoading(true);
    const success = await verifyPayment(transactionId, authState.user.id);
    if (success) {
      await loadTransactions();
    }
    setIsLoading(false);
  };

  const handleRejectPayment = async (transactionId: string) => {
    if (!authState.user?.id || !rejectionReason.trim()) {
      toast.error('يرجى إدخال سبب الرفض');
      return;
    }
    
    setIsLoading(true);
    const success = await rejectPayment(transactionId, authState.user.id, rejectionReason);
    if (success) {
      setRejectionReason('');
      await loadTransactions();
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verification_submitted':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">في انتظار التحقق</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">مؤكد</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">مرفوض</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  const filteredTransactions = getAllTransactions().filter(transaction => {
    const student = students[transaction.userId];
    const course = courses[transaction.courseId];
    
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportTransactions = () => {
    const csvContent = [
      ['التاريخ', 'الطالب', 'البريد الإلكتروني', 'الدورة', 'رقم المعاملة', 'المبلغ', 'الحالة'],
      ...filteredTransactions.map(transaction => [
        new Date(transaction.submittedAt).toLocaleDateString('ar-EG'),
        students[transaction.userId]?.full_name || 'غير معروف',
        students[transaction.userId]?.email || 'غير متاح',
        courses[transaction.courseId]?.title || 'غير معروف',
        transaction.transactionId,
        formatCurrency(transaction.amount, transaction.currency),
        transaction.status === 'verified' ? 'مؤكد' : 
        transaction.status === 'rejected' ? 'مرفوض' : 'في انتظار التحقق'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-cairo">إدارة المدفوعات</h2>
          <p className="text-muted-foreground font-cairo">مراجعة وتأكيد المدفوعات المرسلة من الطلاب</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadTransactions}
            disabled={state.isLoading}
            className="font-cairo"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button
            variant="outline"
            onClick={exportTransactions}
            className="font-cairo"
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-cairo">إجمالي المعاملات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAllTransactions().length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-cairo">في انتظار التحقق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {getAllTransactions().filter(t => t.status === 'verification_submitted').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-cairo">المعاملات المؤكدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getAllTransactions().filter(t => t.status === 'verified').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-cairo">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                getAllTransactions()
                  .filter(t => t.status === 'verified')
                  .reduce((sum, t) => sum + t.amount, 0),
                'SDG'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث في المعاملات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 font-cairo"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] font-cairo">
            <Filter className="w-4 h-4 ml-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="verification_submitted">في انتظار التحقق</SelectItem>
            <SelectItem value="verified">مؤكد</SelectItem>
            <SelectItem value="rejected">مرفوض</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground font-cairo">لا توجد معاملات مطابقة للبحث</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => {
            const student = students[transaction.userId];
            const course = courses[transaction.courseId];
            
            return (
              <Card key={transaction.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg font-cairo">
                          {student?.full_name || 'طالب غير معروف'}
                        </h3>
                        {getStatusBadge(transaction.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p className="font-cairo">
                          <span className="font-medium">البريد الإلكتروني:</span> {student?.email || 'غير متاح'}
                        </p>
                        <p className="font-cairo">
                          <span className="font-medium">الهاتف:</span> {student?.phone || 'غير متاح'}
                        </p>
                        <p className="font-cairo">
                          <span className="font-medium">الدورة:</span> {course?.title || 'دورة غير معروفة'}
                        </p>
                        <p className="font-cairo">
                          <span className="font-medium">رقم المعاملة:</span> {transaction.transactionId}
                        </p>
                        <p className="font-cairo">
                          <span className="font-medium">المبلغ:</span> {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <p className="font-cairo">
                          <span className="font-medium">تاريخ الإرسال:</span> {new Date(transaction.submittedAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      
                      {transaction.notes && (
                        <p className="text-sm font-cairo">
                          <span className="font-medium">ملاحظات:</span> {transaction.notes}
                        </p>
                      )}
                      
                      {transaction.rejectionReason && (
                        <p className="text-sm text-red-600 font-cairo">
                          <span className="font-medium">سبب الرفض:</span> {transaction.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      {transaction.receiptImage && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedImage(transaction.receiptImage!)}
                              className="font-cairo"
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              عرض الإيصال
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-cairo">إيصال الدفع</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center">
                              <img
                                src={transaction.receiptImage}
                                alt="إيصال الدفع"
                                className="max-w-full max-h-[500px] object-contain rounded-lg"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {transaction.status === 'verification_submitted' && (
                        <>
                          <Button
                            onClick={() => handleVerifyPayment(transaction.id)}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 font-cairo"
                            size="sm"
                          >
                            <Check className="w-4 h-4 ml-2" />
                            تأكيد
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="font-cairo"
                              >
                                <X className="w-4 h-4 ml-2" />
                                رفض
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="font-cairo">رفض الدفعة</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="اكتب سبب رفض الدفعة..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  className="font-cairo"
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleRejectPayment(transaction.id)}
                                    disabled={isLoading || !rejectionReason.trim()}
                                    className="font-cairo"
                                  >
                                    رفض الدفعة
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};