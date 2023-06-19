import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useComponentId = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/middleComponent/latestId', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useComponentId;
