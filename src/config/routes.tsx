
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from "../components/Layout";

// Pages
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import LecturerDashboard from "../pages/LecturerDashboard";
import Students from "../pages/Students";
import StudentDetails from "../pages/StudentDetails";
import StudentEdit from "../pages/StudentEdit";
import AdmitForm from "../pages/AdmitForm";
import TeachersList from "../pages/TeachersList";
import TeacherDetails from "../pages/TeacherDetails";
import TeacherEdit from "../pages/TeacherEdit";
import AddTeacher from "../pages/AddTeacher";
import Parents from "../pages/Parents";
import ParentDetails from "../pages/ParentDetails";
import ParentEdit from "../pages/ParentEdit";
import AddParent from "../pages/AddParent";
import FeesCollection from "../pages/FeesCollection";
import CreatePayment from "../pages/CreatePayment";
import Schools from "../pages/Schools";
import Classrooms from "../pages/Classrooms";
import Attendance from "../pages/Attendance";
import Grades from "../pages/Grades";
import NotFound from "../pages/NotFound";
import Subject from "../pages/Subject";
import ClassRoutine from "../pages/ClassRoutine";
import Exam from "../pages/Exam";
import Notice from "../pages/Notice";
import Message from "../pages/Message";
import UIElements from "../pages/UIElements";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>{children}</Layout>
);

export const routes: RouteObject[] = [
  {
    path: "/welcome",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  // Role-specific dashboards
  {
    path: "/admin/dashboard",
    element: <LayoutWrapper><AdminDashboard /></LayoutWrapper>
  },
  {
    path: "/student/dashboard",
    element: <LayoutWrapper><StudentDashboard /></LayoutWrapper>
  },
  {
    path: "/lecturer/dashboard",
    element: <LayoutWrapper><LecturerDashboard /></LayoutWrapper>
  },
  // Dashboard
  {
    path: "/",
    element: <LayoutWrapper><Dashboard /></LayoutWrapper>
  },
  // Students
  {
    path: "/students",
    element: <LayoutWrapper><Students /></LayoutWrapper>
  },
  {
    path: "/all-students",
    element: <LayoutWrapper><Students /></LayoutWrapper>
  },
  {
    path: "/student-details",
    element: <LayoutWrapper><StudentDetails /></LayoutWrapper>
  },
  {
    path: "/student-edit",
    element: <LayoutWrapper><StudentEdit /></LayoutWrapper>
  },
  {
    path: "/admit-form",
    element: <LayoutWrapper><AdmitForm /></LayoutWrapper>
  },
  // Teachers
  {
    path: "/teachers",
    element: <LayoutWrapper><TeachersList /></LayoutWrapper>
  },
  {
    path: "/all-teachers",
    element: <LayoutWrapper><TeachersList /></LayoutWrapper>
  },
  {
    path: "/teacher-details",
    element: <LayoutWrapper><TeacherDetails /></LayoutWrapper>
  },
  {
    path: "/teacher-edit",
    element: <LayoutWrapper><TeacherEdit /></LayoutWrapper>
  },
  {
    path: "/add-teacher",
    element: <LayoutWrapper><AddTeacher /></LayoutWrapper>
  },
  // Parents
  {
    path: "/parents",
    element: <LayoutWrapper><Parents /></LayoutWrapper>
  },
  {
    path: "/parent-details",
    element: <LayoutWrapper><ParentDetails /></LayoutWrapper>
  },
  {
    path: "/parent-edit",
    element: <LayoutWrapper><ParentEdit /></LayoutWrapper>
  },
  {
    path: "/add-parent",
    element: <LayoutWrapper><AddParent /></LayoutWrapper>
  },
  // Account
  {
    path: "/fees-collection",
    element: <LayoutWrapper><FeesCollection /></LayoutWrapper>
  },
  {
    path: "/create-payment",
    element: <LayoutWrapper><CreatePayment /></LayoutWrapper>
  },
  // School
  {
    path: "/schools",
    element: <LayoutWrapper><Schools /></LayoutWrapper>
  },
  // Classroom
  {
    path: "/classrooms",
    element: <LayoutWrapper><Classrooms /></LayoutWrapper>
  },
  // Attendance
  {
    path: "/attendance",
    element: <LayoutWrapper><Attendance /></LayoutWrapper>
  },
  // Grades
  {
    path: "/grades",
    element: <LayoutWrapper><Grades /></LayoutWrapper>
  },
  // Subject
  {
    path: "/subject",
    element: <LayoutWrapper><Subject /></LayoutWrapper>
  },
  // Class Routine
  {
    path: "/class-routine",
    element: <LayoutWrapper><ClassRoutine /></LayoutWrapper>
  },
  // Exam
  {
    path: "/exam",
    element: <LayoutWrapper><Exam /></LayoutWrapper>
  },
  // Notice
  {
    path: "/notice",
    element: <LayoutWrapper><Notice /></LayoutWrapper>
  },
  // Message
  {
    path: "/message",
    element: <LayoutWrapper><Message /></LayoutWrapper>
  },
  // UI Elements
  {
    path: "/ui-elements",
    element: <LayoutWrapper><UIElements /></LayoutWrapper>
  },
  // 404
  {
    path: "*",
    element: <NotFound />
  }
];
