import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import AdmitForm from "./pages/AdmitForm";
import TeachersList from "./pages/TeachersList";
import TeacherDetails from "./pages/TeacherDetails";
import AddTeacher from "./pages/AddTeacher";
import Parents from "./pages/Parents";
import FeesCollection from "./pages/FeesCollection";
import CreatePayment from "./pages/CreatePayment";
import Schools from "./pages/Schools";
import Classrooms from "./pages/Classrooms";
import Attendance from "./pages/Attendance";
import Grades from "./pages/Grades";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Subject from "./pages/Subject";
import ClassRoutine from "./pages/ClassRoutine";
import Exam from "./pages/Exam";
import Notice from "./pages/Notice";
import Message from "./pages/Message";
import UIElements from "./pages/UIElements";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  // Check for initial route on first render
  useEffect(() => {
    const initialRoute = localStorage.getItem('initialRoute');
    if (initialRoute) {
      // Clear the initial route from storage
      localStorage.removeItem('initialRoute');
      
      // Redirect to the initial route if needed
      if (window.location.pathname === '/') {
        window.location.href = initialRoute;
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/welcome" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  {/* Role-specific dashboards */}
                  <Route path="/admin/dashboard" element={
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  } />
                  <Route path="/student/dashboard" element={
                    <Layout>
                      <StudentDashboard />
                    </Layout>
                  } />
                  <Route path="/lecturer/dashboard" element={
                    <Layout>
                      <LecturerDashboard />
                    </Layout>
                  } />
                  
                  {/* Dashboard */}
                  <Route path="/" element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  } />
                  
                  {/* Students */}
                  <Route path="/students" element={
                    <Layout>
                      <Students />
                    </Layout>
                  } />
                  <Route path="/all-students" element={
                    <Layout>
                      <Students />
                    </Layout>
                  } />
                  <Route path="/student-details" element={
                    <Layout>
                      <StudentDetails />
                    </Layout>
                  } />
                  <Route path="/admit-form" element={
                    <Layout>
                      <AdmitForm />
                    </Layout>
                  } />
                  
                  {/* Teachers */}
                  <Route path="/teachers" element={
                    <Layout>
                      <TeachersList />
                    </Layout>
                  } />
                  <Route path="/all-teachers" element={
                    <Layout>
                      <TeachersList />
                    </Layout>
                  } />
                  <Route path="/teacher-details" element={
                    <Layout>
                      <TeacherDetails />
                    </Layout>
                  } />
                  <Route path="/add-teacher" element={
                    <Layout>
                      <AddTeacher />
                    </Layout>
                  } />
                  
                  {/* Parents */}
                  <Route path="/parents" element={
                    <Layout>
                      <Parents />
                    </Layout>
                  } />
                  
                  {/* Account */}
                  <Route path="/fees-collection" element={
                    <Layout>
                      <FeesCollection />
                    </Layout>
                  } />
                  <Route path="/create-payment" element={
                    <Layout>
                      <CreatePayment />
                    </Layout>
                  } />
                  
                  {/* School */}
                  <Route path="/schools" element={
                    <Layout>
                      <Schools />
                    </Layout>
                  } />
                  
                  {/* Classroom */}
                  <Route path="/classrooms" element={
                    <Layout>
                      <Classrooms />
                    </Layout>
                  } />
                  
                  {/* Attendance */}
                  <Route path="/attendance" element={
                    <Layout>
                      <Attendance />
                    </Layout>
                  } />
                  
                  {/* Grades */}
                  <Route path="/grades" element={
                    <Layout>
                      <Grades />
                    </Layout>
                  } />
                  
                  {/* Subject */}
                  <Route path="/subject" element={
                    <Layout>
                      <Subject />
                    </Layout>
                  } />
                  
                  {/* Class Routine */}
                  <Route path="/class-routine" element={
                    <Layout>
                      <ClassRoutine />
                    </Layout>
                  } />
                  
                  {/* Exam */}
                  <Route path="/exam" element={
                    <Layout>
                      <Exam />
                    </Layout>
                  } />
                  
                  {/* Notice */}
                  <Route path="/notice" element={
                    <Layout>
                      <Notice />
                    </Layout>
                  } />
                  
                  {/* Message */}
                  <Route path="/message" element={
                    <Layout>
                      <Message />
                    </Layout>
                  } />
                  
                  {/* UI Elements */}
                  <Route path="/ui-elements" element={
                    <Layout>
                      <UIElements />
                    </Layout>
                  } />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
