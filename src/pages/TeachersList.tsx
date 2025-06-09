
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search } from 'lucide-react';

const TeachersList = () => {
  const { teachers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchSubject, setSearchSubject] = useState('');

  // Filter students based on search criteria
  const filteredTeachers = teachers;

  // Generate mock data for display
  const mockTeachers = Array(20).fill(null).map((_, index) => {
    const id = (2901 + index).toString();
    const name = 'Richi Rozario';
    const gender = index % 3 === 0 ? 'Male' : 'Female';
    const subjects = [
      'Math', 'English', 'Science', 'History', 'Social Science', 
      'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art'
    ];
    const subject = subjects[index % subjects.length];
    const classNum = (index % 5) + 1;
    const sections = ['A', 'B', 'C', 'D', 'E'];
    const section = sections[index % sections.length];
    const address = 'TA-110, North Sydney';
    const dob = '10/03/2010';
    const phone = '+ 8812 00 5098';
    const email = `richiro${index}@gmail.com`;

    return {
      id,
      name,
      gender,
      subject,
      class: classNum,
      section,
      address,
      dob,
      phone,
      email,
      photoUrl: `https://i.pravatar.cc/150?u=teacher${index}`
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Teachers</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Input 
            type="text" 
            placeholder="ID/Type here..." 
            className="w-full md:w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} 
          />
          
          <Input 
            type="text" 
            placeholder="Type Class..." 
            className="w-full md:w-48"
            value={searchClass}
            onChange={e => setSearchClass(e.target.value)}
          />
          
          <Input 
            type="text" 
            placeholder="Subject..." 
            className="w-full md:w-48"
            value={searchSubject}
            onChange={e => setSearchSubject(e.target.value)}
          />
          
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Search size={16} />
            SEARCH
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="font-semibold">All Teachers</h2>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table className="akkhor-table">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-12">
                  <input type="checkbox" className="h-4 w-4" />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date Of Birth</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <input type="checkbox" className="h-4 w-4" />
                  </TableCell>
                  <TableCell>#{teacher.id}</TableCell>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                      <img 
                        src={teacher.photoUrl} 
                        alt={teacher.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.gender}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.class}</TableCell>
                  <TableCell>{teacher.section}</TableCell>
                  <TableCell>{teacher.address}</TableCell>
                  <TableCell>{teacher.dob}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center space-x-2">
                      <Link to={`/teacher-details?id=${teacher.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Link to={`/teacher-edit?id=${teacher.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 flex justify-end">
          <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600">
            <Link to="/add-teacher" className="text-white">
              + Add New Teacher
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeachersList;
