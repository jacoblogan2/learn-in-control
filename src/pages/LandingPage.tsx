
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchoolSetupModal } from '@/components/SchoolSetupModal';
import { useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showSchoolSetupModal, setShowSchoolSetupModal] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-lg shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex justify-center items-center">
            <span className="text-5xl mr-2 text-primary">V</span>onyee
            <span className="text-xs align-top ml-1">®</span>
          </CardTitle>
          <CardDescription className="text-lg">
            School Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">
            A comprehensive platform for schools to manage students, teachers, and administrative tasks efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleLoginClick}
              className="flex-1"
            >
              Login to Existing School
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowSchoolSetupModal(true)}
              className="flex-1"
            >
              Add New School
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vonyee School Management System
        </CardFooter>
      </Card>

      {showSchoolSetupModal && (
        <SchoolSetupModal 
          open={showSchoolSetupModal} 
          onClose={() => setShowSchoolSetupModal(false)} 
        />
      )}
    </div>
  );
};

export default LandingPage;
