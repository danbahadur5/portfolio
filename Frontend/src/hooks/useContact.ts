import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { logger } from '@/utils/logger';

export const useContact = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContact = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/api/getcontact');
      setData(res.data.contacts?.[0] || null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch contact data';
      setError(new Error(errorMsg));
      logger.error(errorMsg, err, 'useContact');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return { data, isLoading, error, refetch: fetchContact };
};
