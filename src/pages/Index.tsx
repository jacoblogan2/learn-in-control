
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Layout from "../components/Layout";

const Index = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
