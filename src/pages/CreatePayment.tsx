
import React from 'react';
import { useStudents } from '@/hooks/useStudents';
import { useCreatePayment } from '@/hooks/useCreatePayment';
import { CreatePaymentForm } from '@/components/CreatePayment/CreatePaymentForm';

const CreatePayment = () => {
  const { students, loading: studentsLoading } = useStudents();
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleStudentSelect,
    handleSubmit,
    handleReset
  } = useCreatePayment();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Information</h1>
      
      <CreatePaymentForm
        formData={formData}
        students={students}
        studentsLoading={studentsLoading}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onStudentSelect={handleStudentSelect(students)}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </div>
  );
};

export default CreatePayment;
