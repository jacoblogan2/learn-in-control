
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { Student } from '@/types';

const Students = () => {
  const { students, classrooms } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRoll, setSearchRoll] = useState('');
  const [searchSection, setSearchSection] = useState('');

  // Filter students based on search criteria
  const filteredStudents = students.filter(student => {
    const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const rollMatch = searchRoll ? student.id.includes(searchRoll) : true;
    
    // Find classroom name using the classroomId
    const classroom = classrooms.find(c => c.id === student.classroomId);
    const classroomName = classroom?.name || '';
    
    const sectionMatch = searchSection ? 
      classroomName.toLowerCase().includes(searchSection.toLowerCase()) : true;
    
    return nameMatch && rollMatch && sectionMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Students</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Input 
            type="text" 
            placeholder="ID/Type here..." 
            className="w-full md:w-48"
            value={searchRoll}
            onChange={e => setSearchRoll(e.target.value)} 
          />
          
          <Input 
            type="text" 
            placeholder="Type Section..." 
            className="w-full md:w-48"
            value={searchSection}
            onChange={e => setSearchSection(e.target.value)}
          />
          
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Search size={16} />
            SEARCH
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="font-semibold">All Students</h2>
          
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
                <TableHead>Roll</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Parents Name</TableHead>
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
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, index) => {
                  // Find classroom for the student
                  const classroom = classrooms.find(c => c.id === student.classroomId);
                  const classroomName = classroom?.name || 'Unknown';
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <input type="checkbox" className="h-4 w-4" />
                      </TableCell>
                      <TableCell>#{student.id.padStart(4, '0')}</TableCell>
                      <TableCell>
                        <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/100?u=${student.id}`} 
                            alt={student.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{index % 2 === 0 ? 'Female' : 'Male'}</TableCell>
                      <TableCell>{index % 2 === 0 ? 'David Smith' : 'Mike Husky'}</TableCell>
                      <TableCell>{index % 5 + 1}</TableCell>
                      <TableCell>{classroomName ? classroomName.split('-')[1] || 'A' : 'A'}</TableCell>
                      <TableCell>
                        {index % 3 === 0 ? 'TA-110, North Sydney' : 
                        index % 3 === 1 ? '59 street, North Sydney' : 
                        '96 Street, Heavy, Reosle'}
                      </TableCell>
                      <TableCell>10/03/2010</TableCell>
                      <TableCell>+ 8812 00 5098</TableCell>
                      <TableCell>{student.email || `${student.name.toLowerCase().replace(/\s/g, '')}@gmail.com`}</TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center space-x-2">
                          <Link to={`/student-details?id=${student.id}`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/student-edit?id=${student.id}`}>
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 flex justify-end">
          <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600">
            <Link to="/admit-form" className="text-white">
              + Add New Student
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Students;
