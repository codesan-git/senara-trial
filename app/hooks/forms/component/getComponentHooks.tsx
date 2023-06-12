import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useComponent = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/component', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useComponent;