
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Printer, Download } from 'lucide-react';

const TeacherDetails = () => {
  const { teachers } = useData();
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create mock teacher data (in a real app, this would be fetched from API)
    const mockTeacher = {
      id: teacherId || '2901',
      name: 'Andrew Martin',
      gender: 'Male',
      dateOfBirth: '03/05/1998',
      religion: 'Islam',
      email: 'andrewmartin@gmail.com',
      joiningDate: '05/04/2016',
      subject: 'English',
      class: '2',
      section: 'A',
      id_number: '2901',
      address: 'Ta-107 Sydeny, Australia',
      phone: '+88 255600',
      photo: 'https://i.pravatar.cc/300?u=teacher'
    };
    
    setTeacher(mockTeacher);
    setLoading(false);
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md">
        Teacher not found. <Link to="/teachers" className="underline">Go back to teachers list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">About {teacher.name}</h1>
        <div className="flex gap-2">
          <Link to={`/edit-teacher?id=${teacher.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit size={16} />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <div className="w-full max-w-xs mx-auto md:mx-0">
              <img 
                src={teacher.photo}
                alt={teacher.name}
                className="w-full max-w-[200px] h-auto rounded bg-gray-200"
              />
            </div>
          </div>
          
          <div className="md:w-3/4 md:pl-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <div className="text-gray-500 text-sm mb-1">Name :</div>
              <div className="font-medium">{teacher.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Gender :</div>
              <div className="font-medium">{teacher.gender}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Date of Birth :</div>
              <div className="font-medium">{teacher.dateOfBirth}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Religion :</div>
              <div className="font-medium">{teacher.religion}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">E-mail :</div>
              <div className="font-medium">{teacher.email}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Joining Date :</div>
              <div className="font-medium">{teacher.joiningDate}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Subject :</div>
              <div className="font-medium">{teacher.subject}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Class :</div>
              <div className="font-medium">{teacher.class}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Section :</div>
              <div className="font-medium">{teacher.section}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">ID :</div>
              <div className="font-medium">{teacher.id_number}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Address :</div>
              <div className="font-medium">{teacher.address}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Phone :</div>
              <div className="font-medium">{teacher.phone}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDetails;
