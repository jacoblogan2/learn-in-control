
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create student from form data
    addStudent({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      classroomId: formData.class || null,
    });
    
    toast({
      title: "Success",
      description: "Student has been added successfully",
    });
    
    navigate('/students');
  };

  const handleReset = () => {
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
                <Label htmlFor="admissionNo">Admission No</Label>
                <Input
                  id="admissionNo"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleInputChange}
                  placeholder="Admission Number"
                  required
                />
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
