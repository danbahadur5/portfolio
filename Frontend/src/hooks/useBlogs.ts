import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { logger } from '@/utils/logger';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/api/getblogs');
      setBlogs(res.data.blogs || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch blogs';
      setError(new Error(errorMsg));
      logger.error(errorMsg, err, 'useBlogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, isLoading, error, refetch: fetchBlogs };
};
