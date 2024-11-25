import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types";

interface FetchUserResponse {
  user: User;
}

interface FetchUserError {
  message: string;
  error?: string;
}

export const useFetchUser = () => {
  const [auth] = useAuth();

  const { data, error, isLoading, isError } = useQuery<
    FetchUserResponse,
    FetchUserError
  >({
    queryKey: ["user", auth?.id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/${auth?.id}`
      );

      if (!res.ok) {
        const errorData: FetchUserError = await res.json();
        throw errorData;
      }

      return res.json();
    },
    enabled: !!auth?.id,
    refetchInterval: 3000,
  });

  return {
    user: data?.user,
    error: isError ? error : null,
    loading: isLoading,
  };
};
