
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus, Search } from 'lucide-react';

const Subject = () => {
  const { subjects, addSubject } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject({ name: newSubjectName.trim() });
      setNewSubjectName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} className="mr-2" /> Add New Subject
        </Button>
      </div>

      {showAddForm && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
            <CardDescription>Enter the details for the new subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium mb-1">Subject Name</label>
                <Input
                  id="subjectName"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button onClick={handleAddSubject}>Save Subject</Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
          <CardDescription>View and manage all the subjects in your school.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-sm">Subject ID</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Subject Name</th>
                  <th className="py-3 px-4 text-right font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{subject.id}</td>
                      <td className="py-3 px-4 flex items-center">
                        <FileText size={18} className="mr-2 text-blue-500" />
                        {subject.name}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      No subjects found. Add a new subject to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subject;
