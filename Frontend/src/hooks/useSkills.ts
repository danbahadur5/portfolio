import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { logger } from '@/utils/logger';

export const useSkills = () => {
  const [skills, setSkills] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/api/getskill');
      setSkills(res.data.skill?.[0] || null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch skills';
      setError(new Error(errorMsg));
      logger.error(errorMsg, err, 'useSkills');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, isLoading, error, refetch: fetchSkills };
};
