import React from 'react';
import { Label } from '@/components/ui/label';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'mtn_mobile_money', label: 'MTN Mobile Money' },
  { value: 'orange_money', label: 'Orange Money' }
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="paymentMethod">Payment Method</Label>
      <div className="relative">
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        >
          <option value="">Select Payment Method</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};