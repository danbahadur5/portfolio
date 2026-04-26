import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { logger } from '@/utils/logger';

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/api/getallproject');
      const normalizedProjects = (res.data.projects || []).map((project: any) => ({
        ...project,
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : typeof project.technologies === 'string'
          ? JSON.parse(project.technologies)
          : [],
        category: project.category || 'Other',
        featured: project.featured === true || project.featured === 'true',
      }));
      setProjects(normalizedProjects);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch projects';
      setError(new Error(errorMsg));
      logger.error(errorMsg, err, 'useProjects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
};
