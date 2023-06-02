import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useProjects = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/project', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useProjects;