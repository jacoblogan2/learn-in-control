import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentFormData {
  student_id: string;
  totalFee: string;
  feestype: string;
  paymentMethod: string;
  date: string;
  notes: string;
  phoneNumber: string;
}

const initialFormData: PaymentFormData = {
  student_id: '',
  totalFee: '',
  feestype: '',
  paymentMethod: '',
  date: '',
  notes: '',
  phoneNumber: ''
};

export const useCreatePayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (students: any[]) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student);
    setFormData(prev => ({ ...prev, student_id: studentId }));
  };

  const validateForm = () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive"
      });
      return false;
    }

    const isMobileMoney = formData.paymentMethod === 'mtn_mobile_money' || formData.paymentMethod === 'orange_money';
    if (isMobileMoney && !formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number is required for mobile money payments",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const createInvoice = async () => {
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
      throw new Error(invoiceError.message);
    }

    return invoiceResult;
  };

  const createPayment = async (invoiceId: string) => {
    const isMobileMoney = formData.paymentMethod === 'mtn_mobile_money' || formData.paymentMethod === 'orange_money';
    
    const paymentData = {
      student_id: selectedStudent.id,
      amount: parseFloat(formData.totalFee),
      payment_method: formData.paymentMethod.toLowerCase().replace(' ', '_') as any,
      payment_date: formData.date,
      notes: isMobileMoney 
        ? `${formData.notes || `Payment for ${formData.feestype}`} - Phone: ${formData.phoneNumber}`
        : formData.notes || `Payment for ${formData.feestype}`,
      invoice_id: invoiceId
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const updateInvoiceStatus = async (invoiceId: string) => {
    await supabase
      .from('invoices')
      .update({ status: 'paid' })
      .eq('id', invoiceId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Create invoice
      const invoice = await createInvoice();
      
      // Create payment
      await createPayment(invoice.id);
      
      // Update invoice status
      await updateInvoiceStatus(invoice.id);
      
      toast({
        title: "Success",
        description: "Payment has been recorded successfully",
      });
      
      navigate('/fees-collection');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedStudent(null);
  };

  return {
    formData,
    selectedStudent,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleStudentSelect,
    handleSubmit,
    handleReset
  };
};