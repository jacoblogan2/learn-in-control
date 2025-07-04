
import React, { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, Award, BookOpen, CreditCard, 
  School, FileText as LucideFileText, Layers, Book
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { AdminDataService } from '@/services/adminDataService';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { students: legacyStudents, teachers: legacyTeachers, classrooms, schools } = useData();
  const [dbStats, setDbStats] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    payments: 0,
    totalEarnings: 0
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real database statistics
      const [studentsData, teachersData, parentsData, paymentsData] = await Promise.all([
        AdminDataService.getStudents(),
        AdminDataService.getTeachers(),
        AdminDataService.getParents(),
        supabase.from('payments').select('amount')
      ]);

      const totalEarnings = paymentsData.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      
      setDbStats({
        students: studentsData.data?.length || 0,
        teachers: teachersData.data?.length || 0,
        parents: parentsData.data?.length || 0,
        payments: paymentsData.data?.length || 0,
        totalEarnings
      });

      // Set recent students
      if (studentsData.data) {
        setRecentStudents(studentsData.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const adminStats = [
    { title: 'Students', count: dbStats.students, icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Teachers', count: dbStats.teachers, icon: <Users size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Parents', count: dbStats.parents, icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Schools', count: schools.length, icon: <School size={24} />, color: 'bg-orange-100 text-orange-600' },
    { title: 'Earnings', count: `$${dbStats.totalEarnings.toFixed(2)}`, icon: <CreditCard size={24} />, color: 'bg-pink-100 text-pink-600' },
    { title: 'Payments', count: dbStats.payments, icon: <Award size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Classrooms', count: classrooms.length, icon: <Layers size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Reports', count: '15', icon: <LucideFileText size={24} />, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome, {currentUser?.firstName} {currentUser?.lastName}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
          <Card key={index} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">{stat.count}</span>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-1" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Newly admitted students this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.length > 0 ? (
                recentStudents.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                      <div>
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{student.class_name || 'N/A'}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No students found. Add some students to get started!
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <a href="/students" className="text-sm text-blue-600 hover:underline">View all students</a>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notice Board</CardTitle>
            <CardDescription>Latest announcements and notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Exam Schedule Updated', date: '2023-06-15', type: 'Exam' },
                { title: 'Parent-Teacher Meeting', date: '2023-06-20', type: 'Meeting' },
                { title: 'Sports Day Announcement', date: '2023-06-25', type: 'Event' },
                { title: 'Holiday Notice', date: '2023-07-01', type: 'Holiday' },
                { title: 'Fee Payment Reminder', date: '2023-07-05', type: 'Payment' },
              ].map((notice, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{notice.title}</div>
                    <div className="text-sm text-gray-500">{notice.date}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-gray-100">{notice.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <a href="/notice" className="text-sm text-blue-600 hover:underline">View all notices</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
