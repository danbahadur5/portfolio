import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { logger } from '@/utils/logger';

export const useHomeContent = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHomeContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/api/gethomecontent');
      setData(res.data.homeContent || null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch home content';
      setError(new Error(errorMsg));
      logger.error(errorMsg, err, 'useHomeContent');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent]);

  return { data, isLoading, error, refetch: fetchHomeContent };
};
