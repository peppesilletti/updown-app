import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Bet } from "../types";

interface FetchUserBetsResponse {
  bets: Bet[];
}

interface FetchUserBetsError {
  message: string;
  error?: string;
}

export const useFetchUserBets = () => {
  const [auth] = useAuth();

  const { data, error, isLoading, isError } = useQuery<
    FetchUserBetsResponse,
    FetchUserBetsError
  >({
    queryKey: ["userBets", auth?.id],
    queryFn: async () => {
      if (!auth?.id) {
        throw new Error("User ID is required to fetch bets");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/${auth.id}/bets`
      );

      if (!res.ok) {
        const errorData: FetchUserBetsError = await res.json();
        throw errorData;
      }

      return res.json();
    },
    enabled: !!auth?.id,
    refetchInterval: 3000,
  });

  return {
    bets: data?.bets || [],
    error: isError ? error : null,
    loading: isLoading,
  };
};
