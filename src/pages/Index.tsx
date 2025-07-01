
import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Layout from "../components/Layout";

const Index = () => {
  const { currentUser, isLoading } = useAuth();

  console.log('Index: Rendering with user:', currentUser?.id, 'isLoading:', isLoading);

  // Show loading spinner while auth is initializing
  if (isLoading) {
    console.log('Index: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log('Index: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Index: User authenticated, rendering dashboard');
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
