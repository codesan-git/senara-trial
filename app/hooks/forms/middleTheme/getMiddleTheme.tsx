import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useMiddleTheme = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/middleTheme', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useMiddleTheme;
