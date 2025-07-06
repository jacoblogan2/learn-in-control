
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminDataService } from '@/services/adminDataService';

const CreatePayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    student_id: '',
    totalFee: '',
    feestype: '',
    paymentMethod: '',
    date: '',
    notes: '',
    phoneNumber: ''
  });

  // Fetch students for dropdown
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await AdminDataService.getStudents();
    if (!error) {
      setStudents(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!selectedStudent) {
        toast({
          title: "Error",
          description: "Please select a student",
          variant: "destructive"
        });
        return;
      }

      // Validate phone number for mobile money payments
      const isMobileMoney = formData.paymentMethod === 'mtn_mobile_money' || formData.paymentMethod === 'orange_money';
      if (isMobileMoney && !formData.phoneNumber) {
        toast({
          title: "Error",
          description: "Phone number is required for mobile money payments",
          variant: "destructive"
        });
        return;
      }

      // First create an invoice
      const invoiceData = {
        student_id: selectedStudent.id,
        amount: parseFloat(formData.totalFee),
        fee_type: formData.feestype as 'tuition_fee' | 'registration_fee' | 'lab_fee' | 'library_fee' | 'exam_fee',
        due_date: formData.date,
        academic_year: new Date().getFullYear().toString(),
        status: 'pending' as 'pending' | 'paid' | 'overdue' | 'partial'
      };

      const { data: invoiceResult, error: invoiceError } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (invoiceError) {
        toast({
          title: "Error",
          description: invoiceError.message,
          variant: "destructive"
        });
        return;
      }

      // Create payment record with proper invoice reference
      const paymentData = {
        student_id: selectedStudent.id,
        amount: parseFloat(formData.totalFee),
        payment_method: formData.paymentMethod.toLowerCase().replace(' ', '_') as any,
        payment_date: formData.date,
        notes: isMobileMoney 
          ? `${formData.notes || `Payment for ${formData.feestype}`} - Phone: ${formData.phoneNumber}`
          : formData.notes || `Payment for ${formData.feestype}`,
        invoice_id: invoiceResult.id
      };

      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Update invoice status to paid
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoiceResult.id);
      
      toast({
        title: "Success",
        description: "Payment has been recorded successfully",
      });
      
      navigate('/fees-collection');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setFormData({
      student_id: '',
      totalFee: '',
      feestype: '',
      paymentMethod: '',
      date: '',
      notes: '',
      phoneNumber: ''
    });
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Information</h1>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="student_id">Select Student</Label>
                <div className="relative">
                  <select
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={(e) => {
                      const studentId = e.target.value;
                      const student = students.find(s => s.id === studentId);
                      setSelectedStudent(student);
                      setFormData(prev => ({ ...prev, student_id: studentId }));
                    }}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Please Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} - {student.admission_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Payment Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalFee">Amount</Label>
                <Input
                  id="totalFee"
                  name="totalFee"
                  type="number"
                  step="0.01"
                  value={formData.totalFee}
                  onChange={handleInputChange}
                  placeholder="Payment Amount"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feestype">Fee Type</Label>
                <select
                    id="feestype"
                    name="feestype"
                    value={formData.feestype}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    >
                    <option value="">Select Fee Type</option>
                    <option value="tuition_fee">Tuition Fee</option>
                    <option value="registration_fee">Registration Fee</option>
                    <option value="lab_fee">Lab Fee</option>
                    <option value="library_fee">Library Fee</option>
                    <option value="exam_fee">Exam Fee</option>
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
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="mtn_mobile_money">MTN Mobile Money</option>
                    <option value="orange_money">Orange Money</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phone Number field for Mobile Money payments */}
            {(formData.paymentMethod === 'mtn_mobile_money' || formData.paymentMethod === 'orange_money') && (
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile money phone number"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional payment notes"
              />
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
