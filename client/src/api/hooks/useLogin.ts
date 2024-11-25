import { useMutation } from "@tanstack/react-query";

import { User } from "../types";

interface LoginResponse {
  message: string;
  user?: User;
}

interface LoginError {
  message: string;
  error?: string;
}

interface UseLoginResult {
  login: (username: string) => Promise<User | undefined>;
  response: LoginResponse | null;
  error: LoginError | null;
  loading: boolean;
  isSuccess: boolean;
}

export const useLogin = (): UseLoginResult => {
  const mutation = useMutation<LoginResponse, LoginError, string>({
    mutationFn: async (username: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!res.ok) {
        const errorData: LoginError = await res.json();
        throw errorData;
      }

      const userData: LoginResponse = await res.json();

      return userData;
    },
  });

  return {
    login: async (username: string) => {
      const userData = await mutation.mutateAsync(username);
      return userData?.user;
    },
    response: mutation.data || null,
    error: mutation.error || null,
    loading: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
