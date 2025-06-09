
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CreatePayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    class: '',
    section: '',
    totalFee: '',
    feestype: '',
    paymentMethod: '',
    status: '',
    date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Success",
      description: "Payment has been recorded successfully",
    });
    
    navigate('/fees-collection');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      id: '',
      class: '',
      section: '',
      totalFee: '',
      feestype: '',
      paymentMethod: '',
      status: '',
      date: ''
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Information</h1>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Student Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="Student ID"
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
                <Label htmlFor="totalFee">Total Fee</Label>
                <Input
                  id="totalFee"
                  name="totalFee"
                  type="number"
                  value={formData.totalFee}
                  onChange={handleInputChange}
                  placeholder="Total Fee Amount"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feestype">Fees Type</Label>
                <select
                    id="feestype"
                    name="feestype"
                    value={formData.feestype}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    >

                    <option value="">Select Fees Type</option>
                    <option value="Registration Fees">Registration Fees</option>
                    <option value="Admission Fees">Admission Fees</option>
                    <option value="Tuition Fees">Tuition Fees</option>
                    <option value="Internship Request Letter(Graduates)">Internship Request Letter(Graduates)</option>
                    <option value="Student Card">Student Card</option>
                    <option value="Course Retake">Course Retake</option>
                    <option value="Fine">Fine</option>
                    <option value="Graduation Fees">Graduation Fees</option>
                    <option value="Transcript">Transcript</option>
                    <option value="Exam Retake">Exam Retake</option>
                    <option value="Insurance Fees">Insurance Fees</option>
                    <option value="Recommendation Letter">Recommendation Letter</option>
                    <option value="Second Proposal Defense">Second Proposal Defense</option>
                  </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <div className="relative">
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Orange">Orange Money</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Due">Due</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="dd/mm/yyyy"
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

export default CreatePayment;
