import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Header from "@/components/Header";

export default function InstructorDashboard() {
  const { state } = useAuth();

  useEffect(() => {
    document.title = "لوحة المدرب | إدارة الدورات";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "لوحة المدرب لإدارة الدورات والمناقشات والرسائل الصوتية");
  }, []);

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 font-cairo">لوحة المدرب</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="font-cairo">مرحباً {state.user?.profile?.full_name || state.user?.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground font-cairo">
                من هنا يمكنك إدارة دوراتك، متابعة أسئلة الطلاب، وإرسال رسائل صوتية في المناقشات.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard"><Button className="font-cairo">دوراتي</Button></Link>
                <Link to="/"><Button variant="outline" className="font-cairo">الصفحة الرئيسية</Button></Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-cairo">إرشادات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground font-cairo">
              <p>• يمكن للمدرب فقط إرسال الرسائل الصوتية داخل قسم المناقشة.</p>
              <p>• الطلاب يستطيعون القراءة والرد نصيًا فقط.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
