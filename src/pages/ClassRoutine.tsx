
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown, Clock, Plus } from 'lucide-react';

// Mock class routine data
const mockRoutine = [
  { id: '1', day: 'Monday', period: '1', time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: '101' },
  { id: '2', day: 'Monday', period: '2', time: '09:15 - 10:15', subject: 'Science', teacher: 'Ms. Smith', room: '102' },
  { id: '3', day: 'Monday', period: '3', time: '10:30 - 11:30', subject: 'English', teacher: 'Mrs. Davis', room: '103' },
  { id: '4', day: 'Monday', period: '4', time: '11:45 - 12:45', subject: 'History', teacher: 'Mr. Wilson', room: '104' },
  { id: '5', day: 'Tuesday', period: '1', time: '08:00 - 09:00', subject: 'Science', teacher: 'Ms. Smith', room: '102' },
  { id: '6', day: 'Tuesday', period: '2', time: '09:15 - 10:15', subject: 'Mathematics', teacher: 'Mr. Johnson', room: '101' },
  { id: '7', day: 'Tuesday', period: '3', time: '10:30 - 11:30', subject: 'Physical Education', teacher: 'Mr. Brown', room: 'Gym' },
  { id: '8', day: 'Tuesday', period: '4', time: '11:45 - 12:45', subject: 'Art', teacher: 'Ms. Lee', room: '105' },
  { id: '9', day: 'Wednesday', period: '1', time: '08:00 - 09:00', subject: 'English', teacher: 'Mrs. Davis', room: '103' },
  { id: '10', day: 'Wednesday', period: '2', time: '09:15 - 10:15', subject: 'History', teacher: 'Mr. Wilson', room: '104' },
  { id: '11', day: 'Wednesday', period: '3', time: '10:30 - 11:30', subject: 'Mathematics', teacher: 'Mr. Johnson', room: '101' },
  { id: '12', day: 'Wednesday', period: '4', time: '11:45 - 12:45', subject: 'Science', teacher: 'Ms. Smith', room: '102' },
  { id: '13', day: 'Thursday', period: '1', time: '08:00 - 09:00', subject: 'Art', teacher: 'Ms. Lee', room: '105' },
  { id: '14', day: 'Thursday', period: '2', time: '09:15 - 10:15', subject: 'English', teacher: 'Mrs. Davis', room: '103' },
  { id: '15', day: 'Thursday', period: '3', time: '10:30 - 11:30', subject: 'Science', teacher: 'Ms. Smith', room: '102' },
  { id: '16', day: 'Thursday', period: '4', time: '11:45 - 12:45', subject: 'Mathematics', teacher: 'Mr. Johnson', room: '101' },
  { id: '17', day: 'Friday', period: '1', time: '08:00 - 09:00', subject: 'History', teacher: 'Mr. Wilson', room: '104' },
  { id: '18', day: 'Friday', period: '2', time: '09:15 - 10:15', subject: 'Physical Education', teacher: 'Mr. Brown', room: 'Gym' },
  { id: '19', day: 'Friday', period: '3', time: '10:30 - 11:30', subject: 'English', teacher: 'Mrs. Davis', room: '103' },
  { id: '20', day: 'Friday', period: '4', time: '11:45 - 12:45', subject: 'Science', teacher: 'Ms. Smith', room: '102' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ClassRoutine = () => {
  const { classrooms } = useData();
  const [selectedClass, setSelectedClass] = useState(classrooms[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Filter routine by selected day
  const filteredRoutine = mockRoutine.filter(item => item.day === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Class Routine</h1>
        <Button>
          <Plus size={16} className="mr-2" /> Add New Schedule
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Class Schedule</CardTitle>
          <CardDescription>View and manage class schedules for all days of the week.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Select Class</label>
              <div className="relative">
                <select
                  className="w-full h-10 pl-3 pr-10 rounded-md border border-input bg-background text-sm"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Academic Year</label>
              <div className="relative">
                <select className="w-full h-10 pl-3 pr-10 rounded-md border border-input bg-background text-sm">
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2021-2022">2021-2022</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="grid grid-cols-5">
              {days.map((day) => (
                <TabsTrigger key={day} value={day}>
                  <CalendarDays size={16} className="mr-2" />
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
            {days.map((day) => (
              <TabsContent key={day} value={day} className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium text-sm">Period</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">Time</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">Subject</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">Teacher</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoutine.length > 0 ? (
                        filteredRoutine.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{item.period}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center text-gray-600">
                                <Clock size={16} className="mr-2" />
                                {item.time}
                              </div>
                            </td>
                            <td className="py-3 px-4">{item.subject}</td>
                            <td className="py-3 px-4">{item.teacher}</td>
                            <td className="py-3 px-4">{item.room}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No classes scheduled for this day.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassRoutine;
