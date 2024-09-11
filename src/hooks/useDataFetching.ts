import { useCallback, useEffect, useState } from 'react';

interface UseDataFetchingResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refreshing: boolean;
  fetchData: () => Promise<void>;
}

function useDataFetching<T>(
  fetchFunction: () => Promise<T>,
  initialData: T | null = null
): UseDataFetchingResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refreshing, fetchData: handleRefresh };
}

export default useDataFetching;
