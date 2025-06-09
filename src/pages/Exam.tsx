
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
import { Calendar, ChevronDown, FileText, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock exam data
const mockExams = [
  { id: '1', name: 'Mid-Term Examination', subject: 'Mathematics', classroom: 'Class 10-A', date: '2023-10-15', time: '09:00 - 11:00', totalMarks: 100 },
  { id: '2', name: 'Mid-Term Examination', subject: 'Science', classroom: 'Class 10-A', date: '2023-10-16', time: '09:00 - 11:00', totalMarks: 100 },
  { id: '3', name: 'Mid-Term Examination', subject: 'English', classroom: 'Class 10-A', date: '2023-10-17', time: '09:00 - 11:00', totalMarks: 100 },
  { id: '4', name: 'Mid-Term Examination', subject: 'History', classroom: 'Class 10-A', date: '2023-10-18', time: '09:00 - 11:00', totalMarks: 100 },
  { id: '5', name: 'Final Examination', subject: 'Mathematics', classroom: 'Class 10-A', date: '2023-12-10', time: '09:00 - 12:00', totalMarks: 100 },
  { id: '6', name: 'Final Examination', subject: 'Science', classroom: 'Class 10-A', date: '2023-12-12', time: '09:00 - 12:00', totalMarks: 100 },
  { id: '7', name: 'Final Examination', subject: 'English', classroom: 'Class 10-A', date: '2023-12-14', time: '09:00 - 12:00', totalMarks: 100 },
  { id: '8', name: 'Final Examination', subject: 'History', classroom: 'Class 10-A', date: '2023-12-16', time: '09:00 - 12:00', totalMarks: 100 },
];

const examTypes = [
  'All Exams',
  'Mid-Term Examination',
  'Final Examination',
  'Unit Test',
  'Quiz'
];

const Exam = () => {
  const { classrooms } = useData();
  const [selectedType, setSelectedType] = useState('All Exams');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(classrooms[0]?.id || '');
  const [selectedYear, setSelectedYear] = useState('2023');

  // Filter exams by selected type and search term
  const filteredExams = mockExams.filter(exam => 
    (selectedType === 'All Exams' || exam.name === selectedType) &&
    (exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
     exam.classroom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Examinations</h1>
        <Button>
          <Plus size={16} className="mr-2" /> Add New Exam
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
          <CardDescription>View and manage examination schedules for all classes.</CardDescription>
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
                <select
                  className="w-full h-10 pl-3 pr-10 rounded-md border border-input bg-background text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2023">2023-2024</option>
                  <option value="2022">2022-2023</option>
                  <option value="2021">2021-2022</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="All Exams" onValueChange={setSelectedType}>
            <TabsList className="mb-4">
              {examTypes.map((type) => (
                <TabsTrigger key={type} value={type}>
                  <FileText size={16} className="mr-2" />
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-3 px-4 text-left font-medium text-sm">Exam Name</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Subject</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Class</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Date</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Time</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Total Marks</th>
                    <th className="py-3 px-4 text-center font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                      <tr key={exam.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{exam.name}</td>
                        <td className="py-3 px-4">{exam.subject}</td>
                        <td className="py-3 px-4">{exam.classroom}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {exam.date}
                          </div>
                        </td>
                        <td className="py-3 px-4">{exam.time}</td>
                        <td className="py-3 px-4">{exam.totalMarks}</td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No exams found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Exam;
