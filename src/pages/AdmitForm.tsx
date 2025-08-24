
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminDataService, StudentData, ParentData } from '@/services/adminDataService';

const AdmitForm = () => {
  const navigate = useNavigate();
  const { addStudent } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    section: '',
    gender: '',
    dateOfBirth: '',
    roll: '',
    admissionNo: '',
    religion: '',
    email: '',
    parentEmail: '', // Separate parent email field
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    phoneNumber: '',
    nationality: '',
    presentAddress: '',
    permanentAddress: '',
    studentPhoto: null as File | null,
    parentPhoto: null as File | null
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'studentPhoto' | 'parentPhoto') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  // Generate next admission number on component mount
  React.useEffect(() => {
    const loadNextAdmissionNumber = async () => {
      setIsGeneratingId(true);
      const nextId = await AdminDataService.getNextAdmissionNumber();
      setFormData(prev => ({ ...prev, admissionNo: nextId }));
      setIsGeneratingId(false);
    };
    loadNextAdmissionNumber();
  }, []);

  const validateForm = async () => {
    // Validate admission number uniqueness if user modified it
    if (formData.admissionNo) {
      const isValid = await AdminDataService.validateAdmissionNumber(formData.admissionNo);
      if (!isValid) {
        toast({
          title: "Error",
          description: "Admission number already exists. Please choose a different number.",
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
      
      // Prepare parent data from form
      const parentData: ParentData = {
        name: formData.fatherName, // Using father's name as primary parent
        email: formData.parentEmail, // Use separate parent email
        phone: formData.phoneNumber,
        address: formData.presentAddress,
        gender: 'Male', // Assuming father is primary parent
        occupation: formData.fatherOccupation,
        relationship_to_student: 'father',
      };
      
      // Prepare student data for database
      const studentData: StudentData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        admission_number: formData.admissionNo, // Use form admission number
        roll_number: formData.roll,
        class_name: formData.class,
        section: formData.section,
        religion: formData.religion,
        nationality: formData.nationality,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        father_occupation: formData.fatherOccupation,
        mother_occupation: formData.motherOccupation,
        present_address: formData.presentAddress,
        permanent_address: formData.permanentAddress,
      };

      // Create student with parent using the new method
      const { data, error } = await AdminDataService.createStudentWithParent(studentData, parentData);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
        return;
      }

      // Also add to legacy context for compatibility
      addStudent({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        classroomId: formData.class || null,
      });
      
      toast({
        title: "Success",
        description: `Student admitted successfully! Admission No: ${formData.admissionNo}. Parent record ${data.parent ? 'linked' : 'created and linked'}.`,
      });
      
      navigate('/students');
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to admit student. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReset = async () => {
    setFormData({
      firstName: '',
      lastName: '',
      class: '',
      section: '',
      gender: '',
      dateOfBirth: '',
      roll: '',
      admissionNo: '',
      religion: '',
      email: '',
      parentEmail: '',
      fatherName: '',
      motherName: '',
      fatherOccupation: '',
      motherOccupation: '',
      phoneNumber: '',
      nationality: '',
      presentAddress: '',
      permanentAddress: '',
      studentPhoto: null,
      parentPhoto: null
    });
    // Regenerate admission number after reset
    const nextId = await AdminDataService.getNextAdmissionNumber();
    setFormData(prev => ({ ...prev, admissionNo: nextId }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Student Form</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg border-b pb-2">Student Information</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <option value="">Please Select Class</option>
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
                <Label htmlFor="roll">Roll</Label>
                <Input
                  id="roll"
                  name="roll"
                  value={formData.roll}
                  onChange={handleInputChange}
                  placeholder="Roll"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admissionNo">Admission No (Auto-generated, Editable)</Label>
                <Input
                  id="admissionNo"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleInputChange}
                  placeholder={isGeneratingId ? "Generating..." : "Admission Number"}
                  disabled={isGeneratingId}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated sequential number. You can edit this before saving.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Label htmlFor="email">Student E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Student Email Address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentPhoto">Upload Student Photo (150px X 150px)</Label>
                <div className="flex items-center gap-2">
                  <label 
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                    htmlFor="studentPhoto"
                  >
                    {formData.studentPhoto ? 'File Selected' : 'Choose File'}
                  </label>
                  <Input
                    id="studentPhoto"
                    name="studentPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'studentPhoto')}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.studentPhoto ? formData.studentPhoto.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>
            
            <CardTitle className="text-lg border-b pb-2 pt-4">Parents Information</CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father Name</Label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Father's Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother Name</Label>
                <Input
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Mother's Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherOccupation">Father Occupation</Label>
                <Input
                  id="fatherOccupation"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  placeholder="Father's Occupation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherOccupation">Mother Occupation</Label>
                <Input
                  id="motherOccupation"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  placeholder="Mother's Occupation"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Parent E-mail *</Label>
                <Input
                  id="parentEmail"
                  name="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  placeholder="Parent Email Address"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Used to link with existing parent records
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Nationality"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parentPhoto">Upload Parents Photo (150px X 150px)</Label>
                <div className="flex items-center gap-2">
                  <label 
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                    htmlFor="parentPhoto"
                  >
                    {formData.parentPhoto ? 'File Selected' : 'Choose File'}
                  </label>
                  <Input
                    id="parentPhoto"
                    name="parentPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'parentPhoto')}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.parentPhoto ? formData.parentPhoto.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="presentAddress">Present Address</Label>
                <Input
                  id="presentAddress"
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleInputChange}
                  placeholder="Present Address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Input
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  placeholder="Permanent Address"
                  required
                />
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

export default AdmitForm;
