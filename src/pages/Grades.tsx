
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Grades: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    schools, 
    classrooms, 
    subjects, 
    students, 
    grades, 
    recordGrade,
    getClassroomsBySchool, 
    getStudentsByClassroom 
  } = useData();
  
  // State for grade entry
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  
  // Derived data
  const filteredClassrooms = selectedSchoolId 
    ? getClassroomsBySchool(selectedSchoolId)
    : [];
    
  const filteredStudents = selectedClassroomId
    ? getStudentsByClassroom(selectedClassroomId)
    : [];

  // Get student grades - for student users
  const studentGrades = currentUser?.role === 'student'
    ? grades.filter(grade => grade.studentId === currentUser.id)
    : [];
    
  // Handle school change
  const handleSchoolChange = (value: string) => {
    setSelectedSchoolId(value);
    setSelectedClassroomId("");
    setSelectedStudentId("");
  };
  
  // Handle classroom change
  const handleClassroomChange = (value: string) => {
    setSelectedClassroomId(value);
    setSelectedStudentId("");
  };
  
  // Submit grade
  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gradeData = {
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      score: parseFloat(score),
      term: term,
    };
    
    recordGrade(gradeData);
    
    // Reset form
    setSelectedStudentId("");
    setScore("");
  };
  
  // Get formatted subject name
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };
  
  // Get formatted student name
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Grades Management</h1>

      {currentUser?.role === 'student' ? (
        <Card>
          <CardHeader>
            <CardTitle>My Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {studentGrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Term</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map((grade) => (
                      <tr key={grade.id}>
                        <td>{getSubjectName(grade.subjectId)}</td>
                        <td>{grade.term}</td>
                        <td className="font-medium">{grade.score.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No grades recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="enter-grades">
          <TabsList className="mb-4">
            <TabsTrigger value="enter-grades">Enter Grades</TabsTrigger>
            <TabsTrigger value="view-grades">View Grades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enter-grades">
            <Card>
              <CardHeader>
                <CardTitle>Enter New Grade</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmitGrade}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Student Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="student">Student</Label>
                      <Select 
                        value={selectedStudentId} 
                        onValueChange={setSelectedStudentId}
                        disabled={!selectedClassroomId}
                      >
                        <SelectTrigger id="student">
                          <SelectValue placeholder={selectedClassroomId ? "Select student" : "First select a classroom"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Subject Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select 
                        value={selectedSubjectId} 
                        onValueChange={setSelectedSubjectId}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Score */}
                    <div className="space-y-2">
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="Enter score"
                      />
                    </div>
                    
                    {/* Term */}
                    <div className="space-y-2">
                      <Label htmlFor="term">Term</Label>
                      <Select 
                        value={term} 
                        onValueChange={setTerm}
                      >
                        <SelectTrigger id="term">
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-Q1">2023 Q1</SelectItem>
                          <SelectItem value="2023-Q2">2023 Q2</SelectItem>
                          <SelectItem value="2023-Q3">2023 Q3</SelectItem>
                          <SelectItem value="2023-Q4">2023 Q4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button 
                    type="submit"
                    disabled={
                      !selectedStudentId || 
                      !selectedSubjectId || 
                      !score || 
                      !term
                    }
                  >
                    Save Grade
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="view-grades">
            <Card>
              <CardHeader>
                <CardTitle>View Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* School Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="filter-school">Filter by School</Label>
                      <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
                        <SelectTrigger id="filter-school">
                          <SelectValue placeholder="Select school" />
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
                    
                    {/* Classroom Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="filter-classroom">Filter by Classroom</Label>
                      <Select 
                        value={selectedClassroomId} 
                        onValueChange={handleClassroomChange}
                        disabled={!selectedSchoolId}
                      >
                        <SelectTrigger id="filter-classroom">
                          <SelectValue placeholder={selectedSchoolId ? "Select classroom" : "First select a school"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Classrooms</SelectItem>
                          {filteredClassrooms.map((classroom) => (
                            <SelectItem key={classroom.id} value={classroom.id}>
                              {classroom.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Grades Table */}
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Subject</th>
                          <th>Term</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades
                          .filter(grade => {
                            // Apply classroom filter if selected
                            if (selectedClassroomId) {
                              const student = students.find(s => s.id === grade.studentId);
                              return student?.classroomId === selectedClassroomId;
                            }
                            // Apply school filter if selected
                            if (selectedSchoolId) {
                              const student = students.find(s => s.id === grade.studentId);
                              const classroom = classrooms.find(c => c.id === student?.classroomId);
                              return classroom?.schoolId === selectedSchoolId;
                            }
                            return true;
                          })
                          .map((grade) => (
                            <tr key={grade.id}>
                              <td>{getStudentName(grade.studentId)}</td>
                              <td>{getSubjectName(grade.subjectId)}</td>
                              <td>{grade.term}</td>
                              <td className="font-medium">{grade.score.toFixed(1)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {grades.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No grades recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Grades;
