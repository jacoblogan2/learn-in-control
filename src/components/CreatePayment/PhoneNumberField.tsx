import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PhoneNumberFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value,
  onChange,
  show
}) => {
  if (!show) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="phoneNumber">Phone Number *</Label>
      <Input
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        value={value}
        onChange={onChange}
        placeholder="Enter mobile money phone number"
        required
      />
    </div>
  );
};