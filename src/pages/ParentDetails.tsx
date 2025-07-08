import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { AdminDataService } from '@/services/adminDataService';
import { useToast } from '@/hooks/use-toast';

const ParentDetails = () => {
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('id');
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (parentId) {
      fetchParentDetails();
    }
  }, [parentId]);

  const fetchParentDetails = async () => {
    if (!parentId) return;
    
    setLoading(true);
    try {
      const { data, error } = await AdminDataService.getParentWithChildren(parentId);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        setParent(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load parent details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!parent) return <div className="p-6">Parent not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/parents">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Parent Details</h1>
        </div>
        <Link to={`/parent-edit?id=${parent.id}`}>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            Edit Parent
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Name:</strong> {parent.name}</div>
            <div><strong>Email:</strong> {parent.email}</div>
            <div><strong>Phone:</strong> {parent.phone}</div>
            <div><strong>Gender:</strong> {parent.gender || 'N/A'}</div>
            <div><strong>Occupation:</strong> {parent.occupation || 'N/A'}</div>
            <div><strong>Address:</strong> {parent.address || 'N/A'}</div>
            <div><strong>Relationship:</strong> {parent.relationship_to_student || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Children Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parent.children && parent.children.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold">Primary Children:</h4>
                {parent.children.map((child: any) => (
                  <div key={child.id} className="p-3 bg-gray-50 rounded-md">
                    <div><strong>Name:</strong> {child.first_name} {child.last_name}</div>
                    <div><strong>Class:</strong> {child.class_name || 'N/A'}</div>
                    <div><strong>Section:</strong> {child.section || 'N/A'}</div>
                    <div className="mt-2">
                      <Link to={`/student-details?id=${child.id}`}>
                        <Button variant="outline" size="sm">
                          View Student Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {parent.student_relationships && parent.student_relationships.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold">Other Relationships:</h4>
                {parent.student_relationships.map((rel: any) => (
                  <div key={rel.student.id} className="p-3 bg-blue-50 rounded-md">
                    <div><strong>Student:</strong> {rel.student.first_name} {rel.student.last_name}</div>
                    <div><strong>Relationship:</strong> {rel.relationship_type}</div>
                    <div><strong>Class:</strong> {rel.student.class_name || 'N/A'}</div>
                    <div className="mt-2">
                      <Link to={`/student-details?id=${rel.student.id}`}>
                        <Button variant="outline" size="sm">
                          View Student Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {(!parent.children || parent.children.length === 0) && 
             (!parent.student_relationships || parent.student_relationships.length === 0) && (
              <div className="text-gray-500">No children linked to this parent</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDetails;