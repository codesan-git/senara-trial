import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useThemeId = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/middleTheme/latestId', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useThemeId;
