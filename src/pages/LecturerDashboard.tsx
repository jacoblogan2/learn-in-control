
import React from 'react';
import { 
  GraduationCap, Layers, Book, FileText as LucideFileText
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

const LecturerDashboard = () => {
  const { currentUser } = useAuth();

  const lecturerStats = [
    { title: 'My Students', count: '45', icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'My Classes', count: '5', icon: <Layers size={24} />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Subjects', count: '3', icon: <Book size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Reports', count: '12', icon: <LucideFileText size={24} />, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome, {currentUser?.firstName} {currentUser?.lastName}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lecturerStats.map((stat, index) => (
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
    </div>
  );
};

export default LecturerDashboard;
