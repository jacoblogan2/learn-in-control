
export interface School {
  id: string;
  name: string;
  location: string;
  logo?: string | null;
  themeColor?: string;
}

export interface Classroom {
  id: string;
  name: string;
  schoolId: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classroomId: string;
}

export interface Teacher {
  id: string;
  userId: string;
  subjectIds: string[];
  classroomIds: string[];
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentIds: string[];
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  score: number;
  term: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  purpose: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  targetGroups: ('all' | 'teachers' | 'students' | 'parents')[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ClassRoutineItem {
  id: string;
  classroomId: string;
  subjectId: string;
  teacherId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  classroomId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
}
