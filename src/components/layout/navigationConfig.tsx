
import React from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, UserSquare, 
  ClipboardList, FileText, BellRing, MessageSquare, Settings, 
  CalendarDays
} from 'lucide-react';
import { NavigationItem } from './types';

export const getStudentNavItems = () => [
  { to: "/all-students", label: "All Students" },
  { to: "/student-details", label: "Student Details" },
  { to: "/admit-form", label: "Admit Form" },
  { to: "/student-promotion", label: "Student Promotion" },
];

export const getTeacherNavItems = () => [
  { to: "/all-teachers", label: "All Teachers" },
  { to: "/teacher-details", label: "Teacher Details" },
  { to: "/add-teacher", label: "Add Teacher" },
];

export const getFeesNavItems = () => [
  { to: "/fees-collection", label: "Fees Collection" },
  { to: "/create-payment", label: "Create Payment" },
  { to: "/all-expenses", label: "All Expenses" },
  { to: "/add-expenses", label: "Add Expenses" },
];

export const getNavigationItems = (userRole: string): NavigationItem[] => [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
  { 
    to: "/students", 
    label: "Students", 
    icon: <GraduationCap size={20} />, 
    hasChildren: true,
    visibleTo: ['admin', 'teacher'],
    children: getStudentNavItems()
  },
  { 
    to: "/teachers", 
    label: "Teachers", 
    icon: <UserSquare size={20} />, 
    hasChildren: true,
    visibleTo: ['admin'],
    children: getTeacherNavItems()
  },
  { to: "/parents", label: "Parents", icon: <Users size={20} />, visibleTo: ['admin', 'teacher'] },
  { 
    to: "/account", 
    label: "Account", 
    icon: <Settings size={20} />, 
    hasChildren: userRole === 'admin',
    visibleTo: ['admin', 'teacher', 'student'],
    children: userRole === 'admin' ? getFeesNavItems() : undefined
  },
  { to: "/class", label: "Class", icon: <Users size={20} />, visibleTo: ['admin', 'teacher'] },
  { to: "/subject", label: "Subject", icon: <FileText size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
  { to: "/class-routine", label: "Class Routine", icon: <CalendarDays size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
  { to: "/attendance", label: "Attendance", icon: <ClipboardList size={20} />, visibleTo: ['admin', 'teacher'] },
  { to: "/exam", label: "Exam", icon: <FileText size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
  { to: "/notice", label: "Notice", icon: <BellRing size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
  { to: "/message", label: "Message", icon: <MessageSquare size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
  { to: "/ui-elements", label: "UI Elements", icon: <Settings size={20} />, visibleTo: ['admin'] },
];
