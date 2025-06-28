
import React from 'react';
import { 
  BookOpen, FileText as LucideFileText, Users, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
  const { currentUser } = useAuth();

  const studentStats = [
    { title: 'Courses', count: '6', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Assignments', count: '12', icon: <LucideFileText size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Attendance', count: '95%', icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Awards', count: '3', icon: <Award size={24} />, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome, {currentUser?.firstName} {currentUser?.lastName}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studentStats.map((stat, index) => (
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
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Mathematics Assignment', date: '2023-06-15', subject: 'Mathematics' },
                { title: 'Science Project', date: '2023-06-20', subject: 'Science' },
                { title: 'English Essay', date: '2023-06-25', subject: 'English' },
              ].map((assignment, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{assignment.title}</div>
                    <div className="text-sm text-gray-500">Due: {assignment.date}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-gray-100">{assignment.subject}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Your latest assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', grade: 'A', score: '92%' },
                { subject: 'Science', grade: 'B+', score: '88%' },
                { subject: 'English', grade: 'A-', score: '90%' },
                { subject: 'History', grade: 'B', score: '85%' },
              ].map((grade, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="font-medium">{grade.subject}</div>
                  <div className="flex items-center">
                    <div className="text-sm font-bold mr-2">{grade.grade}</div>
                    <div className="text-xs text-gray-500">{grade.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
