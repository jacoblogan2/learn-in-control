
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import { AdminDataService } from '@/services/adminDataService';
import { useToast } from '@/hooks/use-toast';

const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRoll, setSearchRoll] = useState('');
  const [searchSection, setSearchSection] = useState('');
  const { toast } = useToast();

  // Fetch students from database
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await AdminDataService.getStudentsWithParents();
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        setStudents(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const { error } = await AdminDataService.deleteStudent(id);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Student deleted successfully"
        });
        fetchStudents(); // Refresh the list
      }
    }
  };

  // Filter students based on search criteria
  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    const rollMatch = searchRoll ? student.roll_number?.includes(searchRoll) : true;
    const sectionMatch = searchSection ? student.section?.toLowerCase().includes(searchSection.toLowerCase()) : true;
    
    return nameMatch && rollMatch && sectionMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Students</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full md:w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} 
          />
          
          <Input 
            type="text" 
            placeholder="Search by roll..." 
            className="w-full md:w-48"
            value={searchRoll}
            onChange={e => setSearchRoll(e.target.value)}
          />
          
          <Input 
            type="text" 
            placeholder="Search by section..." 
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
            <Link to="/admit-form">
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2">
                <Plus size={16} />
                Add New Student
              </Button>
            </Link>
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
                <TableHead>Parent Name</TableHead>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>#{student.admission_number || student.id.slice(-8)}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                        <img 
                          src={student.student_photo_url || `https://i.pravatar.cc/100?u=${student.id}`} 
                          alt={`${student.first_name} ${student.last_name}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{student.first_name} {student.last_name}</TableCell>
                    <TableCell>{student.gender || 'Not specified'}</TableCell>
                    <TableCell>
                      {student.primary_parent ? student.primary_parent.name : 
                       student.father_name || student.mother_name || 'N/A'}
                    </TableCell>
                    <TableCell>{student.class_name || 'N/A'}</TableCell>
                    <TableCell>{student.section || 'N/A'}</TableCell>
                    <TableCell>{student.present_address || student.address || 'N/A'}</TableCell>
                    <TableCell>{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{student.phone || 'N/A'}</TableCell>
                    <TableCell>{student.email}</TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-600"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Students;
