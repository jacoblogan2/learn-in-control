import React from 'react';
import { Label } from '@/components/ui/label';

interface FeeTypeSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FEE_TYPES = [
  { value: 'tuition_fee', label: 'Tuition Fee' },
  { value: 'registration_fee', label: 'Registration Fee' },
  { value: 'lab_fee', label: 'Lab Fee' },
  { value: 'library_fee', label: 'Library Fee' },
  { value: 'exam_fee', label: 'Exam Fee' }
];

export const FeeTypeSelector: React.FC<FeeTypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="feestype">Fee Type</Label>
      <select
        id="feestype"
        name="feestype"
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        required
      >
        <option value="">Select Fee Type</option>
        {FEE_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};