import React from 'react';
import { Label } from '@/components/ui/label';

interface StudentSelectorProps {
  students: any[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading?: boolean;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  value,
  onChange,
  loading = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="student_id">Select Student</Label>
      <div className="relative">
        <select
          id="student_id"
          name="student_id"
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading students..." : "Please Select Student"}
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.first_name} {student.last_name} - {student.admission_number}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};