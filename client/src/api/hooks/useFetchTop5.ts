import { useQuery } from "@tanstack/react-query";
import { User } from "../types";

interface FetchTop5Response {
  users: User[];
}

interface FetchTop5Error {
  message: string;
  error?: string;
}

export const useFetchTop5 = () => {
  const { data, error, isLoading, isError } = useQuery<
    FetchTop5Response,
    FetchTop5Error
  >({
    queryKey: ["top5"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bets/top5`
      );

      if (!res.ok) {
        const errorData: FetchTop5Error = await res.json();
        throw errorData;
      }

      return res.json();
    },
    refetchInterval: 3000,
  });

  return {
    users: data?.users,
    error: isError ? error : null,
    loading: isLoading,
  };
};
