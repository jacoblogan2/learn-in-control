
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import { AdminDataService } from '@/services/adminDataService';
import { useToast } from '@/hooks/use-toast';

const TeachersList = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const { toast } = useToast();

  // Fetch teachers from database
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await AdminDataService.getTeachers();
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        setTeachers(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teachers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      const { error } = await AdminDataService.deleteTeacher(id);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Teacher deleted successfully"
        });
        fetchTeachers(); // Refresh the list
      }
    }
  };

  // Filter teachers based on search criteria
  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    const classMatch = searchClass ? teacher.class_assigned?.includes(searchClass) : true;
    const subjectMatch = searchSubject ? teacher.subject?.toLowerCase().includes(searchSubject.toLowerCase()) : true;
    
    return nameMatch && classMatch && subjectMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Teachers</h1>
        
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
            placeholder="Search by class..." 
            className="w-full md:w-48"
            value={searchClass}
            onChange={e => setSearchClass(e.target.value)}
          />
          
          <Input 
            type="text" 
            placeholder="Search by subject..." 
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
            <Link to="/add-teacher">
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2">
                <Plus size={16} />
                Add New Teacher
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8">
                    Loading teachers...
                  </TableCell>
                </TableRow>
              ) : filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8">
                    No teachers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>#{teacher.employee_id || teacher.id.slice(-8)}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                        <img 
                          src={teacher.teacher_photo_url || `https://i.pravatar.cc/100?u=${teacher.id}`} 
                          alt={`${teacher.first_name} ${teacher.last_name}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{teacher.first_name} {teacher.last_name}</TableCell>
                    <TableCell>{teacher.gender || 'Not specified'}</TableCell>
                    <TableCell>{teacher.subject || 'N/A'}</TableCell>
                    <TableCell>{teacher.class_assigned || 'N/A'}</TableCell>
                    <TableCell>{teacher.section_assigned || 'N/A'}</TableCell>
                    <TableCell>{teacher.address || 'N/A'}</TableCell>
                    <TableCell>{teacher.date_of_birth ? new Date(teacher.date_of_birth).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{teacher.phone || 'N/A'}</TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-600"
                          onClick={() => handleDelete(teacher.id)}
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

export default TeachersList;
