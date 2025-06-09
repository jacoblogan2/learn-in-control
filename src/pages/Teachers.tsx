
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const Teachers: React.FC = () => {
  const { teachers, subjects, classrooms, schools, addTeacher } = useData();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    subjectIds: [] as string[],
    classroomIds: [] as string[]
  });
  
  // Handle checkbox change for subjects
  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    if (checked) {
      setNewTeacher({
        ...newTeacher,
        subjectIds: [...newTeacher.subjectIds, subjectId]
      });
    } else {
      setNewTeacher({
        ...newTeacher,
        subjectIds: newTeacher.subjectIds.filter(id => id !== subjectId)
      });
    }
  };
  
  // Handle checkbox change for classrooms
  const handleClassroomChange = (classroomId: string, checked: boolean) => {
    if (checked) {
      setNewTeacher({
        ...newTeacher,
        classroomIds: [...newTeacher.classroomIds, classroomId]
      });
    } else {
      setNewTeacher({
        ...newTeacher,
        classroomIds: newTeacher.classroomIds.filter(id => id !== classroomId)
      });
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher({
      ...newTeacher,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a userId (in a real app, this would be linked to an authentication system)
    const userId = Math.random().toString(36).substring(2, 11);
    
    addTeacher({
      userId,
      subjectIds: newTeacher.subjectIds,
      classroomIds: newTeacher.classroomIds
    });
    
    setNewTeacher({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      subjectIds: [],
      classroomIds: []
    });
    
    setDialogOpen(false);
  };
  
  // Get subject names for a teacher
  const getTeacherSubjects = (subjectIds: string[]) => {
    return subjectIds
      .map(id => subjects.find(subject => subject.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };
  
  // Get classroom names for a teacher
  const getTeacherClassrooms = (classroomIds: string[]) => {
    return classroomIds
      .map(id => classrooms.find(classroom => classroom.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };
  
  // Get school names for a teacher's classrooms
  const getTeacherSchools = (classroomIds: string[]) => {
    const schoolIds = new Set<string>();
    
    classroomIds.forEach(classroomId => {
      const classroom = classrooms.find(c => c.id === classroomId);
      if (classroom?.schoolId) {
        schoolIds.add(classroom.schoolId);
      }
    });
    
    return Array.from(schoolIds)
      .map(id => schools.find(school => school.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teachers</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Teacher</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTeacher}>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      value={newTeacher.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      value={newTeacher.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={newTeacher.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Subjects</Label>
                  <div className="border rounded-md p-3 space-y-2">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`subject-${subject.id}`} 
                          checked={newTeacher.subjectIds.includes(subject.id)}
                          onCheckedChange={(checked) => 
                            handleSubjectChange(subject.id, checked as boolean)
                          }
                        />
                        <label htmlFor={`subject-${subject.id}`} className="text-sm">
                          {subject.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Classrooms</Label>
                  <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                    {classrooms.map((classroom) => {
                      const school = schools.find(s => s.id === classroom.schoolId);
                      return (
                        <div key={classroom.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`classroom-${classroom.id}`} 
                            checked={newTeacher.classroomIds.includes(classroom.id)}
                            onCheckedChange={(checked) => 
                              handleClassroomChange(classroom.id, checked as boolean)
                            }
                          />
                          <label htmlFor={`classroom-${classroom.id}`} className="text-sm">
                            {classroom.name} ({school?.name})
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit"
                  disabled={
                    !newTeacher.firstName || 
                    !newTeacher.lastName || 
                    !newTeacher.email || 
                    newTeacher.subjectIds.length === 0 || 
                    newTeacher.classroomIds.length === 0
                  }
                >
                  Add Teacher
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4">
              <h3 className="text-xl font-bold">Teacher ID: {teacher.id}</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Subjects</h4>
                <p>{getTeacherSubjects(teacher.subjectIds) || "None"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Classrooms</h4>
                <p>{getTeacherClassrooms(teacher.classroomIds) || "None"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Schools</h4>
                <p>{getTeacherSchools(teacher.classroomIds) || "None"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {teachers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No teachers have been added yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Teachers;
