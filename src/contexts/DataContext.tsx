import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, Classroom, Subject, Student, Teacher, Attendance, Grade, User } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  schools: School[];
  classrooms: Classroom[];
  subjects: Subject[];
  students: Student[];
  teachers: Teacher[];
  attendanceRecords: Attendance[];
  grades: Grade[];
  
  // Actions
  addSchool: (school: Omit<School, 'id'>) => void;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  recordAttendance: (attendance: Omit<Attendance, 'id'>[]) => void;
  recordGrade: (grade: Omit<Grade, 'id'>) => void;
  
  // Get related entities
  getClassroomsBySchool: (schoolId: string) => Classroom[];
  getStudentsByClassroom: (classroomId: string) => Student[];
  
  isLoading: boolean;
}

// Create mock data
const MOCK_SCHOOLS: School[] = [
  { id: '1', name: 'Main High School', location: '123 Education St, City', logo: null, themeColor: '#0EA5E9' },
  { id: '2', name: 'West Elementary', location: '456 Learning Ave, Town', logo: null, themeColor: '#10B981' }
];

const MOCK_CLASSROOMS: Classroom[] = [
  { id: '1', name: 'Class 10-A', schoolId: '1' },
  { id: '2', name: 'Class 9-B', schoolId: '1' },
  { id: '3', name: 'Class 5-C', schoolId: '2' }
];

const MOCK_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'English' },
  { id: '4', name: 'History' }
];

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@school.com', classroomId: '1' },
  { id: '2', name: 'Bob Smith', email: 'bob@school.com', classroomId: '1' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@school.com', classroomId: '2' },
  { id: '4', name: 'Diana Wilson', email: 'diana@school.com', classroomId: '3' }
];

const MOCK_TEACHERS: Teacher[] = [
  { 
    id: '1', 
    userId: '2', 
    subjectIds: ['1', '2'],
    classroomIds: ['1', '2']
  },
  { 
    id: '2', 
    userId: '4', 
    subjectIds: ['3', '4'],
    classroomIds: ['2', '3']
  }
];

const MOCK_ATTENDANCE: Attendance[] = [
  { id: '1', studentId: '1', date: '2023-05-15', status: 'Present' },
  { id: '2', studentId: '2', date: '2023-05-15', status: 'Present' },
  { id: '3', studentId: '3', date: '2023-05-15', status: 'Absent' },
  { id: '4', studentId: '1', date: '2023-05-16', status: 'Present' }
];

const MOCK_GRADES: Grade[] = [
  { id: '1', studentId: '1', subjectId: '1', score: 92.5, term: '2023-Q1' },
  { id: '2', studentId: '1', subjectId: '2', score: 88.0, term: '2023-Q1' },
  { id: '3', studentId: '2', subjectId: '1', score: 76.5, term: '2023-Q1' },
  { id: '4', studentId: '3', subjectId: '3', score: 95.0, term: '2023-Q1' }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>(MOCK_SCHOOLS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>(MOCK_ATTENDANCE);
  const [grades, setGrades] = useState<Grade[]>(MOCK_GRADES);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Helper to generate IDs
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Add a new school
  const addSchool = (school: Omit<School, 'id'>) => {
    const newSchool = { ...school, id: generateId() };
    setSchools([...schools, newSchool]);
    toast({ title: 'Success', description: `School "${school.name}" has been added.` });
  };

  // Add a new classroom
  const addClassroom = (classroom: Omit<Classroom, 'id'>) => {
    const newClassroom = { ...classroom, id: generateId() };
    setClassrooms([...classrooms, newClassroom]);
    toast({ title: 'Success', description: `Classroom "${classroom.name}" has been added.` });
  };

  // Add a new subject
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: generateId() };
    setSubjects([...subjects, newSubject]);
    toast({ title: 'Success', description: `Subject "${subject.name}" has been added.` });
  };

  // Add a new student
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: generateId() };
    setStudents([...students, newStudent]);
    toast({ title: 'Success', description: `Student "${student.name}" has been added.` });
  };

  // Add a new teacher
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: generateId() };
    setTeachers([...teachers, newTeacher]);
    toast({ title: 'Success', description: 'New teacher has been added.' });
  };

  // Record attendance
  const recordAttendance = (attendanceList: Omit<Attendance, 'id'>[]) => {
    const newAttendanceRecords = attendanceList.map(attendance => ({
      ...attendance,
      id: generateId()
    }));
    setAttendanceRecords([...attendanceRecords, ...newAttendanceRecords]);
    toast({ title: 'Success', description: `Attendance recorded for ${attendanceList.length} students.` });
  };

  // Record a grade
  const recordGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade = { ...grade, id: generateId() };
    setGrades([...grades, newGrade]);
    toast({ title: 'Success', description: 'Grade has been recorded.' });
  };

  // Get classrooms by school
  const getClassroomsBySchool = (schoolId: string) => {
    return classrooms.filter(classroom => classroom.schoolId === schoolId);
  };

  // Get students by classroom
  const getStudentsByClassroom = (classroomId: string) => {
    return students.filter(student => student.classroomId === classroomId);
  };

  const value = {
    schools,
    classrooms,
    subjects,
    students,
    teachers,
    attendanceRecords,
    grades,
    addSchool,
    addClassroom,
    addSubject,
    addStudent,
    addTeacher,
    recordAttendance,
    recordGrade,
    getClassroomsBySchool,
    getStudentsByClassroom,
    isLoading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
