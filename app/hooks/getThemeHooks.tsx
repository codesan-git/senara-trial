import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useTheme = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/theme', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useTheme;
