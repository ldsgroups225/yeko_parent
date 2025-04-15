import { useState, useEffect, DependencyList } from 'react';

interface UseDataFetchingResult<T> {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  fetchData: () => Promise<void>;
}

const useDataFetching = <T>(
  fetchFunction: () => Promise<T | null>,
  dependencies: DependencyList = []
): UseDataFetchingResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    refreshing,
    fetchData: async () => {
      setRefreshing(true);
      await fetchData();
    },
  };
};

export default useDataFetching;
