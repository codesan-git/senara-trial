import useSWR from 'swr';

import fetcher from 'lib/fetcher';

const useRoomsId = (id:number) => {
  const { data, error, isLoading, mutate } = useSWR(`/api/rooms/${id}`, fetcher, {refreshInterval: 2000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useRoomsId;
