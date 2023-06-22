import useSWR from 'swr';

import fetcher from 'lib/fetcher';

import { useParams } from "next/navigation"

const useRoomsParams = () => {
    const params = useParams()
    const id = params
    const { data, error, isLoading, mutate } = useSWR(`/api/rooms/${params}`, fetcher, { refreshInterval: 2000 });

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useRoomsParams;
