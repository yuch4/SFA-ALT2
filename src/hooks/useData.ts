import { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

export interface UseDataOptions<T> {
  table: string;
  query?: any;
}

export function useData<T>(options: UseDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(options.table).select('*');
        
        if (options.query) {
          query = { ...query, ...options.query };
        }

        const { data: result, error } = await query;
        
        if (error) throw error;
        setData(result as T[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.table, options.query]);

  return { data, loading, error };
}