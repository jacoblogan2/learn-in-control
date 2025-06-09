
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Attendance: React.FC = () => {
  const { schools, classrooms, students, recordAttendance, getClassroomsBySchool, getStudentsByClassroom } = useData();
  
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [studentAttendance, setStudentAttendance] = useState<{
    [studentId: string]: "Present" | "Absent";
  }>({});

  const filteredClassrooms = selectedSchoolId 
    ? getClassroomsBySchool(selectedSchoolId)
    : [];

  const filteredStudents = selectedClassroomId
    ? getStudentsByClassroom(selectedClassroomId)
    : [];

  const handleSchoolChange = (value: string) => {
    setSelectedSchoolId(value);
    setSelectedClassroomId("");
    setStudentAttendance({});
  };

  const handleClassroomChange = (value: string) => {
    setSelectedClassroomId(value);
    
    // Initialize attendance status for all students in this classroom
    const studentsInClass = getStudentsByClassroom(value);
    const initialAttendance: { [key: string]: "Present" | "Absent" } = {};
    studentsInClass.forEach(student => {
      initialAttendance[student.id] = "Present";
    });
    setStudentAttendance(initialAttendance);
  };

  const handleAttendanceChange = (studentId: string, status: "Present" | "Absent") => {
    setStudentAttendance({
      ...studentAttendance,
      [studentId]: status,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format attendance records
    const attendanceRecords = Object.entries(studentAttendance).map(([studentId, status]) => ({
      studentId,
      date: attendanceDate,
      status,
    }));
    
    // Submit attendance
    recordAttendance(attendanceRecords);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Record Attendance</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* School Selection */}
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
                  <SelectTrigger id="school">
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
              
              {/* Classroom Selection */}
              <div className="space-y-2">
                <Label htmlFor="classroom">Classroom</Label>
                <Select 
                  value={selectedClassroomId} 
                  onValueChange={handleClassroomChange}
                  disabled={!selectedSchoolId}
                >
                  <SelectTrigger id="classroom">
                    <SelectValue placeholder={selectedSchoolId ? "Select classroom" : "First select a school"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClassrooms.map((classroom) => (
                      <SelectItem key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <input
                  type="date"
                  id="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </div>
            </div>
            
            {selectedClassroomId && filteredStudents.length > 0 ? (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Mark Attendance</h3>
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="border-b pb-3">
                      <div className="font-medium mb-1">{student.name}</div>
                      <RadioGroup
                        value={studentAttendance[student.id] || "Present"}
                        onValueChange={(value) => 
                          handleAttendanceChange(student.id, value as "Present" | "Absent")
                        }
                        className="flex"
                      >
                        <div className="flex items-center space-x-2 mr-6">
                          <RadioGroupItem value="Present" id={`present-${student.id}`} />
                          <Label htmlFor={`present-${student.id}`}>Present</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Absent" id={`absent-${student.id}`} />
                          <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedClassroomId ? (
              <div className="text-center py-4">No students found in this classroom.</div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Select a school and classroom to mark attendance
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button 
              type="submit"
              disabled={!selectedClassroomId || filteredStudents.length === 0}
            >
              Save Attendance
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Attendance;
