import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useRooms = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/rooms', fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useRooms;
