
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminDataService, TeacherData } from '@/services/adminDataService';

const AddTeacher = () => {
  const navigate = useNavigate();
  const { addTeacher } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    idNo: '',
    subject: '',
    class: '',
    section: '',
    religion: '',
    email: '',
    phoneNo: '',
    address: '',
    teacherPhoto: null as File | null
  });

  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, teacherPhoto: file }));
  };

  // Generate next employee ID on component mount
  React.useEffect(() => {
    const loadNextEmployeeId = async () => {
      setIsGeneratingId(true);
      const nextId = await AdminDataService.getNextEmployeeId();
      setFormData(prev => ({ ...prev, idNo: nextId }));
      setIsGeneratingId(false);
    };
    loadNextEmployeeId();
  }, []);

  const validateForm = async () => {
    // Validate employee ID uniqueness if user modified it
    if (formData.idNo) {
      const isValid = await AdminDataService.validateEmployeeId(formData.idNo);
      if (!isValid) {
        toast({
          title: "Error",
          description: "Employee ID already exists. Please choose a different ID.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }
    
    try {
      
      // Prepare teacher data for database
      const teacherData: TeacherData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phoneNo,
        address: formData.address,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        employee_id: formData.idNo, // Use form employee ID
        subject: formData.subject,
        class_assigned: formData.class,
        section_assigned: formData.section,
        religion: formData.religion,
      };

      // Create teacher in database
      const { data, error } = await AdminDataService.createTeacher(teacherData);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
        return;
      }

      // Also add to legacy context for compatibility
      addTeacher({
        userId: '999', // In a real app this would be linked to a user account
        subjectIds: [formData.subject || '1'],
        classroomIds: [formData.class || '1']
      });
      
      toast({
        title: "Success",
        description: `Teacher added successfully! Employee ID: ${formData.idNo}`,
      });
      
      navigate('/all-teachers');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add teacher. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReset = async () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      idNo: '',
      subject: '',
      class: '',
      section: '',
      religion: '',
      email: '',
      phoneNo: '',
      address: '',
      teacherPhoto: null
    });
    // Regenerate employee ID after reset
    const nextId = await AdminDataService.getNextEmployeeId();
    setFormData(prev => ({ ...prev, idNo: nextId }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Teacher Information</h1>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <div className="relative">
                  <select
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Please Select Class</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <div className="relative">
                  <select
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Please Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="E">Section E</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Please Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="dd/mm/yyyy"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idNo">Employee ID (Auto-generated, Editable)</Label>
                <Input
                  id="idNo"
                  name="idNo"
                  value={formData.idNo}
                  onChange={handleInputChange}
                  placeholder={isGeneratingId ? "Generating..." : "Employee ID"}
                  disabled={isGeneratingId}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated sequential ID. You can edit this before saving.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Please Select Subject</option>
                    <option value="Math">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Art">Art</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  placeholder="Religion"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone No</Label>
                <Input
                  id="phoneNo"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacherPhoto">Upload Teacher Photo (150px X 150px)</Label>
              <div className="flex items-center gap-2">
                <label 
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                  htmlFor="teacherPhoto"
                >
                  {formData.teacherPhoto ? 'File Selected' : 'Choose File'}
                </label>
                <Input
                  id="teacherPhoto"
                  name="teacherPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-500 truncate flex-1">
                  {formData.teacherPhoto ? formData.teacherPhoto.name : 'No file chosen'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-start gap-3 pt-4">
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Save
              </Button>
              <Button type="button" variant="outline" className="bg-blue-900 hover:bg-blue-800 text-white" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeacher;
