import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bet } from "../types";

interface MakeBetResponse {
  message: string;
  createdBet?: Bet;
}

interface MakeBetError {
  message: string;
  error?: string;
}

interface UseMakeBetResult {
  makeBet: (betData: { direction: "UP" | "DOWN" }) => Promise<Bet | undefined>;
  response: MakeBetResponse | null;
  error: MakeBetError | null;
  loading: boolean;
}

export const useMakeBet = (): UseMakeBetResult => {
  const queryClient = useQueryClient();
  const [auth] = useAuth();

  if (!auth) {
    throw new Error("User not found");
  }

  const mutation = useMutation<
    MakeBetResponse,
    MakeBetError,
    { direction: "UP" | "DOWN" }
  >({
    mutationFn: async (betData) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bets/make`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...betData, userId: auth?.id }),
        }
      );

      if (!res.ok) {
        const errorData: MakeBetError = await res.json();
        throw errorData;
      }

      return res.json();
    },

    onError: (_err, _newBet, context) => {
      queryClient.setQueryData(["userBets", auth?.id], context.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userBets", auth?.id] });
    },
  });

  return {
    makeBet: async (betData) => {
      const result = await mutation.mutateAsync(betData);
      return result?.createdBet;
    },
    response: mutation.data || null,
    error: mutation.error || null,
    loading: mutation.isPending,
  };
};
