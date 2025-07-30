import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  Settings,
  Users,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Mail,
  Phone,
  Award,
  BookOpen,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { PaymentTransaction } from '@/types/payment';
import { courses } from '@/data/courses';
import { formatPrice } from '@/utils/currency';
import { mockUsers } from '@/data/users';
import { User } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

const AdminPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, verifyPayment, rejectPayment, getPendingTransactions } = usePayment();
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('payments');

  // Users state
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  const pendingTransactions = getPendingTransactions();
  
  const filteredTransactions = state.transactions.filter(transaction => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
  });

  const handleVerifyPayment = async (transactionId: string) => {
    const success = await verifyPayment(transactionId, 'admin-1');
    if (success) {
      setIsDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleRejectPayment = async (transactionId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال سبب الرفض",
        variant: "destructive",
      });
      return;
    }
    
    const success = await rejectPayment(transactionId, 'admin-1', rejectionReason);
    if (success) {
      setIsDialogOpen(false);
      setSelectedTransaction(null);
      setRejectionReason('');
    }
  };

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'دورة غير معروفة';
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    toast({
      title: "نجح تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
    navigate('/admin/login');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state.transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-transactions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast({
      title: "نجح التصدير",
      description: "تم تصدير البيانات بنجاح",
    });
  };

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'في انتظار الإرسال', icon: Clock },
      verification_submitted: { variant: 'default' as const, label: 'في انتظار المراجعة', icon: Clock },
      verified: { variant: 'default' as const, label: 'مؤكدة', icon: CheckCircle },
      rejected: { variant: 'destructive' as const, label: 'مرفوضة', icon: XCircle }
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge 
        variant={config.variant} 
        className="flex items-center gap-1 font-cairo"
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getRecentActivity = () => {
    return state.transactions
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation Header */}
      <div className="bg-gradient-card border-b shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-secondary font-cairo">
                  لوحة تحكم المدير
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-cairo hidden sm:block">
                  إدارة شاملة للنظام
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground font-cairo hidden md:block">
                مرحباً، المدير
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="font-cairo text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
                <span className="sm:hidden">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 max-w-6xl py-4 sm:py-6">
        {/* Tabs Navigation */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-card">
            <TabsTrigger value="payments" className="font-cairo text-xs sm:text-sm px-2 sm:px-4">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">إدارة المدفوعات</span>
              <span className="sm:hidden">المدفوعات</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-cairo text-xs sm:text-sm px-2 sm:px-4">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">التقارير والإحصائيات</span>
              <span className="sm:hidden">التقارير</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="font-cairo text-xs sm:text-sm px-2 sm:px-4">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">إدارة المستخدمين</span>
              <span className="sm:hidden">المستخدمين</span>
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-secondary font-cairo">
                  إدارة المدفوعات
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground font-cairo">
                  مراجعة وتأكيد طلبات الدفع
                </p>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportData}
                  className="font-cairo text-xs sm:text-sm flex-shrink-0"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">تصدير البيانات</span>
                  <span className="sm:hidden">تصدير</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="font-cairo text-xs sm:text-sm flex-shrink-0"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">تحديث</span>
                  <span className="sm:hidden">تحديث</span>
                </Button>
              </div>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-cairo truncate">في انتظار المراجعة</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary font-cairo">
                    {pendingTransactions.length}
                  </p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-cairo truncate">مؤكدة</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 font-cairo">
                    {state.transactions.filter(t => t.status === 'verified').length}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-cairo truncate">مرفوضة</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600 font-cairo">
                    {state.transactions.filter(t => t.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-cairo truncate">إجمالي المبلغ</p>
                  <p className="text-lg sm:text-2xl font-bold text-secondary font-cairo">
                    {formatPrice(state.transactions
                      .filter(t => t.status === 'verified')
                      .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-full flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-card bg-gradient-card mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="font-cairo text-sm">البحث</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="ابحث برقم العملية أو معرف المعاملة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-cairo text-sm"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="status-filter" className="font-cairo text-sm">فلترة حسب الحالة</Label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md font-cairo text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="verification_submitted">في انتظار المراجعة</option>
                  <option value="verified">مؤكدة</option>
                  <option value="rejected">مرفوضة</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Transactions Table */}
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="font-cairo text-lg sm:text-xl">جميع المعاملات</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="hidden sm:table-header-group">
                  <tr className="border-b">
                    <th className="text-right p-2 sm:p-4 font-cairo text-sm">رقم العملية</th>
                    <th className="text-right p-2 sm:p-4 font-cairo text-sm">الدورة</th>
                    <th className="text-right p-2 sm:p-4 font-cairo text-sm">المبلغ</th>
                    <th className="text-right p-2 sm:p-4 font-cairo text-sm">الحالة</th>
                    <th className="text-right p-2 sm:p-4 font-cairo text-sm">تاريخ الإرسال</th>
                    <th className="text-center p-2 sm:p-4 font-cairo text-sm">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50 sm:table-row flex flex-col gap-2 p-3 sm:p-0">
                      {/* Mobile Card Layout */}
                      <td className="sm:hidden w-full">
                        <div className="bg-muted/20 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-muted-foreground font-cairo">رقم العملية</p>
                              <p className="font-mono font-bold text-sm">{transaction.transactionId}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getStatusBadge(transaction.status)}
                              <Dialog open={isDialogOpen && selectedTransaction?.id === transaction.id} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTransaction(transaction)}
                                    className="font-cairo text-xs"
                                  >
                                    <Eye className="w-3 h-3 ml-1" />
                                    مراجعة
                                  </Button>
                                </DialogTrigger>
                                {/* ... keep existing dialog content */}
                              </Dialog>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground font-cairo">الدورة</p>
                              <p className="font-cairo">{getCourseTitle(transaction.courseId)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-cairo">المبلغ</p>
                              <p className="font-bold font-cairo">{formatPrice(transaction.amount)}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground font-cairo">تاريخ الإرسال</p>
                              <p className="font-cairo">{new Date(transaction.submittedAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Desktop Table Layout */}
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <span className="font-mono font-bold text-sm">
                          {transaction.transactionId}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <span className="font-cairo text-sm">
                          {getCourseTitle(transaction.courseId)}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <span className="font-bold font-cairo text-sm">
                          {formatPrice(transaction.amount)}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <span className="text-xs sm:text-sm text-muted-foreground font-cairo">
                          {new Date(transaction.submittedAt).toLocaleDateString('ar-SA')}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 text-center hidden sm:table-cell">
                        <Dialog open={isDialogOpen && selectedTransaction?.id === transaction.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction)}
                              className="font-cairo text-xs sm:text-sm"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                              مراجعة
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-cairo">
                                مراجعة طلب الدفع - {transaction.transactionId}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedTransaction && (
                              <div className="space-y-6">
                                {/* Transaction Details */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="font-cairo">رقم العملية</Label>
                                    <p className="font-mono font-bold text-lg">
                                      {selectedTransaction.transactionId}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-cairo">المبلغ</Label>
                                    <p className="font-bold text-lg font-cairo">
                                      {formatPrice(selectedTransaction.amount)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-cairo">الدورة</Label>
                                    <p className="font-cairo">
                                      {getCourseTitle(selectedTransaction.courseId)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-cairo">تاريخ الإرسال</Label>
                                    <p className="font-cairo">
                                      {new Date(selectedTransaction.submittedAt).toLocaleString('ar-SA')}
                                    </p>
                                  </div>
                                </div>

                                {/* Receipt Image */}
                                {selectedTransaction.receiptImage && (
                                  <div>
                                    <Label className="font-cairo">صورة الإشعار</Label>
                                    <div className="mt-2 border rounded-lg p-4">
                                      <img
                                        src={selectedTransaction.receiptImage}
                                        alt="Receipt"
                                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                {selectedTransaction.notes && (
                                  <div>
                                    <Label className="font-cairo">ملاحظات العميل</Label>
                                    <p className="mt-1 p-3 bg-muted rounded-lg font-cairo">
                                      {selectedTransaction.notes}
                                    </p>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                {selectedTransaction.status === 'verification_submitted' && (
                                  <div className="space-y-4">
                                    <div className="flex gap-4">
                                      <Button
                                        onClick={() => handleVerifyPayment(selectedTransaction.id)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 font-cairo"
                                      >
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                        تأكيد الدفعة
                                      </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="rejection-reason" className="font-cairo">
                                        سبب الرفض (في حالة الرفض)
                                      </Label>
                                      <Textarea
                                        id="rejection-reason"
                                        placeholder="اكتب سبب رفض الدفعة..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="font-cairo"
                                      />
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRejectPayment(selectedTransaction.id)}
                                        className="w-full font-cairo"
                                        disabled={!rejectionReason.trim()}
                                      >
                                        <XCircle className="w-4 h-4 ml-2" />
                                        رفض الدفعة
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Status Info for processed transactions */}
                                {selectedTransaction.status !== 'verification_submitted' && (
                                  <div className="p-4 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      {getStatusBadge(selectedTransaction.status)}
                                    </div>
                                    {selectedTransaction.verifiedAt && (
                                      <p className="text-sm text-muted-foreground font-cairo">
                                        تمت المعالجة في: {new Date(selectedTransaction.verifiedAt).toLocaleString('ar-SA')}
                                      </p>
                                    )}
                                    {selectedTransaction.rejectionReason && (
                                      <div className="mt-2">
                                        <Label className="font-cairo">سبب الرفض:</Label>
                                        <p className="text-red-600 font-cairo">
                                          {selectedTransaction.rejectionReason}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-cairo">لا توجد معاملات</p>
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="border-0 shadow-card bg-gradient-card md:col-span-2">
              <CardHeader>
                <CardTitle className="font-cairo">الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground font-cairo">
                  📊 رسم بياني للإيرادات (قريباً)
                </div>
              </CardContent>
            </Card>

            {/* Top Courses */}
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-cairo">أشهر الدورات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.slice(0, 3).map((course, index) => (
                    <div key={course.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm font-cairo">{course.title}</p>
                        <p className="text-xs text-muted-foreground font-cairo">
                          {Math.floor(Math.random() * 50) + 10} طالب
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-card bg-gradient-card md:col-span-3">
              <CardHeader>
                <CardTitle className="font-cairo">النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentActivity().map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold font-cairo">
                            طلب دفع جديد - {transaction.transactionId}
                          </p>
                          <p className="text-sm text-muted-foreground font-cairo">
                            {getCourseTitle(transaction.courseId)} - {formatPrice(transaction.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        {getStatusBadge(transaction.status)}
                        <p className="text-xs text-muted-foreground font-cairo mt-1">
                          {new Date(transaction.submittedAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          {/* Users Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-cairo">إجمالي المستخدمين</p>
                    <CardTitle className="font-cairo text-lg sm:text-2xl">{users.length}</CardTitle>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-cairo">المستخدمين النشطين</p>
                    <CardTitle className="font-cairo text-lg sm:text-2xl">{users.filter(u => u.enrolledCourses.length > 0).length}</CardTitle>
                  </div>
                  <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-cairo">الشهادات الممنوحة</p>
                    <CardTitle className="font-cairo text-lg sm:text-2xl">{users.reduce((total, user) => total + user.certificates.length, 0)}</CardTitle>
                  </div>
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-cairo">إجمالي الدورات</p>
                    <CardTitle className="font-cairo text-lg sm:text-2xl">{users.reduce((total, user) => total + user.enrolledCourses.length, 0)}</CardTitle>
                  </div>
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Users Management */}
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="font-cairo text-lg sm:text-xl">إدارة المستخدمين</CardTitle>
                  <p className="text-sm text-muted-foreground font-cairo">
                    إدارة حسابات المستخدمين وتتبع نشاطاتهم
                  </p>
                </div>
                <Button 
                  variant="default"
                  className="font-cairo text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">إضافة مستخدم جديد</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Label htmlFor="userSearch" className="font-cairo text-sm">البحث</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="userSearch"
                      placeholder="ابحث باسم المستخدم أو البريد الإلكتروني..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 font-cairo text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-cairo text-right text-xs sm:text-sm">المستخدم</TableHead>
                        <TableHead className="font-cairo text-right text-xs sm:text-sm hidden sm:table-cell">البريد الإلكتروني</TableHead>
                        <TableHead className="font-cairo text-right text-xs sm:text-sm">الدورات</TableHead>
                        <TableHead className="font-cairo text-right text-xs sm:text-sm hidden sm:table-cell">الشهادات</TableHead>
                        <TableHead className="font-cairo text-right text-xs sm:text-sm">تاريخ الانضمام</TableHead>
                        <TableHead className="font-cairo text-right text-xs sm:text-sm">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                          <TableCell className="py-2 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="font-cairo text-xs">
                                  {user.name.split(' ')[0]?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-cairo font-medium text-xs sm:text-sm truncate">
                                  {user.name}
                                </p>
                                <p className="font-cairo text-xs text-muted-foreground sm:hidden truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-cairo text-xs sm:text-sm hidden sm:table-cell">
                            {user.email}
                          </TableCell>
                          <TableCell className="font-cairo text-xs sm:text-sm">
                            <div className="flex flex-col gap-1">
                              <span>{user.enrolledCourses.length} مسجل</span>
                              <span className="text-green-600">{user.completedCourses.length} مكتمل</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-cairo text-xs sm:text-sm hidden sm:table-cell">
                            <Badge variant="secondary" className="font-cairo">
                              {user.certificates.length}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-cairo text-xs sm:text-sm">
                            {new Date(user.joinDate).toLocaleDateString('ar-SA')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserDialog(true);
                                }}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

        {/* User Details Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-cairo text-xl">تفاصيل المستخدم</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback className="font-cairo text-lg">
                      {selectedUser.name.split(' ')[0]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-cairo font-semibold text-lg">{selectedUser.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-cairo">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="font-cairo">{selectedUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedUser.bio && (
                  <div>
                    <h4 className="font-cairo font-medium mb-2">النبذة الشخصية</h4>
                    <p className="font-cairo text-sm text-muted-foreground">{selectedUser.bio}</p>
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-cairo font-semibold text-lg">{selectedUser.enrolledCourses.length}</div>
                    <div className="font-cairo text-xs text-muted-foreground">الدورات المسجلة</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-cairo font-semibold text-lg text-green-600">{selectedUser.completedCourses.length}</div>
                    <div className="font-cairo text-xs text-muted-foreground">الدورات المكتملة</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-cairo font-semibold text-lg text-yellow-600">{selectedUser.certificates.length}</div>
                    <div className="font-cairo text-xs text-muted-foreground">الشهادات</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-cairo font-semibold text-lg">
                      {selectedUser.enrolledCourses.length > 0 
                        ? Math.round((selectedUser.completedCourses.length / selectedUser.enrolledCourses.length) * 100)
                        : 0}%
                    </div>
                    <div className="font-cairo text-xs text-muted-foreground">معدل الإنجاز</div>
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div>
                  <h4 className="font-cairo font-medium mb-3">الدورات المسجلة</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedUser.enrolledCourses.map((courseId, index) => (
                      <div key={courseId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-cairo text-sm">{courseId}</span>
                        </div>
                        <Badge 
                          variant={selectedUser.completedCourses.includes(courseId) ? "default" : "secondary"}
                          className="font-cairo text-xs"
                        >
                          {selectedUser.completedCourses.includes(courseId) ? "مكتمل" : "قيد التنفيذ"}
                        </Badge>
                      </div>
                    ))}
                    {selectedUser.enrolledCourses.length === 0 && (
                      <p className="text-center text-muted-foreground font-cairo text-sm py-4">
                        لا توجد دورات مسجلة
                      </p>
                    )}
                  </div>
                </div>

                {/* Certificates */}
                {selectedUser.certificates.length > 0 && (
                  <div>
                    <h4 className="font-cairo font-medium mb-3">الشهادات المحصلة</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedUser.certificates.map((certificateId, index) => (
                        <div key={certificateId} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="font-cairo text-sm">{certificateId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Join Date */}
                <div className="text-center pt-4 border-t">
                  <p className="font-cairo text-sm text-muted-foreground">
                    عضو منذ {new Date(selectedUser.joinDate).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPayments;