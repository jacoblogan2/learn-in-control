import { useState, useEffect } from 'react';
import { AdminDataService } from '@/services/adminDataService';

export const useStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await AdminDataService.getStudents();
      if (error) {
        setError(error.message || 'Failed to fetch students');
      } else {
        setStudents(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, refetch: fetchStudents };
};