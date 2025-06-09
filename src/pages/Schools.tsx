
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Schools: React.FC = () => {
  const { schools, classrooms, students, addSchool, getClassroomsBySchool } = useData();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    location: ''
  });
  
  // Count classrooms in a school
  const countClassroomsInSchool = (schoolId: string) => {
    return classrooms.filter(classroom => classroom.schoolId === schoolId).length;
  };
  
  // Count students in a school
  const countStudentsInSchool = (schoolId: string) => {
    const schoolClassrooms = classrooms.filter(classroom => classroom.schoolId === schoolId);
    return students.filter(student => 
      student.classroomId && schoolClassrooms.some(c => c.id === student.classroomId)
    ).length;
  };
  
  // Handle new school input change
  const handleNewSchoolChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSchool({
      ...newSchool,
      [name]: value
    });
  };
  
  // Handle new school form submission
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    addSchool(newSchool);
    setNewSchool({
      name: '',
      location: ''
    });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schools</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add School</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSchool}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter school name"
                    value={newSchool.name}
                    onChange={handleNewSchoolChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Textarea
                    id="location"
                    name="location"
                    placeholder="Enter school address"
                    value={newSchool.location}
                    onChange={handleNewSchoolChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add School</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Card key={school.id} className="overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4">
              <h3 className="text-xl font-bold">{school.name}</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                <p>{school.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold">{countClassroomsInSchool(school.id)}</p>
                  <p className="text-sm text-muted-foreground">Classrooms</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{countStudentsInSchool(school.id)}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {schools.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No schools have been added yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Schools;
