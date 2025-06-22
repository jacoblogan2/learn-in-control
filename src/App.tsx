
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
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
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/students" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Students />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/all-students" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Students />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/student-details" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <StudentDetails />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admit-form" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <AdmitForm />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/teachers" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <TeachersList />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/all-teachers" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <TeachersList />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/teacher-details" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <TeacherDetails />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/add-teacher" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <AddTeacher />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/parents" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Parents />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/fees-collection" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <FeesCollection />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create-payment" element={
                    <ProtectedRoute>
                      <Layout>
                        <CreatePayment />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/schools" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Schools />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/classrooms" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Classrooms />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/attendance" element={
                    <ProtectedRoute>
                      <Layout>
                        <Attendance />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/grades" element={
                    <ProtectedRoute>
                      <Layout>
                        <Grades />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/subject" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Subject />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/class-routine" element={
                    <ProtectedRoute>
                      <Layout>
                        <ClassRoutine />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/exam" element={
                    <ProtectedRoute>
                      <Layout>
                        <Exam />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/notice" element={
                    <ProtectedRoute>
                      <Layout>
                        <Notice />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/message" element={
                    <ProtectedRoute>
                      <Layout>
                        <Message />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/ui-elements" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <UIElements />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Student Routes */}
                  <Route path="/student-dashboard" element={
                    <ProtectedRoute requiredRole="student">
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Lecturer Routes */}
                  <Route path="/lecturer-dashboard" element={
                    <ProtectedRoute requiredRole="lecturer">
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
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
