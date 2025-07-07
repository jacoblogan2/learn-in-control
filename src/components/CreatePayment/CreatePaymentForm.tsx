import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudentSelector } from './StudentSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { FeeTypeSelector } from './FeeTypeSelector';
import { PhoneNumberField } from './PhoneNumberField';

interface CreatePaymentFormProps {
  formData: {
    student_id: string;
    totalFee: string;
    feestype: string;
    paymentMethod: string;
    date: string;
    notes: string;
    phoneNumber: string;
  };
  students: any[];
  studentsLoading: boolean;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStudentSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export const CreatePaymentForm: React.FC<CreatePaymentFormProps> = ({
  formData,
  students,
  studentsLoading,
  isSubmitting,
  onInputChange,
  onSelectChange,
  onStudentSelect,
  onSubmit,
  onReset
}) => {
  const isMobileMoney = formData.paymentMethod === 'mtn_mobile_money' || formData.paymentMethod === 'orange_money';

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StudentSelector
              students={students}
              value={formData.student_id}
              onChange={onStudentSelect}
              loading={studentsLoading}
            />

            <div className="space-y-2">
              <Label htmlFor="date">Payment Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={onInputChange}
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
                onChange={onInputChange}
                placeholder="Payment Amount"
                required
              />
            </div>
            
            <FeeTypeSelector
              value={formData.feestype}
              onChange={onSelectChange}
            />

            <PaymentMethodSelector
              value={formData.paymentMethod}
              onChange={onSelectChange}
            />
          </div>

          <PhoneNumberField
            value={formData.phoneNumber}
            onChange={onInputChange}
            show={isMobileMoney}
          />

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder="Additional payment notes"
            />
          </div>
          
          <div className="flex justify-start gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="bg-blue-900 hover:bg-blue-800 text-white" 
              onClick={onReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};