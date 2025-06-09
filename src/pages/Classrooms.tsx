
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Classrooms: React.FC = () => {
  const { schools, classrooms, students, addClassroom } = useData();
  
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    schoolId: ''
  });
  
  // Filtered classrooms based on selected school
  const filteredClassrooms = selectedSchoolId 
    ? classrooms.filter(classroom => classroom.schoolId === selectedSchoolId)
    : classrooms;
  
  // Count students in each classroom
  const countStudentsInClassroom = (classroomId: string) => {
    return students.filter(student => student.classroomId === classroomId).length;
  };
  
  // Get school name
  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : "Unknown";
  };
  
  // Handle new classroom input change
  const handleNewClassroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClassroom({
      ...newClassroom,
      [name]: value
    });
  };
  
  // Handle new classroom form submission
  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    addClassroom(newClassroom);
    setNewClassroom({
      name: '',
      schoolId: ''
    });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Classrooms</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Classroom</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Classroom</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClassroom}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Classroom Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter classroom name"
                    value={newClassroom.name}
                    onChange={handleNewClassroomChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolId">School</Label>
                  <Select
                    name="schoolId"
                    value={newClassroom.schoolId}
                    onValueChange={(value) => {
                      setNewClassroom({...newClassroom, schoolId: value});
                    }}
                  >
                    <SelectTrigger id="schoolId">
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Classroom</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Classroom Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filter-school">Filter by School</Label>
            <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
              <SelectTrigger id="filter-school">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredClassrooms.map((classroom) => (
              <Card key={classroom.id} className="overflow-hidden">
                <div className="bg-primary text-primary-foreground p-4">
                  <h3 className="text-lg font-medium">{classroom.name}</h3>
                  <p className="text-sm text-primary-foreground/80">{getSchoolName(classroom.schoolId)}</p>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span>Students:</span>
                    <span className="font-bold">{countStudentsInClassroom(classroom.id)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredClassrooms.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No classrooms found with the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Classrooms;
