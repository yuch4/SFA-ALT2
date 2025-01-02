import { useState, useEffect, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

interface UseDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
}

export function useData<T>({ fetchFn, dependencies = [] }: UseDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [...dependencies]);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchData
  };
}