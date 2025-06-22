
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Layout from "../components/Layout";

const Index = () => {
  const { user, isLoading } = useAuth();

  console.log('Index page - user:', !!user, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
