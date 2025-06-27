
import React from 'react';
import { 
  Users, GraduationCap, Award, BookOpen, CreditCard, 
  School, FileText as LucideFileText, Layers, Book
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { students, teachers, classrooms, schools } = useData();

  // Stats for admin dashboard
  const adminStats = [
    { title: 'Students', count: students.length, icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Teachers', count: teachers.length, icon: <Users size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Classrooms', count: classrooms.length, icon: <Layers size={24} />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Schools', count: schools.length, icon: <School size={24} />, color: 'bg-orange-100 text-orange-600' },
    { title: 'Earnings', count: '$12,345', icon: <CreditCard size={24} />, color: 'bg-pink-100 text-pink-600' },
    { title: 'Awards', count: '24', icon: <Award size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Subjects', count: '8', icon: <Book size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Reports', count: '15', icon: <LucideFileText size={24} />, color: 'bg-red-100 text-red-600' },
  ];

  // Stats for lecturer dashboard
  const lecturerStats = [
    { title: 'My Students', count: '45', icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'My Classes', count: '5', icon: <Layers size={24} />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Subjects', count: '3', icon: <Book size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Reports', count: '12', icon: <LucideFileText size={24} />, color: 'bg-red-100 text-red-600' },
  ];

  // Stats for student dashboard
  const studentStats = [
    { title: 'Courses', count: '6', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Assignments', count: '12', icon: <LucideFileText size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Attendance', count: '95%', icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Awards', count: '3', icon: <Award size={24} />, color: 'bg-yellow-100 text-yellow-600' },
  ];

  // Select stats based on user role
  const stats = currentUser?.role === 'admin' 
    ? adminStats 
    : currentUser?.role === 'lecturer' 
      ? lecturerStats 
      : studentStats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
      
      {currentUser?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Newly admitted students this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.slice(0, 5).map((student, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Class {index + 1}</div>
                  </div>
                ))}
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
      )}
      
      {currentUser?.role === 'student' && (
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
      )}
      
      {currentUser?.role === 'lecturer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Your upcoming classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { class: 'Class 10-A', subject: 'Mathematics', time: '09:00 - 10:00', room: 'Room 101' },
                  { class: 'Class 9-B', subject: 'Mathematics', time: '10:15 - 11:15', room: 'Room 102' },
                  { class: 'Class 10-A', subject: 'Physics', time: '11:30 - 12:30', room: 'Room 103' },
                  { class: 'Class 9-A', subject: 'Mathematics', time: '13:30 - 14:30', room: 'Room 101' },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{schedule.class} - {schedule.subject}</div>
                      <div className="text-sm text-gray-500">{schedule.time}, {schedule.room}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded bg-gray-100">{schedule.subject}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Tasks that require your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { task: 'Grade Mathematics Quiz', deadline: '2023-06-15', priority: 'High' },
                  { task: 'Prepare Lesson Plan', deadline: '2023-06-16', priority: 'Medium' },
                  { task: 'Submit Monthly Report', deadline: '2023-06-20', priority: 'High' },
                  { task: 'Parent Meeting Preparation', deadline: '2023-06-22', priority: 'Medium' },
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{task.task}</div>
                      <div className="text-sm text-gray-500">Due: {task.deadline}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
