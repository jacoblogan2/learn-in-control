import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { AdminDataService } from '@/services/adminDataService';
import { useToast } from '@/hooks/use-toast';

const StudentDetails = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id');
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const { data, error } = await AdminDataService.getStudentWithParent(studentId);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        setStudent(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load student details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/students">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Student Details</h1>
        </div>
        <Link to={`/student-edit?id=${student.id}`}>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            Edit Student
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Name:</strong> {student.first_name} {student.last_name}</div>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>Phone:</strong> {student.phone || 'N/A'}</div>
            <div><strong>Class:</strong> {student.class_name || 'N/A'}</div>
            <div><strong>Section:</strong> {student.section || 'N/A'}</div>
            <div><strong>Gender:</strong> {student.gender || 'N/A'}</div>
            <div><strong>Date of Birth:</strong> {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.primary_parent ? (
              <div className="space-y-2">
                <div><strong>Parent Name:</strong> {student.primary_parent.name}</div>
                <div><strong>Email:</strong> {student.primary_parent.email}</div>
                <div><strong>Phone:</strong> {student.primary_parent.phone}</div>
                <div><strong>Occupation:</strong> {student.primary_parent.occupation || 'N/A'}</div>
                <Link to={`/parent-details?id=${student.primary_parent.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Parent Details
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <div><strong>Father:</strong> {student.father_name || 'N/A'}</div>
                <div><strong>Mother:</strong> {student.mother_name || 'N/A'}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetails;