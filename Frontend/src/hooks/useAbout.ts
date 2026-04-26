import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { logger } from '@/utils/logger';

export const useAbout = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAbout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/api/getabout');
      // Handle both object and array response from backend
      const aboutData = Array.isArray(res.data.about) 
        ? res.data.about[0] 
        : res.data.about;
      setData(aboutData || null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch about data';
      setError(new Error(errorMsg));
      logger.error(errorMsg, err, 'useAbout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  return { data, isLoading, error, refetch: fetchAbout };
};
