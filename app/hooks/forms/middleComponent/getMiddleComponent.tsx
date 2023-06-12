import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useMiddleComponent = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/middleComponent', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useMiddleComponent;
