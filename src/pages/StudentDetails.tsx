
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Printer, Download } from 'lucide-react';

const StudentDetails = () => {
  const { students } = useData();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      // Find the student from the data context
      const foundStudent = students.find(s => s.id === studentId);
      
      if (foundStudent) {
        // Add mock data for display purposes
        setStudent({
          ...foundStudent,
          gender: 'Female',
          fatherName: 'Kazi Fahimur Rahman',
          motherName: 'Richi Akon',
          dateOfBirth: '03/04/2010',
          religion: 'Islam',
          fatherOccupation: 'Businessman',
          email: `${foundStudent.name.toLowerCase().replace(/\s/g, '')}@gmail.com`,
          admissionDate: '05/04/2016',
          class: '2',
          section: 'A',
          roll: '2901',
          address: 'Ta-107 Sydeny, Australia',
          phone: '+88 255600',
          photo: `https://i.pravatar.cc/300?u=${foundStudent.id}`
        });
      } else {
        // If student not found, use demo data
        setStudent({
          id: '2901',
          name: 'Richi Hassan',
          gender: 'Female',
          fatherName: 'Kazi Fahimur Rahman',
          motherName: 'Richi Akon',
          dateOfBirth: '03/04/2010',
          religion: 'Islam',
          fatherOccupation: 'Businessman',
          email: 'richihassan@gmail.com',
          admissionDate: '05/04/2016',
          class: '2',
          section: 'A',
          roll: '2901',
          address: 'Ta-107 Sydeny, Australia',
          phone: '+88 255600',
          photo: 'https://i.pravatar.cc/300?u=richi'
        });
      }
      setLoading(false);
    } else {
      // Redirect if no student ID provided
      navigate('/students');
    }
  }, [studentId, students, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md">
        Student not found. <Link to="/students" className="underline">Go back to students list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{student.name} Details</h1>
        <div className="flex gap-2">
          <Link to={`/student-edit?id=${student.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit size={16} />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg">About Me</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Printer size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Download size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <div className="w-full max-w-xs mx-auto md:mx-0">
              <img 
                src={student.photo}
                alt={student.name}
                className="w-full max-w-[200px] h-auto rounded"
              />
            </div>
          </div>
          
          <div className="md:w-3/4 md:pl-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <div className="text-gray-500 text-sm mb-1">Name :</div>
              <div className="font-medium">{student.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Gender :</div>
              <div className="font-medium">{student.gender}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Father Name :</div>
              <div className="font-medium">{student.fatherName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Mother Name :</div>
              <div className="font-medium">{student.motherName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Date Of Birth :</div>
              <div className="font-medium">{student.dateOfBirth}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Religion :</div>
              <div className="font-medium">{student.religion}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Father Occupation :</div>
              <div className="font-medium">{student.fatherOccupation}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">E-mail :</div>
              <div className="font-medium">{student.email}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Admission Date :</div>
              <div className="font-medium">{student.admissionDate}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Class :</div>
              <div className="font-medium">{student.class}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Section :</div>
              <div className="font-medium">{student.section}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Roll :</div>
              <div className="font-medium">{student.roll}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Address :</div>
              <div className="font-medium">{student.address}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Phone :</div>
              <div className="font-medium">{student.phone}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;
