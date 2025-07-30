import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Shield, GraduationCap, UserCheck } from 'lucide-react';

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string;
  roles: Array<{
    id: string;
    role: 'admin' | 'instructor' | 'student';
    assigned_at: string;
  }>;
}

const roleIcons = {
  admin: Shield,
  instructor: GraduationCap,
  student: UserCheck
};

const roleLabels = {
  admin: 'مشرف',
  instructor: 'مدرب',
  student: 'طالب'
};

export const RoleManager: React.FC = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningRole, setAssigningRole] = useState<string | null>(null);

  // Only admins can access this component
  if (!hasRole('admin')) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground font-cairo">غير مصرح لك بالوصول لهذه الصفحة</p>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) {
        throw profilesError;
      }

      // Get user roles separately  
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role, assigned_at');

      if (rolesError) {
        throw rolesError;
      }

      // Combine data
      const usersWithRoles: UserWithRoles[] = profiles?.map(profile => {
        const roles = userRoles?.filter(role => role.user_id === profile.id) || [];
        return {
          id: profile.id,
          email: `user${profile.id.slice(0, 8)}@example.com`, // Temporary email display
          full_name: profile.full_name,
          roles: roles.map(role => ({
            id: role.id,
            role: role.role,
            assigned_at: role.assigned_at
          }))
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('فشل في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: 'admin' | 'instructor' | 'student') => {
    try {
      setAssigningRole(userId);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });

      if (error) {
        throw error;
      }

      toast.success(`تم تعيين دور ${roleLabels[role]} بنجاح`);
      await loadUsers();
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast.error('فشل في تعيين الدور');
    } finally {
      setAssigningRole(null);
    }
  };

  const removeRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        throw error;
      }

      toast.success('تم حذف الدور بنجاح');
      await loadUsers();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error('فشل في حذف الدور');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-cairo">جاري تحميل المستخدمين...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cairo">
          <Users className="w-5 h-5" />
          إدارة أدوار المستخدمين
        </CardTitle>
        <CardDescription className="font-cairo">
          تعيين وإدارة أدوار المستخدمين في النظام
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold font-cairo">{user.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select onValueChange={(role) => assignRole(user.id, role as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="إضافة دور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="font-cairo">مشرف</SelectItem>
                      <SelectItem value="instructor" className="font-cairo">مدرب</SelectItem>
                      <SelectItem value="student" className="font-cairo">طالب</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {assigningRole === user.id && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => {
                  const Icon = roleIcons[role.role];
                  return (
                    <Badge
                      key={role.id}
                      variant="secondary"
                      className="flex items-center gap-1 font-cairo"
                    >
                      <Icon className="w-3 h-3" />
                      {roleLabels[role.role]}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeRole(role.id)}
                      >
                        ×
                      </Button>
                    </Badge>
                  );
                })}
                
                {user.roles.length === 0 && (
                  <Badge variant="outline" className="font-cairo">
                    لا توجد أدوار
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-cairo">لا يوجد مستخدمون</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};